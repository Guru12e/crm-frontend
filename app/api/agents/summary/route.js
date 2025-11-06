import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Intended to be triggered by a scheduler (Vercel Cron or external)
export async function POST() {
  const supabase = await createClient();
  const { data: leads } = await supabase.from("Leads").select("id,status,source,owner,created_at");
  const { data: deals } = await supabase.from("Deals").select("id,status,value,owner,created_at");

  const stats = {
    leads: {
      total: leads?.length || 0,
      qualified: (leads || []).filter((l) => l.status === "Qualified").length,
      bySource: groupCount(leads || [], (l) => l.source || "unknown"),
    },
    deals: {
      total: deals?.length || 0,
      won: (deals || []).filter((d) => d.status === "Closed-won").length,
      lost: (deals || []).filter((d) => d.status === "Closed-lost").length,
      valueSum: (deals || []).reduce((a, d) => a + Number(d.value || 0), 0),
    },
  };

  return NextResponse.json({ ok: true, stats });
}

function groupCount(items, by) {
  const map = new Map();
  for (const it of items) {
    const k = by(it);
    map.set(k, (map.get(k) || 0) + 1);
  }
  return Array.from(map.entries()).map(([k, v]) => ({ key: k, count: v }));
}


