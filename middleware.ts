import { NextRequest, NextResponse } from "next/server";

// This middleware will run on all routes
// Adjust the matcher to protect specific routes
export function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/results",
    "/chat",
    "/book-appointment",
  ];

  const pathname = request.nextUrl.pathname;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get token from cookies or headers
    const token =
      request.cookies.get("authToken")?.value ||
      request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (auth endpoints)
     * - login
     * - signup
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth|login|signup).*)",
  ],
};
