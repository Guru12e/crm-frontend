import { GoogleGenerativeAI } from "@google/generative-ai";

// -------------------------------
// GEMINI CLIENT
// -------------------------------
const hasGemini = !!process.env.GEMINI_API_KEY;
const client = hasGemini ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

function buildPrompt({ event, crmSnapshot, memoryContext }) {
  const context = JSON.stringify({ event, crmSnapshot, memoryContext });

  return `
You are a CRM Agent Reasoner. Decide the next best actions based on event and context.

Return ONLY valid JSON:
{
  "actions": [],
  "notes": "",
  "memoryWrites": []
}

Context: ${context}
`;
}

async function scoreLeadUsingLLM(lead) {
  if (!hasGemini) {
    console.warn("⚠ No Gemini key — using fallback lead score 50.");
    return { score: 50, reasoning: "Fallback rule-based score" };
  }

  try {
    const model = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash"
    });

    const prompt = `
You are a Lead Scoring AI.
Score this lead from 0 to 100. Return ONLY JSON.

Lead: ${JSON.stringify(lead)}

Response format:
{
  "score": 0-100,
  "reasoning": "..."
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    text = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    return JSON.parse(text);
  } catch (err) {
    console.error("Lead scoring LLM failed:", err);
    return { score: 40, reasoning: "LLM error fallback" };
  }
}

// -------------------------------
// RUN REASONING
// -------------------------------
export async function runReasoning(input) {
  const baseline = await ruleBasedPlan(input);

  if (!hasGemini) {
    console.warn("⚠ Gemini missing — using baseline only.");
    return baseline;
  }

  let llmPlan = { actions: [], notes: "", memoryWrites: [] };

  try {
    const prompt = buildPrompt(input);
    const model = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    text = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    llmPlan = JSON.parse(text);
  } catch (err) {
    console.error("Reasoner LLM failed:", err);
  }

  return {
    actions: [
      ...baseline.actions,
      ...llmPlan.actions
    ],
    notes: `${baseline.notes}\n${llmPlan.notes}`.trim(),
    memoryWrites: [...baseline.memoryWrites, ...llmPlan.memoryWrites]
  };
}

// -------------------------------
// RULE-BASED PLAN + LEAD SCORING LOGIC
// -------------------------------
async function ruleBasedPlan({ event, crmSnapshot }) {
  const actions = [];
  const memoryWrites = [];
  let notes = "";

  // ------------------------------------------
  // EVENT: Lead Created
  // ------------------------------------------
  if (event?.type === "LeadCreated") {
    const lead = crmSnapshot?.details || event.payload || {};

    // ACTION 1 — Send Welcome Email
    if (lead.email) {
      actions.push({
        type: "SendEmail",
        args: {
          to: lead.email,
          subject: "Welcome to our product",
          body: "Hi! Thanks for your interest. We will reach out shortly."
        }
      });
    }

    // ACTION 2 — Assign Follow-up Task
    actions.push({
      type: "CreateTask",
      args: {
        assigneeId: lead.owner || "auto",
        title: `Follow up with ${lead.name || lead.id}`,
        dueAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString()
      }
    });

    // ACTION 3 — Lead Scoring (LLM CALLED HERE)
    const scoringResult = await scoreLeadUsingLLM(lead);

    actions.push({
      type: "UpdateLeadScore",
      args: {
        leadId: lead.id,
        score: scoringResult.score,
        reasoning: scoringResult.reasoning
      }
    });

    notes = "LeadCreated: email sent, follow-up task created, scored via LLM.";
    memoryWrites.push({ type: "note", text: "Lead created + scored." });
  }

  // ------------------------------------------
  // EVENT: Lead Status Changed
  // ------------------------------------------
  if (event?.type === "LeadStatusChanged" && event.payload?.newStatus === "Qualified") {
    actions.push({
      type: "CreateTask",
      args: {
        assigneeId: event.payload.owner || "auto",
        title: "Prepare proposal",
        dueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
      }
    });

    notes = "Lead qualified → proposal task created.";
    memoryWrites.push({ type: "note", text: "Qualified: proposal task created." });
  }

  // ------------------------------------------
  // EVENT: Deal Lost
  // ------------------------------------------
  if (event?.type === "DealLost") {
    actions.push({
      type: "UpdateCRMField",
      args: {
        entity: "deals",
        id: event.payload.id,
        field: "status",
        value: "Closed-lost"
      }
    });

    notes = "Deal lost: status updated.";
    memoryWrites.push({ type: "note", text: "Deal handled as Closed-lost." });
  }

  return { actions, notes, memoryWrites };
}
