/** Regras de upload de imagem compartilhadas entre o formulário e a rota. */

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

const EXTENSION_BY_TYPE: Record<AllowedImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Aceito no atributo accept do input e na validação de extensão. */
export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

export function formatBytes(bytes: number): string {
  // Duas casas: com uma só, 5,01 MB e o limite de 5 MB apareciam ambos como
  // "5.0 MB" e a mensagem de erro ficava sem sentido.
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot === -1 ? "" : fileName.slice(dot + 1).toLowerCase();
}

/**
 * Detecta o tipo pelos bytes iniciais do arquivo. O content-type declarado
 * pelo cliente é palpite — quem manda é o conteúdo, senão bastaria renomear
 * um executável para .png para burlar a validação.
 */
export function sniffImageType(bytes: Uint8Array): AllowedImageType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 8 && png.every((b, i) => bytes[i] === b)) {
    return "image/png";
  }

  // RIFF....WEBP
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

export interface ImageValidationResult {
  ok: boolean;
  error?: string;
  type?: AllowedImageType;
  extension?: string;
}

/** Valida extensão, content-type declarado, tamanho e bytes reais. */
export function validateImage(
  fileName: string,
  declaredType: string,
  size: number,
  bytes: Uint8Array,
): ImageValidationResult {
  if (size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      error: `Imagem tem ${formatBytes(size)}; o limite é ${formatBytes(MAX_IMAGE_BYTES)}.`,
    };
  }

  if (size === 0) {
    return { ok: false, error: "Arquivo vazio." };
  }

  const extension = extensionOf(fileName);
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(extension)) {
    return {
      ok: false,
      error: "Extensão não permitida. Use JPG, PNG ou WEBP.",
    };
  }

  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(declaredType)) {
    return { ok: false, error: "Tipo de arquivo não permitido." };
  }

  const sniffed = sniffImageType(bytes);
  if (!sniffed) {
    return {
      ok: false,
      error: "O conteúdo do arquivo não é uma imagem JPG, PNG ou WEBP.",
    };
  }

  if (sniffed !== declaredType) {
    return {
      ok: false,
      error: "O conteúdo do arquivo não corresponde ao tipo informado.",
    };
  }

  return { ok: true, type: sniffed, extension: EXTENSION_BY_TYPE[sniffed] };
}

/** Nome único: evita colisão e não reaproveita nada vindo do cliente. */
export function buildObjectKey(extension: string): string {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  return `produtos/${stamp}/${crypto.randomUUID()}.${extension}`;
}

export const MEDIA_URL_PREFIX = "/media/";

export function isUploadedImageUrl(url: string | null | undefined): boolean {
  return typeof url === "string" && url.startsWith(MEDIA_URL_PREFIX);
}

export function objectKeyFromUrl(url: string): string {
  return decodeURIComponent(url.slice(MEDIA_URL_PREFIX.length));
}
