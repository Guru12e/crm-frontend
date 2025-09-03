import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (session) {
    return NextResponse.json({ user: session.user }, { status: 200 });
  } else {
    return NextResponse.json({ user: null }, { status: 400 });
  }
}
