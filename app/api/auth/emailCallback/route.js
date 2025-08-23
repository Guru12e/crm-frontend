import { createClient } from "@/utils/supabase/server";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);

  const supabase = await createClient();
  const session = await getServerSession(authOptions);

  const { data: data, error: error } = await supabase
    .from("Users")
    .update({
      refresh_token: tokens.refresh_token,
    })
    .eq("email", session.user.email);

  console.log(data);

  if (error) {
    console.log(error);
    return NextResponse.redirect("http://localhost:3000/home");
  }
  return NextResponse.redirect("http://localhost:3000/home");
}
