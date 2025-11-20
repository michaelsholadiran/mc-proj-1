// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const guestRoutes = ["/login", "/reset-password", "/forgot-password"];

export function middleware(request: NextRequest) {
  // AUTHENTICATION GUARDS COMMENTED OUT FOR TESTING - ALLOWING ALL ROUTES
  // const token = request.cookies.get("cred-crm-ticket-tok")?.value;
  // const { pathname } = request.nextUrl;

  // const isGuestRoute = guestRoutes.some((route) => pathname.startsWith(route));

  // 🚫 If user is NOT logged in and tries to access protected route
  // COMMENTED OUT FOR TESTING
  // if (!token && !isGuestRoute) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // 🚫 If user IS logged in and tries to access guest-only route
  // COMMENTED OUT FOR TESTING
  // if (token && isGuestRoute) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

// ✅ Make sure middleware runs for both guest and protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/kyci-dashboard/:path*",
    "/kyc-supervisor/:path*",
    "/kyc-approval-supervisor/:path*",
    "/physical-verification/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/login",
    "/reset-password",
    "/forgot-password",
  ],
};
