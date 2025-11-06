import { sendEmail } from "./providers/email";
import { assignOwner, createTask, updateCRMField } from "./providers/crm";

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
        default:
          results.push({ skipped: true, reason: "Unknown action", action });
      }
    } catch (e) {
      results.push({ error: true, message: e?.message, action });
    }
  }
  return results;
}


