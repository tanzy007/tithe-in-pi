import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Initialize Supabase server client
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

// Generate a 6-digit PIN
function generatePin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Send email via Gmail
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
    const { churchId, email } = await request.json();

    if (!churchId || !email) {
      return NextResponse.json(
        { error: "Missing churchId or email" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer(request);

    // Check if church exists
    const { data: church, error: fetchError } = await supabase
      .from("churches")
      .select("*")
      .eq("id", churchId)
      .single();

    if (fetchError || !church) {
      return NextResponse.json(
        { error: "Church not found" },
        { status: 404 }
      );
    }

    // Generate PIN
    const pin = generatePin();

    // Update church with pin and email_verified flag
    const { error: updateError } = await supabase
      .from("churches")
      .update({
        onboard_pin: pin,
        email_verified: true,
        email_verified_at: new Date().toISOString(),
      })
      .eq("id", churchId);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to save PIN" },
        { status: 500 }
      );
    }

    // Send PIN email
    const emailHtml = `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #C9A84C 0%, #d4b068 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="font-size: 32px; margin-bottom: 12px;">✟</div>
          <h1 style="font-size: 28px; color: #1a1814; margin: 0;">Tithe in Pi</h1>
        </div>
        <div style="background: #f5f5f5; padding: 32px; border-radius: 0 0 12px 12px;">
          <p style="color: #333; font-size: 16px; margin-top: 0;">Hi ${church.name},</p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Thank you for registering with Tithe in Pi! Your church has been added to our directory.
          </p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            To complete your onboarding and add your Pi wallet, use this PIN:
          </p>
          <div style="background: white; border: 2px dashed #C9A84C; padding: 24px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #C9A84C; letter-spacing: 4px; font-family: 'Courier New', monospace;">${pin}</div>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            <strong>Go to the onboarding page:</strong> <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tithe.pi"}/onboard" style="color: #C9A84C; text-decoration: none;">tithe.pi/onboard</a>
          </p>
          <p style="color: #999; font-size: 12px;">
            This PIN is valid for 7 days. If you need help, contact <strong>hello.titheinpi@gmail.com</strong>
          </p>
        </div>
      </div>
    `;

    const sent = await sendEmail(
      email,
      "✟ Your Tithe in Pi Onboarding PIN",
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
      { success: true, message: "PIN sent to email" },
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
