import { sendEmail } from "./providers/email";
import { assignOwner, createTask, updateCRMField } from "./providers/crm";
import { postCRM } from "../../utils/crmClient";

export async function executeActions(actions) {
  const results = [];

  for (const action of actions || []) {
    try {
      switch (action.type) {
        case "SendEmail":
          results.push(await sendEmail(action.args));
          break;

        case "AssignOwner":
          results.push(await assignOwner(action.args));
          break;

        case "CreateTask":
          results.push(await createTask(action.args));
          break;

        case "UpdateCRMField":
          results.push(await updateCRMField(action.args));
          break;

        case "UpdateLeadScore":
          try {
            const { leadId, score, reasoning } = action.args;

            const result = await postCRM("app/api/leads/update-score", {
              leadId,
              score,
              reasoning,
            });
            
            results.push({ ok: true, data: result });
          } catch (err) {
            results.push({ error: true, message: err.message, action });
          }
          break;

        default:
          results.push({ skipped: true, reason: "Unknown action", action });
      }
    } catch (e) {
      results.push({ error: true, message: e?.message, action });
    }
  }

  return results;
}
