/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

/** Prefixo das imagens enviadas pelo painel; o resto vem de public/images. */
const MEDIA_PREFIX = "/media/";

interface Env {
  ASSETS?: Fetcher;
  DB: D1Database;
  MEDIA?: R2Bucket;
  IMAGES?: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const sourcePath = url.searchParams.get("url");

      // Imagens enviadas pelo painel não estão no manifesto de assets, então o
      // otimizador do vinext as recusa com "Invalid image URL". Elas são
      // resolvidas aqui, direto do R2, antes daquela validação.
      if (sourcePath?.startsWith(MEDIA_PREFIX)) {
        const object = env.MEDIA
          ? await env.MEDIA.get(
              decodeURIComponent(sourcePath.slice(MEDIA_PREFIX.length)),
            )
          : null;

        if (!object) {
          return new Response("Not found", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("cache-control", "public, max-age=31536000, immutable");

        if (!env.IMAGES) {
          return new Response(object.body, { headers });
        }

        const width = Number(url.searchParams.get("w") ?? 0);
        const quality = Number(url.searchParams.get("q") ?? 75);
        const result = await env.IMAGES.input(object.body)
          .transform(width > 0 ? { width } : {})
          .output({ format: "image/webp", quality });
        return result.response();
      }

      // The local Cloudflare runtime does not always expose image/asset
      // bindings. In that case, serve the original public asset instead of
      // crashing the application while preserving optimization in production.
      if (!env.ASSETS || !env.IMAGES) {
        if (!sourcePath) {
          return new Response("Missing image URL", { status: 400 });
        }

        const sourceUrl = new URL(sourcePath, request.url);

        if (sourceUrl.origin !== url.origin) {
          return new Response("Invalid image URL", { status: 400 });
        }

        return Response.redirect(sourceUrl, 307);
      }

      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: async (path) => {
          // O otimizador precisa alcançar tanto os assets versionados quanto
          // as imagens enviadas pelo painel, que moram no R2.
          if (path.startsWith(MEDIA_PREFIX) && env.MEDIA) {
            const object = await env.MEDIA.get(
              decodeURIComponent(path.slice(MEDIA_PREFIX.length)),
            );
            return object
              ? new Response(object.body)
              : new Response("Not found", { status: 404 });
          }
          return env.ASSETS!.fetch(new Request(new URL(path, request.url)));
        },
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (url.pathname.startsWith(MEDIA_PREFIX)) {
      const object = env.MEDIA
        ? await env.MEDIA.get(
            decodeURIComponent(url.pathname.slice(MEDIA_PREFIX.length)),
          )
        : null;

      if (!object) {
        return new Response("Not found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("cache-control", "public, max-age=31536000, immutable");
      return new Response(object.body, { headers });
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
