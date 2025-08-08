// src/app/api/pay/route.ts
import { NextRequest, NextResponse } from "next/server";
import { tranzilaHeaders } from "@/lib/tranzila";

export async function POST(req: NextRequest) {
  try {
    const {
      amount = 0,                   // אימות 0 (או 1 אם יידרש ע"י הסולק)
      currency = "ILS",             // ILS / USD / EUR
      email, fullName, phone,
      cardNumber, expiryMonth, expiryYear, cvv, idNumber,
      plan, billing, registrationCode,
      use3ds = true
    } = await req.json();

    const terminal = process.env.TRANZILA_TERMINAL!;
    const headers = tranzilaHeaders();

    // בקשת אימות + טוקניזציה
    const body: any = {
      terminalName: terminal,
      txnType: "verify",                      // אימות (לא חיוב)
      txnCurrencyCode: currency,
      amount: Number(amount),
      tokenize: true,                         // בקשת Token
      verifyMode: use3ds ? 2 : null,          // 2/5 (לפי המסוף שלך)
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
      metadata: { plan, billing, registrationCode },
      returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/payment/3ds-return`
    };

    const url = use3ds
      ? "https://api.tranzila.com/v2/3ds/create"
      : "https://api.tranzila.com/v2/transactions/credit-card/create";

    const resp = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    const data = await resp.json().catch(() => ({}));

    // נדרש 3DS → מחזירים URL/טופס ל-ACS
    if (use3ds && resp.ok && (data?.threeDS?.acsUrl || data?.acsUrl)) {
      return NextResponse.json({
        success: true,
        requires3ds: true,
        acsUrl: data.threeDS?.acsUrl || data.acsUrl,
        payload: data.threeDS?.payload || data.payload,     // pareq/creq וכו'
        transactionId: data.transactionId || data.id,
      });
    }

    // הצלחה בלי 3DS – מחפשים token בתגובה
    const token =
      data?.transaction_response?.token ||
      data?.token ||
      data?.card?.token ||
      null;

    if (resp.ok && (data?.status === "APPROVED" || data?.transaction_response?.success) && token) {
      return NextResponse.json({
        success: true,
        requires3ds: false,
        verifyApproved: true,
        token,
        transactionId: data.transactionId || data?.transaction_response?.transaction_id,
        raw: data,
      });
    }

    return NextResponse.json(
      { success: false, error: data?.message || data?.error || "Verify/Tokenize failed", raw: data },
      { status: 400 }
    );
  } catch (err) {
    console.error("pay (verify+token) error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
