/* eslint-disable */
import fetch from "node-fetch";

const base = process.env.APP_BASE_URL || "http://localhost:3000";

async function main() {
  // 1) Create lead
  const createRes = await fetch(`${base}/api/agents/test/createLead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "E2E Jane", email: `e2e.${Date.now()}@example.com` }),
  });
  const created = await createRes.json();
  if (!created?.ok) throw new Error(`Create lead failed: ${JSON.stringify(created)}`);
  const lead = created.lead;
  console.log("Lead created:", lead.id);

  // 2) Trigger event
  const eventRes = await fetch(`${base}/api/agents/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "LeadCreated", payload: { id: lead.id, email: lead.email, name: lead.name, owner: lead.owner || "auto" } }),
  });
  const eventOut = await eventRes.json();
  if (!eventRes.ok) throw new Error(`Event failed: ${JSON.stringify(eventOut)}`);
  console.log("Event actions:", eventOut.actions?.length || 0);

  // 3) Poll memory and runs
  await new Promise((r) => setTimeout(r, 1500));
  const pollRes = await fetch(`${base}/api/agents/test/poll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityId: lead.id }),
  });
  const polled = await pollRes.json();
  console.log("Recent runs:", polled.runs?.length || 0, "memory:", polled.memory?.length || 0);

  console.log("OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


