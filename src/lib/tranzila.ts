// src/lib/tranzila.ts
import crypto from "crypto";

export function tranzilaHeaders() {
  const appKey = process.env.TRANZILA_API_APP_KEY!;
  const secret = process.env.TRANZILA_API_SECRET!;

  if (!appKey || !secret) {
    throw new Error("Missing Tranzila API keys");
  }

  // לפי הדוקו: time = milliseconds unix; nonce = 40 bytes -> 80 hex chars
  const time = Date.now().toString();
  const nonce = crypto.randomBytes(40).toString("hex"); // 80-char hex

  // access token: HMAC-SHA256 על ה-appKey עם מפתח = secret+time+nonce
  const key = Buffer.from(secret + time + nonce, "utf8");
  const accessToken = crypto
    .createHmac("sha256", key)
    .update(appKey, "utf8")
    .digest("hex");

  return {
    "Content-Type": "application/json",
    "X-tranzila-api-app-key": appKey,
    "X-tranzila-api-request-time": time,
    "X-tranzila-api-nonce": nonce,
    "X-tranzila-api-access-token": accessToken,
  };
}
