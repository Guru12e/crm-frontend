import { supabase } from "@/utils/supabase/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session) {
    const { data } = await supabase
      .from("Users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    return NextResponse.json(data, { status: 200 });
  } else {
    return NextResponse.json({ user: null }, { status: 400 });
  }
}
