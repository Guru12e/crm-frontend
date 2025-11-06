import { google } from "googleapis";

export async function sendEmail({ to, subject, body }) {
  // Simple placeholder: use existing app/api/gmail route if preferred
  // Here we return a stub until OAuth/service account is wired
  if (!to) throw new Error("Missing 'to'");
  return { ok: true, to, subject: subject || "", id: `stub-${Date.now()}` };
}


