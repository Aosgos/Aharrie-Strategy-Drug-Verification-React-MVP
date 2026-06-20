import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, getUserById } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const jwt = getAuthUser(req);
  if (!jwt) return NextResponse.json({ success:false, error:"Unauthorized" }, { status:401 });
  const user = await getUserById(jwt.userId);
  if (!user) return NextResponse.json({ success:false, error:"User not found" }, { status:404 });
  return NextResponse.json({ success:true, data:user });
}
