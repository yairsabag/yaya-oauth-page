'use client';

import React, { useMemo, useState } from 'react';

type SearchParams = {
  plan?: string;
  planName?: string;
  price?: string;
  billing?: 'monthly' | 'yearly';
  code?: string;
};

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Basic info coming from the URL
  const plan = (searchParams.plan ?? 'executive').toLowerCase();
  const planName = searchParams.planName ?? 'Executive Plan';
  const price = searchParams.price ?? '5';
  const billing = (searchParams.billing ?? 'monthly') as 'monthly' | 'yearly';
  const regCode = searchParams.code ?? '';

  // Customer details form (shown left)
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('you@example.com');
  const [phone, setPhone] = useState('+1 555 555 5555');

  /** Build the Tranzila iframe URL.
   * Terminal: fxpyairsabag (your approved USD terminal)
   * IMPORTANT: lang=en to avoid "language unsupported"
   * We keep params minimal; currency follows your terminal configuration (USD).
   * sum=0 to start a free trial flow (no charge now).
   */
  const tranzilaSrc = useMemo(() => {
    const params = new URLSearchParams();

    // Amount 0 for free trial (actual recurring is configured on Tranzila side)
    params.set('sum', '0');

    // Force English UI on Tranzila form
    params.set('lang', 'en');

    // Helpful meta data to show on the Tranzila page and pass back to your success bridge
    if (email) params.set('email', email);
    if (firstName) params.set('fname', firstName);
    if (lastName) params.set('lname', lastName);
    if (phone) params.set('phone', phone);
    if (regCode) params.set('uid', regCode); // your registration code as uid
    params.set('description', `${planName} (${billing})`);

    // You can add more optional fields per Tranzila docs if needed

    return `https://direct.tranzila.com/fxpyairsabag/iframe.php?${params.toString()}`;
  }, [firstName, lastName, email, phone, regCode, planName, billing]);

  const totalToday = 0; // trial
  const recurringLabel =
    billing === 'yearly' ? `$${price}/year` : `$${price}/month`;

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
              style={{ width: '48px', height: '48px', objectFit: 'contain' }}
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

      {/* Main layout */}
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
          {/* Left column: Order summary + Customer details */}
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
              <div
                style={{
                  fontWeight: 700,
                  color: '#8B5E3C',
                  marginBottom: 8,
                }}
              >
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
                  marginTop: 6,
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

            {/* Customer details – these values are passed to Tranzila as metadata */}
            <div
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid #E5DDD5',
                padding: '1.25rem',
              }}
            >
              <LabeledInput
                label="First name*"
                value={firstName}
                onChange={setFirstName}
              />
              <LabeledInput
                label="Last name*"
                value={lastName}
                onChange={setLastName}
              />
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
                Your payment information is encrypted and secure. We never store
                your credit card details.
              </p>
            </div>
          </div>

          {/* Right column: Tranzila iframe */}
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
              // IMPORTANT: only standard attributes (to keep TS happy and builds green)
              style={{
                width: '100%',
                height: '650px',
                border: '0',
                display: 'block',
              }}
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/** Small labeled input helper */
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
        placeholder=""
        autoComplete="on"
      />
    </div>
  );
}
