import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { assigneeId, title, dueAt, metadata,leadId } = await request.json();

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ assigneeId, title, dueAt, metadata, lead_id: leadId }])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error("POST /api/tasks error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


