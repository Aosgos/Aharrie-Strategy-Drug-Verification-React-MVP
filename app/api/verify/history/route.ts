import { NextRequest, NextResponse } from "next/server";
import { getScanHistory } from "@/lib/verification";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success:false, error:"Unauthorized" }, { status:401 });
  const page  = Number(req.nextUrl.searchParams.get("page"))  || 1;
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 20;
  const result = await getScanHistory(user.userId, page, limit);
  return NextResponse.json({ success:true, ...result });
}
