import { NextRequest, NextResponse } from "next/server";
import { getAllReports } from "@/lib/reports";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "pharmacist")
    return NextResponse.json({ success:false, error:"Pharmacist access required" }, { status:403 });
  const page   = Number(req.nextUrl.searchParams.get("page"))   || 1;
  const limit  = Number(req.nextUrl.searchParams.get("limit"))  || 20;
  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  const result = await getAllReports(page, limit, status);
  return NextResponse.json({ success:true, ...result });
}
