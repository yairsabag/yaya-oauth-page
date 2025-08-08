// src/app/api/3ds/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { tranzilaHeaders } from "@/lib/tranzila";

export async function POST(req: NextRequest) {
  try {
    const { transactionId, cres, pares } = await req.json(); // מה־ACS
    if (!transactionId || (!cres && !pares)) {
      return NextResponse.json({ error: "Missing 3DS fields" }, { status: 400 });
    }

    const headers = tranzilaHeaders();
    const body = { transactionId, cres, pares };

    const resp = await fetch("https://api.tranzila.com/v2/3ds/complete", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => ({}));

    if (resp.ok && (data?.status === "APPROVED" || data?.transaction_response?.success)) {
      return NextResponse.json({
        success: true,
        transactionId: data.transactionId || data?.transaction_response?.transaction_id,
        raw: data,
      });
    }

    return NextResponse.json(
      { success: false, error: data?.message || data?.error || "3DS completion failed", raw: data },
      { status: 400 }
    );
  } catch (e) {
    console.error("3ds complete error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
