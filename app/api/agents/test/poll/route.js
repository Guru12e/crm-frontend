import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  const { entityId } = await request.json();
  if (!entityId) return NextResponse.json({ error: "Missing entityId" }, { status: 400 });
  const supabase = await createClient();
  const { data: runs } = await supabase
    .from("agentruns")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(5);
  const { data: mem } = await supabase
    .from("AgentMemory")
    .select("*")
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(10);
  return NextResponse.json({ ok: true, runs: runs || [], memory: mem || [] });
}


