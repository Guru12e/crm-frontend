import { createClient } from "@/utils/supabase/server";

export async function logRunStart({ event }) {
  const supabase = await createClient();
  console.log("Attempting to insert into agentruns...");
  const { data, error } = await supabase
    .from("agentruns")
    .insert({
      event_type: event?.type,
      event_payload: event?.payload || {},
      status: "started",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error) {
    console.error("Failed to insert into agentruns:", error);
    return null;
  }
  console.log("Successfully inserted run with ID:", data?.id);
  return data?.id || null;
}

export async function logRunEnd({ runId, actions, notes, executionResults, error }) {
  if (!runId) return;
  const supabase = await createClient();
  await supabase
    .from("agentruns")
    .update({
      status: error ? "error" : "completed",
      actions: actions || [],
      notes: notes || "",
      execution_results: executionResults || [],
      ended_at: new Date().toISOString(),
      error_message: error?.message || null,
    })
    .eq("id", runId);
}


