import { NextRequest, NextResponse } from "next/server";
import { getUserReports } from "@/lib/reports";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ success:false, error:"Unauthorized" }, { status:401 });
  const reports = await getUserReports(user.userId);
  return NextResponse.json({ success:true, data:reports });
}
