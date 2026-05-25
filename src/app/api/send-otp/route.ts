import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, otp, smtpConfig } = await request.json();

    // Use custom SMTP config from client, fallback to environment variables
    const host = smtpConfig?.host || process.env.SMTP_HOST;
    const port = Number(smtpConfig?.port || process.env.SMTP_PORT || 587);
    const user = smtpConfig?.user || process.env.SMTP_USER;
    const pass = smtpConfig?.pass || process.env.SMTP_PASSWORD;
    const from = smtpConfig?.from || process.env.SMTP_FROM || user || 'NutriFlux <no-reply@nutriflux.com>';

    if (!host || !user || !pass) {
      return NextResponse.json(
        { error: 'SMTP configuration is missing. Click the gear (⚙) icon on the login screen to configure your SMTP settings.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for port 465, false for others
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false // Helps avoid SSL handshake failures with self-signed certs
      }
    });

    const mailOptions = {
      from,
      to: email,
      subject: `Verification Code: ${otp} - NutriFlux`,
      text: `Your NutriFlux one-time verification code is: ${otp}\n\nThis code is valid for 5 minutes. If you did not request this, please disregard this email.`,
      html: `
        <div style="font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0891b2; font-size: 32px; font-weight: 900; font-style: italic; margin: 0; background: linear-gradient(to right, #0891b2, #2563eb, #c084fc); -webkit-background-clip: text; display: inline-block;">NutriFlux</h1>
            <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0; font-style: italic; font-weight: 600;">Personalized Calorie & Macro Tracker</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
          <p style="color: #334155; font-size: 15px; font-weight: 500;">Hello,</p>
          <p style="color: #334155; font-size: 15px; line-height: 1.6; font-weight: 500;">Use the following one-time password (OTP) to verify your email and sign in to NutriFlux:</p>
          <div style="text-align: center; margin: 35px 0;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #0891b2; background-color: #ecfeff; padding: 12px 30px; border-radius: 12px; border: 1px solid #cffafe; font-family: monospace; display: inline-block;">${otp}</span>
          </div>
          <p style="color: #ef4444; font-size: 12px; font-weight: 700; text-align: center; margin-top: 25px; font-style: italic;">This verification code is valid for 5 minutes.</p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0;" />
          <p style="color: #94a3b8; font-size: 11px; text-align: center; line-height: 1.5; margin: 0;">
            If you did not request this code, you can safely ignore this email. Someone may have entered your email address by mistake.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('SMTP Mail Send Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email. Check your SMTP configurations.' },
      { status: 500 }
    );
  }
}
