import { NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { requireAdmin } from "@/src/shared/lib/admin-auth";
import {
  MAX_IMAGE_BYTES,
  MEDIA_URL_PREFIX,
  buildObjectKey,
  validateImage,
} from "@/src/shared/lib/image-upload";

export const dynamic = "force-dynamic";

interface UploadEnv {
  MEDIA?: R2Bucket;
}

export async function POST(request: Request) {
  // /admin/api/* fica fora do matcher do middleware, então a sessão é
  // validada aqui — sem isto o endpoint ficaria aberto.
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const bucket = (env as unknown as UploadEnv).MEDIA;
  if (!bucket) {
    return NextResponse.json(
      { error: "Storage de imagens não configurado (binding MEDIA ausente)." },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_IMAGE_BYTES * 1.1) {
    return NextResponse.json(
      { error: "Imagem acima do limite de 5 MB." },
      { status: 413 },
    );
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const value = formData.get("file");
    if (value instanceof File) file = value;
  } catch {
    return NextResponse.json({ error: "Envio inválido." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json(
      { error: "Nenhum arquivo enviado." },
      { status: 400 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = validateImage(file.name, file.type, bytes.byteLength, bytes);

  if (!check.ok || !check.type || !check.extension) {
    return NextResponse.json(
      { error: check.error ?? "Imagem inválida." },
      { status: 400 },
    );
  }

  const key = buildObjectKey(check.extension);

  await bucket.put(key, bytes, {
    httpMetadata: {
      contentType: check.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  return NextResponse.json({
    url: `${MEDIA_URL_PREFIX}${key}`,
    fileName: file.name,
    size: bytes.byteLength,
  });
}
