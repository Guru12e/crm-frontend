import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || 10);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agentruns")
    .select("id,event_type,status,started_at,ended_at,actions,notes,error_message")
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, runs: data || [] });
}


