import { NextRequest, NextResponse } from "next/server";
import { verifyDrug, saveScanHistory } from "@/lib/verification";
import { getAuthUser } from "@/lib/auth";

// GET /api/verify?code=04-3275-CTBN-240601
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ success:false, error:"QR code is required" }, { status:400 });

  try {
    const result = await verifyDrug(code);
    const user   = getAuthUser(req);
    if (user) await saveScanHistory(user.userId, result, code).catch(() => {});
    return NextResponse.json({ success:true, data:result });
  } catch (e: unknown) {
    const err = e as { message?: string };
    return NextResponse.json({ success:false, error: err.message }, { status:500 });
  }
}
