// src/app/api/charge-by-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { tranzilaHeaders } from "@/lib/tranzila";

export async function POST(req: NextRequest) {
  try {
    const { token, amount, currency = "ILS", pdesc, registrationCode, plan, billing } = await req.json();
    if (!token || !amount) {
      return NextResponse.json({ error: "Missing token/amount" }, { status: 400 });
    }

    const headers = tranzilaHeaders();

    const body: any = {
      terminalName: process.env.TRANZILA_TERMINAL,
      txnType: "debit",                 // חיוב
      txnCurrencyCode: currency,
      amount: Number(amount),
      tokenDetails: { token },          // שם השדה ב־V2
      pdesc: pdesc || `${plan || ""} ${billing || ""}`.trim(),
      metadata: { registrationCode, plan, billing },
      transactionSource: "WEB",
    };

    const url = "https://api.tranzila.com/v2/transactions/credit-card/create";
    const resp = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    const data = await resp.json().catch(() => ({}));

    if (resp.ok && (data?.status === "APPROVED" || data?.transaction_response?.success)) {
      return NextResponse.json({
        success: true,
        transactionId: data.transactionId || data?.transaction_response?.transaction_id,
        raw: data,
      });
    }

    return NextResponse.json(
      { success: false, error: data?.message || data?.error || "Charge failed", raw: data },
      { status: 400 }
    );
  } catch (e) {
    console.error("charge-by-token error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
