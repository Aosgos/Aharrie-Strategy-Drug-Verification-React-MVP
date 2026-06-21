import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyDrug, saveScanHistory } from "@/lib/verification";
import { getAuthUser } from "@/lib/auth";

// POST /api/verify/batch  { nafdacNumber, batchNumber }
export async function POST(req: NextRequest) {
  try {
    const { nafdacNumber, batchNumber } = z.object({
      nafdacNumber: z.string().min(1), batchNumber: z.string().min(1),
    }).parse(await req.json());
    const code   = `${nafdacNumber.trim().toUpperCase()}-${batchNumber.trim().toUpperCase()}`;
    const result = await verifyDrug(code);
    const user   = await getAuthUser(req);
    if (user) await saveScanHistory(user.userId, result, code).catch(() => {});
    return NextResponse.json({ success:true, data:result });
  } catch (e: unknown) {
    const err = e as { errors?: { message: string }[]; message?: string };
    return NextResponse.json({ success:false, error: err.errors?.[0]?.message ?? err.message }, { status:400 });
  }
}
