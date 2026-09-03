import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "@/src/shared/lib/session";
import { env } from "cloudflare:workers";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("[MW] executou:", pathname);

  let sessionValid: string | null = null;
  try {
    const hmacSecret = env.HMAC_SECRET;
    const cookieValue = request.cookies.get("admin_session")?.value ?? "";
    console.log("[MW] cookie recebido:", cookieValue || "(vazio)");
    sessionValid = hmacSecret
      ? await verifySessionCookie(cookieValue, hmacSecret)
      : null;
    console.log("[MW] sessionValid:", sessionValid);
  } catch {
    sessionValid = null;
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !pathname.startsWith("/admin/api/")) {
    if (!sessionValid) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      console.log("[MW] redirecionando para:", loginUrl.toString());
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/admin/login") {
    if (sessionValid) {
      console.log("[MW] redirecionando para:", new URL("/admin", request.url).toString());
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
