import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerUser } from "@/lib/auth";

const Schema = z.object({
  email: z.string().email(), password: z.string().min(6),
  name: z.string().min(2), role: z.enum(["patient","pharmacist"]),
  pharmacyName: z.string().optional(), pcnLicence: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = Schema.parse(await req.json());
    if (body.role === "pharmacist" && !body.pcnLicence)
      return NextResponse.json({ success:false, error:"PCN licence required for pharmacists" }, { status:400 });
    const { user, token } = await registerUser(body);
    return NextResponse.json({ success:true, data:{ user, token } }, { status:201 });
  } catch (e: unknown) {
    const err = e as { errors?: { message: string }[]; message?: string };
    return NextResponse.json({ success:false, error: err.errors?.[0]?.message ?? err.message }, { status:400 });
  }
}
