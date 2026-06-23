import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = await request.json();
    
    console.log("Approving paymentId:", paymentId);
    
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    console.log("Pi API approve response status:", response.status);
    console.log("Pi API approve response body:", JSON.stringify(data));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}