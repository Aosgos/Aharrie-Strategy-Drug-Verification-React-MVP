import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createReport } from "@/lib/reports";
import { getAuthUser } from "@/lib/auth";

const Schema = z.object({
  drugName: z.string().min(2), batchNumber: z.string().min(1),
  nafdacNumber: z.string().optional(), location: z.string().min(2),
  reportType: z.enum(["fake_packaging","wrong_appearance","no_effect","bad_reaction"]),
  details: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success:false, error:"Unauthorized" }, { status:401 });
  try {
    const body   = Schema.parse(await req.json());
    const report = await createReport({ ...body, userId: user.userId });
    return NextResponse.json({ success:true, data:report }, { status:201 });
  } catch (e: unknown) {
    const err = e as { errors?: { message: string }[]; message?: string };
    return NextResponse.json({ success:false, error: err.errors?.[0]?.message ?? err.message }, { status:400 });
  }
}
