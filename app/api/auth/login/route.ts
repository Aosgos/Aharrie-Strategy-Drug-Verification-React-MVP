import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { loginUser, AUTH_COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = z.object({
      email: z.string().email(), password: z.string().min(1),
    }).parse(await req.json());
    const { user, token } = await loginUser(email, password);

    const res = NextResponse.json({ success:true, data:{ user, token } });
    res.cookies.set("aharrie_token", token, AUTH_COOKIE_OPTIONS);
    return res;
  } catch (e: unknown) {
    const err = e as { errors?: { message: string }[]; message?: string };
    return NextResponse.json({ success:false, error: err.errors?.[0]?.message ?? err.message }, { status:401 });
  }
}
