import { supabase } from "@/utils/supabase/client";
import { google } from "googleapis";

export async function POST(req) {
  try {
    const { name, subject, body, recipients, user } = await req.json();
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return Response.json(
        { success: false, error: "Recipients array is required" },
        { status: 400 }
      );
    }

    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REFRESH_TOKEN = user.refresh_token;
    const SENDER_EMAIL = user.email;

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const sendEmail = async (to) => {
      const messageParts = [
        `From: ${SENDER_EMAIL}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "",
        body,
      ];
      const message = messageParts.join("\n");
      const encodedMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

      const res = await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: encodedMessage },
      });
      return res.data.id;
    };

    const results = [];
    for (const email of recipients) {
      try {
        const messageId = await sendEmail(email);
        results.push({ email, success: true, messageId });
      } catch (err) {
        results.push({ email, success: false, error: err.message });
      }
    }

    const { data: campaign, error } = await supabase
      .from("Campaigns")
      .update({
        audience: results,
        status: "Sent",
        sent_at: new Date().toISOString().split("T")[0],
      })
      .eq("user_email", user.email)
      .eq("name", name);

    return Response.json(campaign, { status: 200 });
  } catch (error) {
    console.error("Campaign send error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
