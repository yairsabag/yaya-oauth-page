// src/lib/tranzila.ts
import crypto from "crypto";

export function tranzilaHeaders() {
  const appKey = process.env.TRANZILA_API_APP_KEY!;
  const secret = process.env.TRANZILA_API_SECRET!;
  if (!appKey || !secret) {
    throw new Error("Missing TRANZILA_API_APP_KEY / TRANZILA_API_SECRET");
  }

  const requestTime = Date.now().toString();          // מילי-שניות
  const nonce = crypto.randomBytes(40).toString("hex"); // 80 תווים (40 בתים)

  // access token = HMAC-SHA256(message=appKey, key=secret+time+nonce)
  const accessToken = crypto
    .createHmac("sha256", `${secret}${requestTime}${nonce}`)
    .update(appKey)
    .digest("hex");

  return {
    "Content-Type": "application/json",
    "X-tranzila-api-app-key": appKey,
    "X-tranzila-api-request-time": requestTime,
    "X-tranzila-api-nonce": nonce,
    "X-tranzila-api-access-token": accessToken,
  };
}
