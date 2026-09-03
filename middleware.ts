import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "@/src/shared/lib/session";
import { env } from "cloudflare:workers";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let sessionValid: string | null = null;
  try {
    const hmacSecret = env.HMAC_SECRET;
    const cookieValue = request.cookies.get("admin_session")?.value ?? "";
    sessionValid = hmacSecret
      ? await verifySessionCookie(cookieValue, hmacSecret)
      : null;
  } catch {
    sessionValid = null;
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !pathname.startsWith("/admin/api/")) {
    if (!sessionValid) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/admin/login") {
    if (sessionValid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
