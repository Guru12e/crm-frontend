import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request, { params }) {
  const { id } = params;
  let { ownerId } = await request.json();
  const supabase = await createClient();

  if (!ownerId || ownerId === "auto") {
    // Heuristic: choose owner with best win rate, fallback to least open leads
    const { data: leads } = await supabase.from("Leads").select("owner,status");
    const stats = new Map();
    for (const l of leads || []) {
      if (!l.owner) continue;
      const s = stats.get(l.owner) || { total: 0, won: 0, open: 0 };
      s.total += 1;
      if (l.status === "Closed-won") s.won += 1;
      if (!l.status || (l.status !== "Closed-won" && l.status !== "Closed-lost")) s.open += 1;
      stats.set(l.owner, s);
    }
    let best = null;
    for (const [owner, s] of stats.entries()) {
      const rate = s.total ? s.won / s.total : 0;
      if (!best) best = { owner, rate, open: s.open };
      else if (rate > best.rate || (rate === best.rate && s.open < best.open)) best = { owner, rate, open: s.open };
    }
    ownerId = best?.owner || ownerId;
  }

  if (!ownerId) return NextResponse.json({ error: "No owner resolvable" }, { status: 400 });

  const { data, error } = await supabase
    .from("Leads")
    .update({ owner: ownerId })
    .eq("id", id)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}


