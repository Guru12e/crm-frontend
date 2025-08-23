import nodemailer from "nodemailer";
import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to_email, from_email, subject, body, refresh_token } = req.body;

  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oAuth2Client.setCredentials({
      refresh_token,
    });

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: from_email,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: refresh_token,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: from_email,
      to: to_email,
      subject,
      html: body,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", result.messageId);
    res.status(200).json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
