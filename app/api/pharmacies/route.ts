import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const q        = req.nextUrl.searchParams.get("q");
  const state    = req.nextUrl.searchParams.get("state");
  const verified = req.nextUrl.searchParams.get("verified");

  let query = supabase.from("pharmacies").select("*");
  if (q)        query = query.ilike("name", `%${q}%`);
  if (state)    query = query.eq("state", state);
  if (verified) query = query.eq("verified", verified === "true");
  query = query.order("trust_score", { ascending: false });

  const { data, error } = await query;
  if (error) return NextResponse.json({ success:false, error: error.message }, { status:500 });
  return NextResponse.json({ success:true, data: data || [] });
}
