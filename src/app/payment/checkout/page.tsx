"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  // קורא פרמטרים ל-UI בלבד (לא נדרש לטרנזילה)
  const sp = useSearchParams();
  const planName = sp.get("planName") ?? "Executive Plan";
  const code = sp.get("code") ?? "N/A";

  // כתובות חזרה/נוטיפיי — עדכן אם תרצה
  const SUCCESS_URL = "https://yayagent.com/api/tranzila/success-bridge";
  const FAIL_URL = "https://yayagent.com/api/tranzila/fail-bridge";
  const NOTIFY_URL =
    "https://n8n-TD2y.sliplane.app/webhook/update-user-plan";

  // נקודת ה-iframe של טרנזילה
  const actionUrl =
    "https://direct.tranzila.com/fxpyairsabag/iframenew.php";

  // שליחת הטופס מיד ב-mount כדי לטעון את ה-iframe עם POST (אמין יותר מ-GET)
  const formRef = React.useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    // מריצים אחרי ציור ראשון כדי שהאייפריים יקבל POST כמו שצריך
    formRef.current?.submit();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#faf5f0 0%,#f7f3ed 100%)",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
            }}
          >
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant"
              width={64}
              height={64}
              style={{ objectFit: "contain" }}
            />
            <span style={{ fontSize: 22, fontWeight: 700, color: "#2d5016" }}>
              Yaya
            </span>
          </a>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#2d5016",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
              }}
            />
            Secure Checkout
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "360px 1fr",
            gap: 24,
          }}
        >
          {/* Order Summary */}
          <aside
            style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid #E5DDD5",
              borderRadius: 16,
              padding: 20,
              height: "fit-content",
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#8B5E3C",
                marginBottom: 16,
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                border: "1px solid #EFE7DF",
                borderRadius: 12,
                padding: 16,
                background: "#FFF",
              }}
            >
              <div style={{ marginBottom: 8, color: "#8B5E3C", fontWeight: 600 }}>
                {planName}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{ color: "#166534", fontSize: 13, fontWeight: 700 }}
                >
                  Registration Code: {code}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 8,
                  color: "#8B5E3C",
                  fontSize: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderTop: "1px dashed rgba(139,94,60,0.25)",
                  }}
                >
                  <span>7-day free trial</span>
                  <strong>$0.00</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderTop: "1px dashed rgba(139,94,60,0.25)",
                  }}
                >
                  <span>Then monthly</span>
                  <strong>$5.00</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderTop: "1px dashed rgba(139,94,60,0.25)",
                    borderBottom: "1px dashed rgba(139,94,60,0.25)",
                  }}
                >
                  <span>Total today</span>
                  <strong>$0.00</strong>
                </div>
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#8B5E3C",
                  fontSize: 12,
                  opacity: 0.9,
                }}
              >
                <img
                  alt="lock"
                  src="/icons/lock.svg"
                  width={14}
                  height={14}
                  style={{ opacity: 0.75 }}
                />
                SSL Secured • PCI Compliant
              </div>
            </div>
          </aside>

          {/* Tranzila Iframe + Hidden POST Form */}
          <section
            style={{
              background: "#FFF",
              border: "1px solid #E5DDD5",
              borderRadius: 16,
              padding: 0,
              overflow: "hidden",
              minHeight: 640,
            }}
          >
            {/* חשוב: שולחים POST אל האייפריים כדי להבטיח פרמטרים תקינים */}
            <form
              ref={formRef}
              action={actionUrl}
              method="POST"
              target="tranzila-frame"
              noValidate
              autoComplete="off"
              style={{ display: "none" }}
            >
              {/* EXACTLY as you asked: */}
              <input name="sum" value="5" type="hidden" />
              <input name="cred_type" value="1" type="hidden" />
              <input name="currency" value="2" type="hidden" /> {/* USD */}
              <input name="tranmode" value="AK" type="hidden" />

              {/* איכות חוויית משתמש */}
              <input name="lang" value="en" type="hidden" />
              <input name="buttonLabel" value="Start Free Trial" type="hidden" />

              {/* כתובות חזרה/נוטיפיי (במידה ומוגדר גם במסוף – זה לא מזיק) */}
              <input name="success_url_address" value={SUCCESS_URL} type="hidden" />
              <input name="fail_url_address" value={FAIL_URL} type="hidden" />
              <input name="notify_url_address" value={NOTIFY_URL} type="hidden" />

              {/* מידע אופציונלי להצגה/חשבונית */}
              <input name="company" value="Yaya Assistant" type="hidden" />
              <input name="pdesc" value={`${planName} monthly subscription`} type="hidden" />
            </form>

            {/* האייפריים שמקבל את ה-POST */}
            <iframe
              name="tranzila-frame"
              id="tranzila-frame"
              title="Tranzila Secure Checkout"
              // מאפשר שימוש ב-Payment API (כשזמין)
              allow="payment"
              // שומר מינימום sandbox פתוח לפופאפים/3DS
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
              style={{
                width: "100%",
                height: "100%",
                minHeight: 640,
                border: "0",
                display: "block",
              }}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
