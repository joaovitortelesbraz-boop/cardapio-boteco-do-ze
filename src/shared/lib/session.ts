const ALGORITHM: HmacKeyGenParams = { name: "HMAC", hash: "SHA-256" };

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    ALGORITHM,
    false,
    ["sign", "verify"],
  );
}

async function dummyVerify(secret: string): Promise<void> {
  const key = await getKey(secret);
  await crypto.subtle.verify(
    "HMAC",
    key,
    new Uint8Array(32),
    new Uint8Array(0),
  );
}

export async function createSignedSession(
  sessionId: string,
  secret: string,
): Promise<string> {
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(sessionId),
  );
  return `${sessionId}.${bytesToHex(new Uint8Array(sig))}`;
}

export async function verifySessionCookie(
  cookieValue: string,
  secret: string,
): Promise<string | null> {
  const parts = cookieValue.split(".");

  if (parts.length !== 2 || !/^[0-9a-f]{64}$/.test(parts[1])) {
    await dummyVerify(secret);
    return null;
  }

  const [sessionId, signatureHex] = parts;

  const key = await getKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    hexToBytes(signatureHex),
    new TextEncoder().encode(sessionId),
  );

  return valid ? sessionId : null;
}
