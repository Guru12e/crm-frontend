import nodemailer from "nodemailer";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { to_email, from_email, subject, body, refresh_token } =
      await req.json();
    if (!to_email || !from_email || !subject || !body || !refresh_token) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: refresh_token });

    const accessToken = (await oAuth2Client.getAccessToken()).token;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: from_email,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: refresh_token,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: from_email,
      to: to_email,
      subject: subject,
      html: body,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully to:", to_email);
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);
    console.error("❌ Failed to send email:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
