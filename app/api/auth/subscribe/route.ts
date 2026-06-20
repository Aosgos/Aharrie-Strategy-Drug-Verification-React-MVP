import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser, updateSubscription } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const jwt = getAuthUser(req);
  if (!jwt) return NextResponse.json({ success:false, error:"Unauthorized" }, { status:401 });
  if (jwt.role !== "pharmacist")
    return NextResponse.json({ success:false, error:"Only pharmacists can subscribe" }, { status:403 });
  try {
    const { plan } = z.object({ plan: z.enum(["basic","professional","enterprise"]) }).parse(await req.json());
    const user = await updateSubscription(jwt.userId, plan);
    return NextResponse.json({ success:true, data:user });
  } catch (e: unknown) {
    const err = e as { message?: string };
    return NextResponse.json({ success:false, error: err.message }, { status:400 });
  }
}
