import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { pi_auth_token } = await request.json();

    if (!pi_auth_token) {
      return NextResponse.json(
        { error: "Missing pi_auth_token" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.minepi.com/v2/me", {
      headers: {
        Authorization: `Bearer ${pi_auth_token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Pi token verification failed" },
        { status: 401 }
      );
    }

    const piUser = await response.json();

    return NextResponse.json({
      id: piUser.uid,
      username: piUser.username,
      credits_balance: 0,
      terms_accepted: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}