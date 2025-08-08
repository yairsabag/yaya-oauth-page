'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThreeDSReturn() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const transactionId = params.get("transactionId") || params.get("txid");
      const cres = params.get("cres");
      const pares = params.get("pares");

      if (!transactionId) {
        alert("Missing transaction");
        return;
      }

      const r = await fetch("/api/3ds/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, cres, pares }),
      });
      const data = await r.json();

      if (data.success) {
        // המשך הזרימה שלך (n8n, רידיירקט לדף success עם פרטים)
        const url = new URL(`${window.location.origin}/payment/success`);
        // הוסף לכאן פרמטרים רלוונטיים (plan/email/price/code...) לפי מה ששמרת ב־session/localStorage
        url.searchParams.set("transactionId", data.transactionId);
        window.location.href = url.toString();
      } else {
        alert(data.error || "3DS failed");
        router.push("/payment/failed");
      }
    })();
  }, [router]);

  return <div style={{padding: 24}}>Completing 3-D Secure…</div>;
}
