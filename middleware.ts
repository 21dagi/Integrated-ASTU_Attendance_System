import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  console.log("Middleware executed for:", req.nextUrl.pathname);

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  console.log("Token:", token); 

  
  const protectedRoutes = ["/"];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    console.log("No token found, redirecting to sign-in");
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url); // Redirect back after login
    return NextResponse.redirect(signInUrl);
  }

  console.log("Token found, allowing access");
  return NextResponse.next();
}
