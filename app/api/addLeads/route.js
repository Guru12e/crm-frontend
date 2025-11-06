import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  const data = await request.json();

  const supabase = await createClient();

  try {
    const { data: lead, error } = await supabase
      .from("Leads")
      .insert({
        name: data.name,
        email: data.email,
        number: data.phone,
        age: data.age,
        linkedIn: data.linkedIn,
        industry: data.industry,
        company: data.company,
        income: data.income,
        website: data.website,
        status: data.status,
        source: data.source,
        address: data.address,
        description: data.description,
        user_email: data.session.user.email,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Auto-trigger LeadCreated agent event
    // try {
    //   const appBase = process.env.APP_BASE_URL || "http://localhost:3000";
    //   const created = lead;
    //   await fetch(`${appBase}/api/agents/events`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       type: "LeadCreated",
    //       payload: {
    //         id: created?.id,
    //         name: created?.name,
    //         email: created?.email,
    //         owner: created?.owner || "auto",
    //         source: created?.source || "Unknown",
    //       },
    //     }),
    //   });
    // } catch (_) {}

    return NextResponse.json(lead, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json("error", { status: 400 });
  }
}
