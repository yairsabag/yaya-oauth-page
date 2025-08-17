'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
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

  // Recurring start in 7 days (YYYY-MM-DD)
  const recurStartDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  // תנאי להצגת הטופס של טרנזילה
  const readyForIframe = firstName.trim() && lastName.trim() && /\S+@\S+\.\S+/.test(email)

  // POST hidden form → iframe (מונע System Error)
  const formRef = useRef<HTMLFormElement>(null)
  const iframeKey = useMemo(
    () =>
      // נכפה רינדור מחדש כשהשדות משתנים
      `${urlParams.plan}-${urlParams.price}-${urlParams.billing}-${urlParams.code}-${firstName}-${lastName}-${email}-${phone}-${recurStartDate}`,
    [urlParams, firstName, lastName, email, phone, recurStartDate]
  )

  useEffect(() => {
    if (readyForIframe) {
      // submit אחרי טיק כדי שה-iframe יהיה בדום
      const id = setTimeout(() => formRef.current?.submit(), 0)
      return () => clearTimeout(id)
    }
  }, [iframeKey, readyForIframe])

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

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

            {/* IFRAME + hidden POST form */}
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
                  <div style={spinner} />
                  <p style={{ color: '#8B5E3C', fontSize: '.95rem', marginTop: 8 }}>
                    {isLoading ? 'Loading secure payment form...' : 'Waiting for your details...'}
                  </p>
                </div>
              ) : (
                <>
                  {/* POST לתוך ה-iframe: אין tranmode, אין querystring → נעלם ה-System Error */}
                  <form
                    ref={formRef}
                    action="https://direct.tranzila.com/fxpyairsabag/iframenew.php"
                    method="POST"
                    target="tranzila_iframe"
                    style={{ display: 'none' }}
                    noValidate
                    autoComplete="off"
                  >
                    {/* סכום עכשיו: $0 (trial) + USD */}
                    <input type="hidden" name="currency" value="2" />
                    <input type="hidden" name="sum" value="0" />

                    {/* Recurring: חודשי, מתחיל בעוד 7 ימים */}
                    <input type="hidden" name="recur_sum" value={urlParams.price} />
                    <input type="hidden" name="recur_transaction" value="4_approved" />
                    <input type="hidden" name="recur_start_date" value={recurStartDate} />
                    {/* אם לא רוצים הגבלה במס׳ חיובים – לא שולחים recur_payments */}

                    {/* חזרות/נוטיפיי */}
                    <input
                      type="hidden"
                      name="success_url_address"
                      value={`${origin}/api/tranzila/success-bridge`}
                    />
                    <input
                      type="hidden"
                      name="fail_url_address"
                      value={`${origin}/api/tranzila/fail-bridge`}
                    />
                    <input
                      type="hidden"
                      name="notify_url_address"
                      value="https://n8n-TD2y.sliplane.app/webhook/update-user-plan"
                    />

                    {/* UI / עיצוב דף תשלום */}
                    <input type="hidden" name="nologo" value="1" />
                    <input type="hidden" name="trBgColor" value="FAF5F0" />
                    <input type="hidden" name="trTextColor" value="2D5016" />
                    <input type="hidden" name="trButtonColor" value="8B5E3C" />
                    <input type="hidden" name="buttonLabel" value="Start Free Trial" />
                    <input type="hidden" name="google_pay" value="1" />

                    {/* פרטי לקוח שיוצגו במסוף */}
                    <input
                      type="hidden"
                      name="contact"
                      value={[firstName.trim(), lastName.trim()].filter(Boolean).join(' ')}
                    />
                    <input type="hidden" name="email" value={email.trim()} />
                    <input type="hidden" name="phone" value={phone.trim()} />
                    <input type="hidden" name="pdesc" value={`Yaya ${urlParams.plan} - 7 Day Trial (USD)`} />
                    <input type="hidden" name="company" value="Yaya Assistant" />

                    {/* שדות פנימיים/דדופליקציה */}
                    <input type="hidden" name="uid" value={urlParams.code} />
                    <input type="hidden" name="u1" value={urlParams.code} />
                    <input type="hidden" name="u2" value={urlParams.plan} />
                    <input type="hidden" name="u3" value={urlParams.billing} />
                    <input type="hidden" name="u4" value={urlParams.price} />

                    {/* 3DS V2 בכפייה רק אם נדרש ע"י טרנזילה:
                    <input type="hidden" name="newprocess" value="1" /> */}
                  </form>

                  <iframe
                    key={iframeKey}
                    name="tranzila_iframe"
                    src="about:blank"
                    style={{ width: '100%', height: 700, border: 'none', display: 'block' }}
                    title="Secure Payment Form"
                    allow="payment"
                    sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                  />
                </>
              )}
            </div>

            <p style={{ marginTop: 12, color: '#6b7280', fontSize: '.9rem', textAlign: 'center' }}>
              Your payment information is encrypted and secure. We never store your credit card details.
            </p>
          </section>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
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

const spinner: React.CSSProperties = {
  width: 50,
  height: 50,
  border: '4px solid #E5DDD5',
  borderTopColor: '#8B5E3C',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
}
