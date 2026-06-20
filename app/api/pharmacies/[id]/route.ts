import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase.from("pharmacies").select("*").eq("id", params.id).single();
  if (error || !data) return NextResponse.json({ success:false, error:"Pharmacy not found" }, { status:404 });
  return NextResponse.json({ success:true, data });
}
