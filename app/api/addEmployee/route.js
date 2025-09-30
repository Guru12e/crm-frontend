import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  const data = await req.json();

  const supabase = await createClient();

  try {
    const orConditions = [];

    if (data.email) {
      orConditions.push(`email.eq.${data.email}`);
    }

    if (data.phone) {
      orConditions.push(`number.eq.${data.phone}`);
    }

    const { data: existingDeal, error: exError } = await supabase
      .from("Deals")
      .select("*")
      .or(orConditions.join(","))
      .eq("user_email", data.session.user.email)
      .single();

    if (exError && exError.code !== "PGRST116") {
      return NextResponse.json({ error: exError.message }, { status: 500 });
    }

    if (existingDeal) {
      return NextResponse.json("exists", { status: 401 });
    }

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
        products: data.products,
        user_email: data.session.user.email,
      })
      .select("*");

    return NextResponse.json(deal, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json("error", { status: 400 });
  }
}
