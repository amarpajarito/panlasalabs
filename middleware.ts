import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ["/", "/about", "/contact", "/login", "/signup"];
  const isPublicPath = publicPaths.some((path) => pathname === path);

  // Auth paths
  const isAuthPath =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // If user is logged in and tries to access auth pages, redirect to home
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to public paths and API routes
  if (
    isPublicPath ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // Protected paths - require authentication
  // Add your protected routes here
  const protectedPaths = ["/dashboard", "/profile", "/generate"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.svg$).*)",
  ],
};
