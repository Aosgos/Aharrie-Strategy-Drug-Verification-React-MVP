import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Routes that require authentication
const PROTECTED = ["/home", "/dashboard", "/scan", "/result", "/manual", "/report", "/history", "/pharmacies", "/account", "/analytics", "/dispensing"];
// Routes only for pharmacists
const PHARMACIST_ONLY = ["/dashboard", "/analytics", "/dispensing"];
// Routes only for patients
const PATIENT_ONLY = ["/home", "/history", "/pharmacies"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("aharrie_token")?.value ??
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/role", req.url));
  }

  try {
    const payload = verifyToken(token);

    // Role guards
    if (PHARMACIST_ONLY.some(p => pathname.startsWith(p)) && payload.role !== "pharmacist") {
      return NextResponse.redirect(new URL("/home", req.url));
    }
    if (PATIENT_ONLY.some(p => pathname.startsWith(p)) && payload.role !== "patient") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/role", req.url));
  }
}

export const config = {
  matcher: ["/home/:path*", "/dashboard/:path*", "/scan/:path*", "/result/:path*",
            "/manual/:path*", "/report/:path*", "/history/:path*",
            "/pharmacies/:path*", "/account/:path*", "/analytics/:path*", "/dispensing/:path*"],
};
