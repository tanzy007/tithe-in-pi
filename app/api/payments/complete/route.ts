import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { paymentId, txid } = await request.json();

    console.log("Completing paymentId:", paymentId, "txid:", txid);

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      }
    );

    const data = await response.json();
    console.log("Complete status:", response.status);
    console.log("Complete body:", JSON.stringify(data));

    return NextResponse.json(data, { status: