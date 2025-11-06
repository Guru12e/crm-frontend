import { createClient } from "@/utils/supabase/server";

// Supabase-backed memory
export async function getRecentMemory(event) {
  const entityId = event?.payload?.id || "unknown";
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("AgentMemory")
    .select("content, type, created_at")
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) return [];
  return (data || []).map((row) => row.content || { type: row.type });
}

export async function writeMemory(writes = [], event) {
  if (!writes?.length) return;
  const entityId = event?.payload?.id || "unknown";
  const supabase = await createClient();
  const rows = writes.map((w) => ({ entity_id: entityId, type: w.type || "note", content: w, created_at: new Date().toISOString() }));
  await supabase.from("AgentMemory").insert(rows);
}


