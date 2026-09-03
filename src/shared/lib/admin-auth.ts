import { cookies } from "next/headers";
import { verifySessionCookie } from "./session";
import { env } from "cloudflare:workers";

export async function requireAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");

    if (!sessionCookie) {
      return false;
    }

    const hmacSecret = env.HMAC_SECRET;
    if (!hmacSecret) {
      return false;
    }

    const sessionId = await verifySessionCookie(sessionCookie.value, hmacSecret);
    if (!sessionId) {
      return false;
    }

    const { getDb } = await import("@/db/index");
    const { sessions } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const db = getDb();
    const result = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    return result.length > 0;
  } catch {
    return false;
  }
}
