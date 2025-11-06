import { NextResponse } from "next/server";
import { writeMemory } from "@/lib/agents/memory";

export async function POST(request) {
  const body = await request.json();
  const { entityId, note, type = "activity" } = body || {};
  if (!entityId || !note) return NextResponse.json({ error: "Missing entityId/note" }, { status: 400 });
  await writeMemory([{ type, text: note }], { payload: { id: entityId } });
  return NextResponse.json({ ok: true });
}


