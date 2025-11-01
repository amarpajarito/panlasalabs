import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware to handle authentication and route protection
 * Runs on every request matching the config.matcher pattern
 */
export async function middleware(request: NextRequest) {
  // Extract JWT token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Define public routes (accessible without authentication)
  const publicPaths = [
    "/",
    "/about",
    "/contact",
    "/login",
    "/signup",
    "/allrecipes",
    "/recipe",
  ];
  const isPublicPath = publicPaths.some((path) => pathname === path);

  // Check if user is accessing authentication pages
  const isAuthPath =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // Redirect authenticated users away from auth pages
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to public paths, API routes, and Next.js internal routes
  if (
    isPublicPath ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // Define protected routes (require authentication)
  const protectedPaths = ["/profile"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Redirect unauthenticated users to login with callback URL
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.svg$).*)",
  ],
};
