import { GoogleGenerativeAI } from "@google/generative-ai";

const hasGemini = !!process.env.GEMINI_API_KEY;
const client = hasGemini ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

function buildPrompt({ event, crmSnapshot, memoryContext }) {
  const context = JSON.stringify({ event, crmSnapshot, memoryContext });
  return `
You are a CRM Agent Reasoner. Decide the next best actions based on the event and context.

Return ONLY valid JSON in this exact format:
{
  "actions": [
    { "type": "SendEmail", "args": { "to": "...", "subject": "...", "body": "..." } },
    { "type": "CreateTask", "args": { "assigneeId": "...", "title": "...", "dueDate": "..." } }
  ],
  "notes": "...",
  "memoryWrites": []
}

Context: ${context}
`;
}

export async function runReasoning(input) {
  // Fallback rule-based baseline
  const baseline = ruleBasedPlan(input);

  if (!hasGemini) {
    console.warn(" Gemini API key missing — using baseline rule plan.");
    return baseline;
  }

  try {
    const prompt = buildPrompt(input);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const model = client.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(prompt);
    let text = result.response?.text() || "{}";

    text = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("  Gemini JSON parse failed, using baseline:", err, text);
      parsed = {};
    }

    return parsed;
  } catch (err) {
    console.error("⚠️ Gemini reasoning failed:", err);
    return baseline;
  }
}

function ruleBasedPlan({ event, crmSnapshot }) {
  console.log("ruleBasedPlan called with event:", event);
  const actions = [];
  const memoryWrites = [];
  let notes = "";

  if (event?.type === "LeadCreated") {
    console.log("Processing LeadCreated event");
    const lead = crmSnapshot?.details || event?.payload || {};
    console.log("Lead data:", lead);
    const to = lead.email || undefined;

    if (to) {
      actions.push({
        type: "SendEmail",
        args: {
          to,
          subject: "Welcome to our product",
          body: "Hi, thanks for your interest. We will reach out shortly.",
        },
      });
    }

    actions.push({
      type: "CreateTask",
      args: {
        assigneeId: lead.owner || "auto",
        title: `Follow up with ${lead.name || lead.id}`,
        dueAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      },
    });

    notes = "LeadCreated baseline: send intro email and create follow-up task.";
    memoryWrites.push({ type: "note", text: "Auto follow-up scheduled for new lead." });
  }

  if (event?.type === "LeadStatusChanged" && event?.payload?.newStatus === "Qualified") {
    console.log("Processing LeadStatusChanged to Qualified");
    actions.push({
      type: "CreateTask",
      args: {
        assigneeId: event?.payload?.owner || "auto",
        title: "Prepare proposal",
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    });
    notes = "Lead qualified: created proposal task.";
    memoryWrites.push({ type: "note", text: "Lead moved to Qualified; proposal task created." });
  }

  if (event?.type === "DealLost") {
    console.log("Processing DealLost event");
    actions.push({
      type: "UpdateCRMField",
      args: { entity: "deals", id: event?.payload?.id, field: "status", value: "Closed-lost" },
    });
    notes = "Deal lost: status updated.";
    memoryWrites.push({ type: "note", text: "Deal marked Closed-lost." });
  }

  console.log("ruleBasedPlan returning:", { actions, notes, memoryWrites });
  return { actions, notes, memoryWrites };
}
