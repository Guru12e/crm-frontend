import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";


export async function GET(request, context) {
  const params = await context.params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("Leads").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request, context) {
  const params = await context.params;
  const updates = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase.from("Leads").update(updates).eq("id", params.id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
