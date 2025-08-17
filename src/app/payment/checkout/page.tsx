'use client';

import React, { useMemo, useState } from 'react';

/**
 * NOTE on typing:
 * Next.js (App Router) injects `searchParams` dynamically. To avoid the
 * “does not satisfy the constraint 'PageProps' / Promise<any>” error you saw,
 * we intentionally keep the prop type loose and parse safely inside.
 */
export default function CheckoutPage(props: any) {
  const sp: Record<string, string | undefined> = props?.searchParams ?? {};

  // URL params with safe defaults
  const plan = (sp.plan ?? 'executive').toLowerCase();
  const planName = sp.planName ?? 'Executive Plan';
  const priceStr = sp.price ?? '5'; // monthly price in USD
  const priceNum = Number.isFinite(Number(priceStr)) ? Number(priceStr) : 5;
  const billing = (sp.billing ?? 'monthly') as 'monthly' | 'yearly';
  const regCode = sp.code ?? '';

  // Customer details (left form, optional metadata for Tranzila)
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('you@example.com');
  const [phone, setPhone] = useState('+1 555 555 5555');

  // Base URL for your site (used for success/fail/notify). You can set it in env.
  const siteBase =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (typeof window !== 'undefined' ? window.location.origin : 'https://yayagent.com');

  /**
   * Build Tranzila NEW iframe URL:
   *   https://direct.tranzila.com/<terminal>/iframenew.php
   * Keys from the spec:
   *  - lang=en  -> English UI (fixes “language unsupported”)
   *  - currency=2 -> USD (your terminal is approved in USD)
   *  - sum=0 + recur_* -> free trial now, recurring later
   *  - recur_transaction=4_approved -> monthly (not customer choice)
   *  - recur_start_date=YYYY-MM-DD -> start in 7 days
   *  - success_url_address / fail_url_address / notify_url_address
   *  - metadata (email, phone, contact, pdesc, etc.)
   */
  const tranzilaSrc = useMemo(() => {
    const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const recurStartDate = sevenDays.toISOString().slice(0, 10); // yyyy-mm-dd

    const qp = new URLSearchParams();

    // Display & currency
    qp.set('lang', 'en');        // force English
    qp.set('currency', '2');     // 2 = USD

    // Trial now, recurring later (monthly)
    qp.set('sum', '0');                              // charge now: $0
    qp.set('recur_sum', String(priceNum));           // recurring amount
    qp.set('recur_transaction', '4_approved');       // monthly, not customer choice
    qp.set('recur_start_date', recurStartDate);      // start in 7 days

    // Success / Fail / Notify endpoints (your bridges / webhook)
    qp.set('success_url_address', `${siteBase}/api/tranzila/success-bridge`);
    qp.set('fail_url_address', `${siteBase}/api/tranzila/fail-bridge`);
    qp.set('notify_url_address', `${siteBase}/api/webhook/update-user-plan`);

    // Optional – enable Google Pay (supported on NEW iframe)
    // If you don't want it, comment out:
    qp.set('google_pay', '1');

    // Helpful metadata that will return to you as well
    if (email) qp.set('email', email);
    if (phone) qp.set('phone', phone);
    qp.set('contact', `${firstName} ${lastName}`.trim());
    qp.set('company', 'Yaya Assistant');
    qp.set('pdesc', `${planName} (${billing})`);
    if (regCode) {
      // Your internal registration code; you can also use Z_field if defined
      qp.set('uid', regCode);
    }

    // Optional UI polish on Tranzila form
    qp.set('buttonLabel', 'Start Free Trial');
    // Example of removing Tranzila logo if enabled for your terminal:
    // qp.set('nologo', '1');

    return `https://direct.tranzila.com/fxpyairsabag/iframenew.php?${qp.toString()}`;
  }, [billing, email, firstName, lastName, phone, planName, priceNum, regCode, siteBase]);

  const totalToday = 0; // trial
  const recurringLabel = billing === 'yearly' ? `$${priceStr}/year` : `$${priceStr}/month`;

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
              <LabeledInput
                label="Phone (optional)"
                value={phone}
                onChange={setPhone}
              />

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

          {/* Right: Tranzila iframe */}
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
            <iframe
              title="Tranzila Checkout"
              src={tranzilaSrc}
              // per spec: enabling Web Payments inside iframe for Google Pay
              allow="payment"
              style={{ width: '100%', height: '680px', border: '0', display: 'block' }}
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/** Small labeled input component */
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
