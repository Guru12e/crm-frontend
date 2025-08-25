import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  const data = await req.json();

  const supabase = await createClient();

  try {
    const { data: deal, error } = await supabase
      .from("Deals")
      .insert({
        name: data.name,
        owner: data.owner,
        email: data.email,
        number: data.phone,
        title: data.title,
        value: data.value,
        status: data.status,
        closeDate: data.closeDate,
        source: data.source,
        priority: data.priority,
        user_email: data.session.user.email,
      })
      .select("*");

    if (error) {
      console.error(error);
      return NextResponse.json("error", { status: 400 });
    }
    return NextResponse.json(deal, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json("error", { status: 400 });
  }
}
