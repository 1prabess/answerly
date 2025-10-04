import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const authRoutes = ["/login", "/register"];

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const session = getSessionCookie(request);
  const isLoggedIn = !!session;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (isLoggedIn && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  if (!isLoggedIn && !authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
