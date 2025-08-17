'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle, Shield } from 'lucide-react'

type UrlParams = {
  plan: string
  price: string
  billing: string
  code: string
  planName: string
}

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState<UrlParams>({
    plan: 'executive',
    price: '5',
    billing: 'monthly',
    code: 'F75CEJ',
    planName: 'Executive Plan',
  })

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setUrlParams({
      plan: p.get('plan') || 'executive',
      price: p.get('price') || '5',
      billing: p.get('billing') || 'monthly',
      code: p.get('code') || 'F75CEJ',
      planName: p.get('planName') || 'Executive Plan',
    })
    const onResize = () => setIsMobile(window.innerWidth < 940)
    onResize()
    window.addEventListener('resize', onResize)
    const t = setTimeout(() => setIsLoading(false), 400)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
    }
  }, [])

  const planDetails = {
    executive: {
      name: 'Executive Plan',
      features: [
        'Google Calendar integration',
        'Expense tracking',
        'Contact management',
        'Recurring reminders',
      ],
    },
    ultimate: {
      name: 'Ultimate Plan',
      features: [
        'All Executive features',
        'Food & calorie tracking',
        'Advanced analytics',
        'Priority support',
      ],
    },
  }
  const currentPlan =
    planDetails[urlParams.plan as keyof typeof planDetails] || planDetails.executive

  // start recurring in 7 days (YYYY-MM-DD)
  const recurStartDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  const iframeSrc = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const base = 'https://direct.tranzila.com/fxpyairsabag/iframenew.php'
    const params = new URLSearchParams({
      // Base transaction parameters (from working Tranzila URL)
      sum: '0',                    // $0 for free trial
      cred_type: '1',             // 1 = Credit card
      currency: '2',              // 2 = USD
      tranmode: 'AK',             // AK = Standard transaction with token creation

      // Recurring payment parameters
      recur_sum: urlParams.price,           // Amount to charge monthly after trial
      recur_transaction: '4',               // 4 = monthly payment (customer choice)
      recur_start_date: recurStartDate,     // Start charging in 7 days
      
      // Customer data
      contact: [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
      email: email.trim(),
      phone: phone.trim(),
      company: 'Yaya Assistant',

      // Product description
      pdesc: `Yaya ${urlParams.planName} - 7 Day Free Trial`,

      // Return URLs
      success_url_address: `${origin}/api/tranzila/success-bridge`,
      fail_url_address: `${origin}/api/tranzila/fail-bridge`,
      notify_url_address: 'https://n8n-TD2y.sliplane.app/webhook/update-user-plan',

      // UI customization
      buttonLabel: 'Start Free Trial',
      trBgColor: 'FAF5F0',
      trTextColor: '2D5016',
      trButtonColor: '8B5E3C',
      nologo: '1',

      // Payment options
      google_pay: '1',

      // Custom fields for your tracking
      uid: urlParams.code,        // Registration code
      remarks: `Plan: ${urlParams.plan}, Billing: ${urlParams.billing}`,

      // Required parameter
      u71: '1'
    })

    return `${base}?${params.toString()}`
  }, [urlParams, recurStartDate, firstName, lastName, email, phone])

  const readyForIframe = firstName.trim() && lastName.trim() && /\S+@\S+\.\S+/.test(email)

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
      }}
    >
      {/* CSS Animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin { 
            from { transform: rotate(0deg) } 
            to { transform: rotate(360deg) } 
          }
          .spin-animation {
            animation: spin 1s linear infinite;
          }
        `
      }} />

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
            padding: isMobile ? '0 1rem' : '0 2rem',
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
              gap: '.75rem',
              textDecoration: 'none',
            }}
          >
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant"
              style={{ width: 72, height: 72, objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2d5016' }}>
              Yaya
            </span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4a5568' }}>
            <Shield size={16} />
            {!isMobile && <span style={{ fontSize: '.9rem' }}>Secure Checkout</span>}
          </div>
        </div>
      </header>

      <main style={{ padding: isMobile ? '1.5rem 0' : '3rem 0' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: isMobile ? '0 1rem' : '0 2rem',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '380px 1fr',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* ORDER SUMMARY (שמאל) */}
          <section
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '1.25rem',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
              position: 'sticky',
              top: 24,
            }}
          >
            <h2 style={{ margin: 0, color: '#2d5016', fontWeight: 700, fontSize: '1.1rem' }}>
              Order Summary
            </h2>

            <div
              style={{
                marginTop: 16,
                padding: 16,
                border: '1px solid #E5DDD5',
                borderRadius: 12,
                background: '#FBFAF8',
              }}
            >
              <h3 style={{ margin: 0, color: '#8B5E3C', fontWeight: 700 }}>
                {currentPlan.name}
              </h3>
              <p style={{ margin: '6px 0 0', color: '#7a6a5f', fontSize: '.9rem' }}>
                Monthly subscription
              </p>

              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} style={{ color: '#22c55e' }} />
                <span
                  style={{
                    fontSize: '.85rem',
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: 'rgba(34,197,94,.1)',
                    border: '1px solid rgba(34,197,94,.25)',
                    color: '#166534',
                  }}
                >
                  Registration Code: {urlParams.code}
                </span>
              </div>

              <ul style={{ margin: '14px 0 0 16px', padding: 0, color: '#6b7280', fontSize: '.9rem' }}>
                {currentPlan.features.map((f, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{f}</li>
                ))}
              </ul>

              <div style={{ marginTop: 12, borderTop: '1px solid #E5DDD5', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>7-day free trial</span>
                  <span style={{ color: '#16a34a' }}>$0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Then monthly</span>
                  <span>${urlParams.price}/month</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: '1px dashed #E5DDD5',
                    fontWeight: 700,
                  }}
                >
                  <span>Total today</span>
                  <span style={{ color: '#16a34a' }}>$0.00</span>
                </div>
              </div>

              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, color: '#7a6a5f' }}>
                <Shield size={14} />
                <span style={{ fontSize: '.85rem' }}>SSL Secured • PCI Compliant</span>
              </div>
            </div>
          </section>

          {/* תשלום (ימין) */}
          <section>
            <h2 style={{ margin: 0, color: '#2d5016', fontWeight: 700, fontSize: '1.1rem' }}>
              Complete Your Order
            </h2>

            {/* טופס פרטי לקוח */}
            <div
              style={{
                marginTop: 12,
                background: 'white',
                borderRadius: 20,
                padding: '1rem',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: 12,
                }}
              >
                <div>
                  <label style={labelStyle}>First name*</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Last name*</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email*</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    type="email"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone (optional)</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    style={inputStyle}
                  />
                </div>
              </div>

              {!readyForIframe && (
                <p style={{ marginTop: 8, color: '#b45309', fontSize: '.9rem' }}>
                  Please fill first name, last name and a valid email to continue.
                </p>
              )}
            </div>

            {/* IFRAME */}
            <div
              style={{
                marginTop: 12,
                background: 'white',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
                minHeight: 650,
              }}
            >
              {isLoading || !readyForIframe ? (
                <div style={loaderWrap}>
                  <div style={spinnerStyle} className="spin-animation" />
                  <p style={{ color: '#8B5E3C', fontSize: '.95rem', marginTop: 8 }}>
                    {isLoading ? 'Loading secure payment form...' : 'Waiting for your details...'}
                  </p>
                </div>
              ) : (
                <iframe
                  key={iframeSrc /* שירנדר מחדש כשיש פרטים */}
                  src={iframeSrc}
                  style={{ width: '100%', height: 700, border: 'none', display: 'block' }}
                  title="Secure Payment Form"
                  allow="payment"
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                />
              )}
            </div>

            <p style={{ marginTop: 12, color: '#6b7280', fontSize: '.9rem', textAlign: 'center' }}>
              Your payment information is encrypted and secure. We never store your credit card details.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '.85rem',
  color: '#6b7280',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #E5DDD5',
  outline: 'none',
  fontSize: '.95rem',
}

const loaderWrap: React.CSSProperties = {
  minHeight: 650,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 10,
}

const spinnerStyle: React.CSSProperties = {
  width: 50,
  height: 50,
  border: '4px solid #E5DDD5',
  borderTopColor: '#8B5E3C',
  borderRadius: '50%',
}
