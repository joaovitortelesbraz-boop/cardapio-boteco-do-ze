import { NextResponse } from "next/server";
import { createSignedSession } from "@/src/shared/lib/session";
import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  console.log("[LOGIN] route POST iniciado");

  const formData = await request.formData();
  const password = formData.get("password") as string;
  const expectedPassword = env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=no-password", request.url), 303);
  }

  if (password !== expectedPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }

  const hmacSecret = env.HMAC_SECRET;
  if (!hmacSecret) {
    return NextResponse.redirect(new URL("/admin/login?error=no-secret", request.url), 303);
  }

  const sessionId = generateSessionId();

  let dbError = false;
  try {
    const { getDb } = await import("@/db/index");
    const { sessions } = await import("@/db/schema");

    const db = getDb();
    await db.insert(sessions).values({
      id: sessionId,
      createdAt: Math.floor(Date.now() / 1000),
    });
  } catch {
    dbError = true;
  }

  if (dbError) {
    return NextResponse.redirect(new URL("/admin/login?error=db", request.url), 303);
  }

  const signedValue = await createSignedSession(sessionId, hmacSecret);

  console.log("[LOGIN] cookie a setar:", signedValue);

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set("admin_session", signedValue, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
