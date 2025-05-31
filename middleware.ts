import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  console.log("Middleware executed for:", req.nextUrl.pathname);

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  console.log("Token:", token);

  const protectedRoutes = ["/home", "/student", "/instructor", "/admin"];
  // const studentRoutes = ["/student"];
  // const instructorRoutes = ["/instructor"];
  // const adminRoutes = ["/admin"];

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
  // Check if the user is a student and trying to access student routes
  // if (studentRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
  //   if (!token || token.role !== "student") {
  //     console.log("Access denied for non-student user");
  //     return NextResponse.redirect(new URL("/home", req.url));
  //   }
  // }

  // Check if the user is an instructor and trying to access instructor routes
  // if (
  //   instructorRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  // ) {
  //   if (!token || token.role !== "instructor") {
  //     console.log("Access denied for non-instructor user");
  //     return NextResponse.redirect(new URL("/home", req.url));
  //   }
  // }

  // Check if the user is an admin and trying to access admin routes
  // if (adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
  //   if (!token || token.role !== "admin") {
  //     console.log("Access denied for non-admin user");
  //     return NextResponse.redirect(new URL("/home", req.url));
  //   }
  // }
  console.log("Token found, allowing access");
  return NextResponse.next();
}
