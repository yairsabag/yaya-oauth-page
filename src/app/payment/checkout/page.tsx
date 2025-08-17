// /src/app/payment/checkout/page.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function CheckoutPage(props: any) {
  const sp: Record<string, string | undefined> = props?.searchParams ?? {};

  const plan      = (sp.plan ?? 'executive').toLowerCase(); // 'executive' | 'ultimate'
  const planName  = sp.planName ?? (plan === 'ultimate' ? 'Ultimate Plan' : 'Executive Plan');
  const billing   = (sp.billing ?? 'monthly') as 'monthly' | 'yearly';
  const regCode   = sp.code ?? ''; // registration code from URL

  // $/month by plan
  const priceNum  = plan === 'ultimate' ? 14 : 5;
  const priceStr  = String(priceNum);

  // Customer (metadata only – NOT card fields)
  const [firstName, setFirstName] = useState('John');
  const [lastName,  setLastName]  = useState('Doe');
  const [email,     setEmail]     = useState('you@example.com');
  const [phone,     setPhone]     = useState('+1 555 555 5555');

  const siteBase =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (typeof window !== 'undefined' ? window.location.origin : 'https://yayagent.com');

  // start recurring in 7 days
  const recurStartDate = useMemo(() => {
    const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10); // yyyy-mm-dd
  }, []);

  // auto-submit POST into iframe
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    formRef.current?.submit();
  }, [planName, billing, priceNum, recurStartDate, email, phone, firstName, lastName, regCode, siteBase]);

  const totalToday = 0;
  const recurringLabel = `$${priceStr}/month`;

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          padding: '1rem 0',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
            }}
          >
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ width: 48, height: 48, objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2d5016' }}>
              Yaya
            </span>
          </a>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#718096',
              fontSize: '0.95rem',
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                background: '#22c55e',
                borderRadius: '50%',
                display: 'inline-block',
              }}
            />
            Secure Checkout
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: '2.5rem 0' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
            gap: '2rem',
          }}
        >
          {/* Left: Summary + Details */}
          <div>
            <div
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid #E5DDD5',
                padding: '1.25rem 1.25rem 1rem',
                marginBottom: '1rem',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  color: '#8B5E3C',
                  fontWeight: 700,
                }}
              >
                Order Summary
              </h2>
            </div>

            <div
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid #E5DDD5',
                padding: '1.25rem',
                marginBottom: '1rem',
              }}
            >
              <div style={{ fontWeight: 700, color: '#8B5E3C', marginBottom: 8 }}>
                {planName}
              </div>
              <div style={{ color: '#8B5E3C', opacity: 0.8, marginBottom: 12 }}>
                Monthly subscription
              </div>

              <div
                style={{
                  background: 'rgba(37,211,102,0.08)',
                  border: '1px solid rgba(37,211,102,0.25)',
                  color: '#2d7a46',
                  borderRadius: 8,
                  padding: '8px 10px',
                  fontSize: 14,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#25d366',
                    display: 'inline-block',
                  }}
                />
                Registration Code: <strong>{regCode || 'N/A'}</strong>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 6,
                  color: '#8B5E3C',
                  fontSize: 14,
                }}
              >
                <div>7-day free trial</div>
                <div style={{ fontWeight: 600 }}>${totalToday.toFixed(2)}</div>

                <div>Then {billing}</div>
                <div style={{ fontWeight: 600 }}>{recurringLabel}</div>

                <div style={{ borderTop: '1px solid #E5DDD5', marginTop: 8 }} />
                <div style={{ borderTop: '1px solid #E5DDD5', marginTop: 8 }} />

                <div style={{ fontWeight: 700 }}>Total today</div>
                <div style={{ fontWeight: 700 }}>${totalToday.toFixed(2)}</div>
              </div>
            </div>

            {/* Customer details (metadata only) */}
            <div
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid #E5DDD5',
                padding: '1.25rem',
              }}
            >
              <LabeledInput label="First name*" value={firstName} onChange={setFirstName} />
              <LabeledInput label="Last name*" value={lastName} onChange={setLastName} />
              <LabeledInput label="Email*" value={email} onChange={setEmail} />
              <LabeledInput label="Phone (optional)" value={phone} onChange={setPhone} />

              <p
                style={{
                  marginTop: 12,
                  color: '#718096',
                  fontSize: 12,
                  lineHeight: 1.4,
                }}
              >
                Your payment information is encrypted and secure. We never store your
                credit card details.
              </p>
            </div>
          </div>

          {/* Right: Tranzila iframe + auto-submitting POST form */}
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              border: '1px solid #E5DDD5',
              padding: 0,
              minHeight: 460,
              overflow: 'hidden',
            }}
          >
            {/* Hidden form posting into the iframe */}
            <form
              ref={formRef}
              action="https://direct.tranzila.com/fxpyairsabag/iframenew.php"
              method="POST"
              target="tranzila_iframe"
              style={{ display: 'none' }}
              noValidate
              autoComplete="off"
            >
              {/* Amount now: $0 (trial) */}
              <input type="hidden" name="currency" value="2" />
              <input type="hidden" name="sum" value="0" />

              {/* Recurring config */}
              <input type="hidden" name="recur_sum" value={priceStr} />
              <input type="hidden" name="recur_transaction" value="4_approved" />
              <input type="hidden" name="recur_start_date" value={recurStartDate} />
              {/* אם רוצים ללא הגבלה, לא לשים recur_payments. */}

              {/* Returns/webhooks */}
              <input
                type="hidden"
                name="success_url_address"
                value={`${siteBase}/api/tranzila/success-bridge`}
              />
              <input
                type="hidden"
                name="fail_url_address"
                value={`${siteBase}/api/tranzila/fail-bridge`}
              />
              <input
                type="hidden"
                name="notify_url_address"
                value={`${siteBase}/api/webhook/update-user-plan`}
              />

              {/* UI / payment options */}
              <input type="hidden" name="buttonLabel" value="Start Free Trial" />
              <input type="hidden" name="google_pay" value="1" />
              {/* <input type="hidden" name="nologo" value="1" /> */}

              {/* Metadata to appear in Tranzila */}
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="phone" value={phone} />
              <input type="hidden" name="contact" value={`${firstName} ${lastName}`.trim()} />
              <input type="hidden" name="company" value="Yaya Assistant" />
              <input type="hidden" name="pdesc" value={`${planName} (${billing})`} />
              <input type="hidden" name="uid" value={regCode} />

              {/* 3DS V2 בכפייה רק אם צריך: */}
              {/* <input type="hidden" name="newprocess" value="1" /> */}
            </form>

            <iframe
              name="tranzila_iframe"
              title="Tranzila Checkout"
              allow="payment"
              style={{ width: '100%', height: '680px', border: 0, display: 'block' }}
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: 'block',
          fontSize: 13,
          color: '#8B5E3C',
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid #E5DDD5',
          outline: 'none',
          fontSize: 14,
          color: '#2d3748',
          background: '#fff',
        }}
        autoComplete="on"
      />
    </div>
  );
}
