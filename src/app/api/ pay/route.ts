// src/app/api/pay/route.ts
import { NextRequest, NextResponse } from "next/server";
import { tranzilaHeaders } from "@/lib/tranzila";

export async function POST(req: NextRequest) {
  try {
    const {
      plan, amount, billing, email, fullName, phone,
      cardNumber, expiryMonth, expiryYear, cvv, idNumber,
      registrationCode,
      currency = "USD",           // או "ILS"
      use3ds = true               // שליטה אם להפעיל 3DS
    } = await req.json();

    if (!amount || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
      return NextResponse.json({ error: "Missing card/amount fields" }, { status: 400 });
    }

    const headers = tranzilaHeaders();

    // גוף הבקשה לפי הסכמות ששלחת (שמות שדות עשויים להשתנות קלות בין V1/V2)
    const body: any = {
      terminalName: process.env.TRANZILA_TERMINAL,
      txnType: "debit",                 // ע"פ txnType: debit/credit/verify...
      verifyMode: use3ds ? 2 : null,    // ע"פ verifyMode: 2/5 (שניהם בדוקנתמך במסוף)
      txnCurrencyCode: currency,        // ILS / USD / EUR
      amount: Number(amount),
      transactionSource: "WEB",
      customer: {
        email, fullName, phone,
        socialIDNumber: idNumber || undefined,
      },
      cardDetails: {
        cardNumber,
        expMonth: String(expiryMonth).padStart(2, "0"),
        expYear: String(expiryYear).length === 2 ? `20${expiryYear}` : String(expiryYear),
        cvv,
      },
      metadata: {
        registrationCode, plan, billing,
      },
      notifyUrl: process.env.N8N_WEBHOOK_URL, // אם משתמש
      returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/payment/3ds-return`,
    };

    // שים לב: ייתכן שה־endpoint אצלך נקרא אחרת. שמתי "v2" כדיפולט.
    const url = use3ds
      ? "https://api.tranzila.com/v2/3ds/create"                       // 3DS Create
      : "https://api.tranzila.com/v2/transactions/credit-card/create"; // חיוב רגיל

    const resp = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    const data = await resp.json().catch(() => ({}));

    // 3DS נדרש — נחזיר פרטי אתגר ל־FE
    if (use3ds && resp.ok && (data?.threeDS?.acsUrl || data?.acsUrl)) {
      return NextResponse.json({
        success: true,
        requires3ds: true,
        acsUrl: data.threeDS?.acsUrl || data.acsUrl,
        payload: data.threeDS?.payload || data.payload, // pareq/creq וכו'
        transactionId: data.transactionId || data.id,
      });
    }

    // חיוב הושלם בלי 3DS
    if (resp.ok && (data?.status === "APPROVED" || data?.transaction_response?.success)) {
      return NextResponse.json({
        success: true,
        requires3ds: false,
        transactionId: data.transactionId || data?.transaction_response?.transaction_id,
        raw: data,
      });
    }

    return NextResponse.json(
      { success: false, error: data?.message || data?.error || "Payment failed", raw: data },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("pay route error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
