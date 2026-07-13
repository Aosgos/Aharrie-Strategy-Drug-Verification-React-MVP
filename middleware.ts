import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PROTECTED = [
  "/home","/dashboard","/scan","/result","/manual",
  "/report","/history","/pharmacies","/account",
  "/analytics","/dispensing","/rewards",
];
const PHARMACIST_ONLY = ["/dashboard","/analytics","/dispensing"];
const PATIENT_ONLY    = ["/home","/history","/pharmacies"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PROTECTED.some(p => pathname.startsWith(p))) return NextResponse.next();

  const token =
    req.cookies.get("aharrie_token")?.value ??
    req.headers.get("authorization")?.replace("Bearer ","");

  if (!token) return NextResponse.redirect(new URL("/role", req.url));

  try {
    const payload = await verifyToken(token);
    if (PHARMACIST_ONLY.some(p => pathname.startsWith(p)) && payload.role !== "pharmacist")
      return NextResponse.redirect(new URL("/home", req.url));
    if (PATIENT_ONLY.some(p => pathname.startsWith(p)) && payload.role !== "patient")
      return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/role", req.url));
  }
}

export const config = {
  matcher: [
    "/home/:path*","/dashboard/:path*","/scan/:path*","/result/:path*",
    "/manual/:path*","/report/:path*","/history/:path*","/pharmacies/:path*",
    "/account/:path*","/analytics/:path*","/dispensing/:path*","/rewards/:path*",
  ],
};
