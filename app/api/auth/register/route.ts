import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerUser, AUTH_COOKIE_OPTIONS } from "@/lib/auth";

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

    const res = NextResponse.json({ success:true, data:{ user, token } }, { status:201 });
    res.cookies.set("aharrie_token", token, AUTH_COOKIE_OPTIONS);
    return res;
  } catch (e: unknown) {
    const err = e as { errors?: { message: string }[]; message?: string };
    return NextResponse.json({ success:false, error: err.errors?.[0]?.message ?? err.message }, { status:400 });
  }
}
