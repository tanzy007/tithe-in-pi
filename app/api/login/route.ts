import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { pi_auth_token } = await request.json();

    if (!pi_auth_token) {
      return NextResponse.json({ error: "Missing pi_auth_token" }, { status: 400 });
    }

    const meResponse = await fetch("https://api.minepi.com/v2/me", {
      headers: {
        Authorization: `Bearer ${pi_auth_token}`,
      },
    });

    if (!meResponse.ok) {
      const errorData = await meResponse.text();
      console.error("Pi /me verification failed:", meResponse.status, errorData);
      return NextResponse.json(
        { error: "Failed to verify Pi user" },
        { status: 401 }
      );
    }

    const piUser = await meResponse.json();

    return NextResponse.json({
      id: piUser.uid,
      username: piUser.username,
      credits_balance: 0,
      terms_accepted: true,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}