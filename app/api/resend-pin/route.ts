import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import nodemailer from "nodemailer";

function getSupabaseServer(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}

async function sendEmail(to: string, subject: string, text: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hello.titheinpi@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  });

  try {
    await transporter.sendMail({
      from: "hello.titheinpi@gmail.com",
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json(
        { error: "Missing PIN" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer(request);

    // Find church by PIN
    const { data: church, error: fetchError } = await supabase
      .from("churches")
      .select("*")
      .eq("onboard_pin", pin)
      .single();

    if (fetchError || !church) {
      return NextResponse.json(
        { error: "PIN not found" },
        { status: 404 }
      );
    }

    // Resend PIN email
    const emailHtml = `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #C9A84C 0%, #d4b068 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="font-size: 32px; margin-bottom: 12px;">✟</div>
          <h1 style="font-size: 28px; color: #1a1814; margin: 0;">Tithe in Pi</h1>
        </div>
        <div style="background: #f5f5f5; padding: 32px; border-radius: 0 0 12px 12px;">
          <p style="color: #333; font-size: 16px; margin-top: 0;">Hi ${church.name},</p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Here's your onboarding PIN (resent):
          </p>
          <div style="background: white; border: 2px dashed #C9A84C; padding: 24px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #C9A84C; letter-spacing: 4px; font-family: 'Courier New', monospace;">${pin}</div>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            <strong>Go to the onboarding page:</strong> <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tithe.pi"}/onboard" style="color: #C9A84C; text-decoration: none;">tithe.pi/onboard</a>
          </p>
          <p style="color: #999; font-size: 12px;">
            If you need help, contact <strong>hello.titheinpi@gmail.com</strong>
          </p>
        </div>
      </div>
    `;

    const sent = await sendEmail(
      church.email,
      "✟ Your Tithe in Pi Onboarding PIN (Resent)",
      `Your PIN: ${pin}. Visit tithe.pi/onboard to complete your setup.`,
      emailHtml
    );

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "PIN resent to email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
