import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  const supabase = await createClient();
  const body = await request.json();
  const userEmail = body.user_email || process.env.TEST_USER_EMAIL || "test@example.com";
  const lead = {
    name: body.name || "Test Lead",
    email: body.email || `lead+${Date.now()}@example.com`,
    number: body.number || "0000000000",
    status: body.status || "New",
    source: body.source || "LinkedIn",
    user_email: userEmail,
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("Leads").insert(lead).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, lead: data });
}


