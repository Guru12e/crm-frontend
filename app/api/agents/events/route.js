  import { NextResponse } from "next/server";
  import { z } from "zod";
  import { runReasoning } from "@/lib/agents/reasoning";
  import { executeActions } from "@/lib/agents/tools/executor";
  import { getRecentMemory, writeMemory } from "@/lib/agents/memory";
  import { getCrmSnapshot } from "@/lib/agents/sources/crm";
  import { logRunStart, logRunEnd } from "@/lib/agents/logs";

  const EventEnvelopeSchema = z.object({
    type: z.enum(["LeadCreated", "LeadStatusChanged", "DealLost"]),
    payload: z.record(z.any()),
    ts: z.string().optional(),
  });

  export async function POST(request) {
    try {
      const body = await request.json();
      console.log("Agent event received:", JSON.stringify(body, null, 2));
      const parse = EventEnvelopeSchema.safeParse(body);
      if (!parse.success) {
        return NextResponse.json(
          { error: "Invalid event", issues: parse.error.flatten() },
          { status: 400 }
        );
      }

      const event = parse.data;
      console.log("Parsed event:", event);

      const runId = await logRunStart({ event });
      console.log("Run ID from logRunStart:", runId);
      const crmSnapshot = await getCrmSnapshot(event);
      console.log("CRM snapshot:", crmSnapshot);
      const memoryContext = await getRecentMemory(event);
      console.log("Memory context:", memoryContext);

      const reasoningInput = {
        event,
        crmSnapshot,
        memoryContext,
        toolsAvailable: ["SendEmail", "AssignOwner", "CreateTask", "UpdateCRMField"],
      };

      const { actions, notes, memoryWrites } = await runReasoning(reasoningInput);
      console.log("Reasoning output:", { actions, notes, memoryWrites });

      if (memoryWrites?.length) {
        await writeMemory(memoryWrites, event);
      }

      const executionResults = await executeActions(actions);
      console.log("Execution results:", executionResults);
      await logRunEnd({ runId, actions, notes, executionResults });
      console.log("Run ended, runId:", runId);

      return NextResponse.json({ ok: true, actions, notes, executionResults, memoryWrites, runId });
    } catch (err) {
      console.error("Agent event error:", err);
      try { await logRunEnd({ runId: null, error: err }); } catch {}
      return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
    }
  }


