'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

type Query = {
  plan?: string
  planName?: string
  price?: string
  billing?: 'monthly' | 'yearly'
  code?: string
  email?: string
}

export default function CheckoutPage() {
  // --- URL params (plan, price, etc.) ---
  const query: Query = useMemo(() => {
    if (typeof window === 'undefined') return {}
    const p = new URLSearchParams(window.location.search)
    return {
      plan: p.get('plan') || undefined,
      planName: p.get('planName') || undefined,
      price: p.get('price') || undefined,
      billing: (p.get('billing') as 'monthly' | 'yearly') || 'monthly',
      code: p.get('code') || undefined,
      email: p.get('email') || undefined,
    }
  }, [])

  // --- Buyer fields (shown at the left) ---
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>(query.email || '')
  const [phone, setPhone] = useState<string>('')

  // --- iFrame / form refs ---
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Attach `allowPaymentRequest` safely (TS-safe – via setAttribute)
  useEffect(() => {
    iframeRef.current?.setAttribute('allowPaymentRequest', 'true')
  }, [])

  // Submit the Tranzila form once the page is ready
  useEffect(() => {
    // delay one tick to allow the iframe element to mount
    const id = setTimeout(() => {
      formRef.current?.submit()
    }, 0)
    return () => clearTimeout(id)
  }, [])

  // Basic totals UI
  const priceUsd = Number(query.price || '0')
  const planTitle =
    query.planName ||
    (query.plan ? `${capitalize(query.plan)} Plan` : 'Subscription')

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
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <a
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
          >
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant"
              style={{ width: 64, height: 64, objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2d5016' }}>
              Yaya
            </span>
          </a>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#64748b',
              fontSize: 14,
            }}
          >
            <span role="img" aria-label="lock">
              🔒
            </span>
            Secure Checkout
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', gap: 24, display: 'grid', gridTemplateColumns: '360px 1fr' }}>
        {/* Order summary (left) */}
        <section
          style={{
            background: 'white',
            border: '1px solid #E5DDD5',
            borderRadius: 16,
            padding: 20,
            height: 'fit-content',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, color: '#8B5E3C' }}>Order Summary</h2>

          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              background: '#F5F1EB',
              border: '1px solid #E5DDD5',
            }}
          >
            <div style={{ fontWeight: 600, color: '#8B5E3C' }}>{planTitle}</div>
            <div style={{ fontSize: 13, color: '#8B5E3C', opacity: 0.8 }}>
              {query.billing === 'yearly' ? 'Yearly subscription' : 'Monthly subscription'}
            </div>

            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 10,
                background: '#e8f9ee',
                border: '1px solid #c8efd8',
                color: '#15803d',
                fontSize: 13,
              }}
            >
              ✅ Registration Code: <strong>{query.code ?? '-'}</strong>
            </div>

            <div style={{ marginTop: 16, color: '#8B5E3C', fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>7-day free trial</span>
                <strong>$0.00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Then {query.billing === 'yearly' ? 'yearly' : 'monthly'}</span>
                <strong>${priceUsd.toFixed(2)}</strong>
              </div>
              <hr style={{ border: 0, borderTop: '1px solid #eadfd6', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total today</span>
                <strong>$0.00</strong>
              </div>
            </div>
          </div>

          {/* Buyer fields */}
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>First name*</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              style={inputStyle}
            />

            <label style={labelStyle}>Last name*</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              style={inputStyle}
            />

            <label style={labelStyle}>Email*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />

            <label style={labelStyle}>Phone (optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 555 5555"
              style={inputStyle}
            />
          </div>

          <p style={{ marginTop: 12, fontSize: 12, color: '#64748b' }}>
            Your payment information is encrypted and secure. We never store your credit card details.
          </p>
        </section>

        {/* Tranzila iframe (right) */}
        <section
          style={{
            background: 'white',
            border: '1px solid #E5DDD5',
            borderRadius: 16,
            padding: 12,
          }}
        >
          {/* Hidden auto-posting form that loads the Tranzila iFrame */}
          <form
            ref={formRef}
            method="POST"
            target="tranzila"
            // terminal "fxpyairsabag" – adjust if you use another terminal
            action="https://direct.tranzila.com/fxpyairsabag/iframe.php"
            style={{ display: 'none' }}
          >
            {/* Basic required fields (adapt to your Tranzila setup) */}
            <input name="currency" value="1" readOnly /> {/* 1=USD (per your account setup) */}
            <input name="sum" value={priceUsd.toString()} readOnly />
            <input name="email" value={email} readOnly />
            <input name="pnref" value={query.code || ''} readOnly />
            <input name="contact" value={`${firstName} ${lastName}`.trim()} readOnly />
            <input name="phone" value={phone} readOnly />
            <input name="product" value={planTitle} readOnly />
            {/* language (optional): he/en */}
            <input name="lang" value="en" readOnly />

            {/* If your Tranzila requires other params (cred_type, tranmode, etc.) add them here */}
            {/* <input name="cred_type" value="1" readOnly /> */}
            {/* <input name="tranmode" value="AK" readOnly /> */}
          </form>

          <div style={{ width: '100%', height: 720 }}>
            <iframe
              id="tranzila-frame"
              name="tranzila"
              title="Secure Payment Form"
              ref={iframeRef}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
              }}
              // leave `allowPaymentRequest` off the JSX – we set it via ref for TS-compat
              allow="payment"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

// --- styles ---
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  color: '#8B5E3C',
  marginTop: 10,
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #E5DDD5',
  outline: 'none',
  fontSize: 14,
  color: '#2d2d2d',
  background: '#fff',
}

// --- helpers ---
function capitalize(s?: string) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
