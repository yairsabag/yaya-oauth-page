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
    price: '5',               // 5 או 14
    billing: 'monthly',
    code: 'F75CEJ',
    planName: 'Executive Plan',
  })

  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')

  const [isMobile, setIsMobile]   = useState(false)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const plan = (p.get('plan') || 'executive').toLowerCase()
    const price = p.get('price') || (plan === 'ultimate' ? '14' : '5')

    setUrlParams({
      plan,
      price,
      billing: (p.get('billing') || 'monthly').toLowerCase(),
      code: p.get('code') || 'F75CEJ',
      planName: p.get('planName') || (plan === 'ultimate' ? 'Ultimate Plan' : 'Executive Plan'),
    })

    const onResize = () => setIsMobile(window.innerWidth < 940)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
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
  } as const

  const currentPlan =
    planDetails[(urlParams.plan as keyof typeof planDetails) || 'executive'] ||
    planDetails.executive

  // חיוב מנוי יתחיל בעוד 7 ימים (YYYY-MM-DD)
  const recurStartDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10)
  }, [])

  // בסיס עמוד התשלום של טרנזילה
  const TRZ_BASE = 'https://direct.tranzila.com/fxpyairsabag/iframenew.php'

  // URL ל-Redirect:
  // sum=0 + tranmode=VK (אימות), דרישת שדות CVV ות"ז (cvv=1, myid=1),
  // מנוי שיופעל אוטומטית בעוד 7 ימים.
  const tranzilaUrl = useMemo(() => {
    const success = `https://www.yayagent.com/payment/success`
    const fail    = `https://www.yayagent.com/payment/fail`
    const notify  = `https://n8n-TD2y.sliplane.app/webhook/update-user-plan` // תיקנתי את הכתובת

    const params = new URLSearchParams({
      // ניסיון חינם כעת (ללא אישור סולק)
      sum: '0',
      currency: '2',              // USD
      tranmode: 'VK',             // חשוב! אימות ל-sum=0
      cred_type: '1',

      // דרישת שדות חובה בטופס (כדי למנוע 418 על CVV/ת"ז)
      cvv: '1',
      myid: '1',

      // מנוי
      recur_sum: urlParams.price,       // 5 או 14
      recur_transaction: '4_approved',  // חודשי, ללא בחירת לקוח
      recur_start_date: recurStartDate,

      // פרטי לקוח (מוצגים בטופס/נשמרים במסוף)
      contact: [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
      email: email.trim(),
      phone: phone.trim(),

      // עיצוב
      nologo: '1',
      trBgColor: 'FAF5F0',
      trTextColor: '2D5016',
      trButtonColor: '8B5E3C',
      buttonLabel: 'Start Free Trial',
      google_pay: '1',

      // תיאור ומזהים פנימיים
      uid: urlParams.code,
      u1: urlParams.code,
      u2: urlParams.plan,
      u3: urlParams.billing,
      u4: urlParams.price,
      pdesc: `Yaya ${urlParams.plan} - 7 Day Free Trial (USD)`,

      // דפי חזרה + notify
      success_url_address: `${success}?plan=${urlParams.plan}&price=${urlParams.price}&code=${urlParams.code}`,
      fail_url_address:    `${fail}?plan=${urlParams.plan}&code=${urlParams.code}`,
      notify_url_address:  notify,
    })

    return `${TRZ_BASE}?${params.toString()}`
  }, [urlParams.plan, urlParams.price, urlParams.billing, urlParams.code, firstName, lastName, email, phone, recurStartDate])

  const handlePaymentRedirect = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      alert('Please fill in all required fields (First/Last name and Email)')
      return
    }
    window.location.href = tranzilaUrl
  }

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
          {/* ORDER SUMMARY */}
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
                  <span>Then monthly (from {new Date(recurStartDate).toLocaleDateString()})</span>
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

          {/* תשלום */}
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
                  <label style={labelStyle}>First name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Last name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    type="email"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    style={inputStyle}
                  />
                </div>
              </div>

              <p style={{ marginTop: 8, color: '#7a6a5f', fontSize: '.9rem' }}>
                You’ll be redirected to our secure payment page.
              </p>
            </div>

            {/* כפתור Redirect */}
            <div
              style={{
                marginTop: 12,
                background: 'white',
                borderRadius: 20,
                padding: '2rem',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
                textAlign: 'center',
              }}
            >
              <button
                onClick={handlePaymentRedirect}
                disabled={!firstName.trim() || !lastName.trim() || !email.trim()}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: (!firstName.trim() || !lastName.trim() || !email.trim())
                    ? '#cccccc'
                    : 'linear-gradient(135deg, #8B5E3C 0%, #A0673F 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: (!firstName.trim() || !lastName.trim() || !email.trim())
                    ? 'not-allowed'
                    : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(139, 94, 60, 0.3)',
                }}
              >
                {(!firstName.trim() || !lastName.trim() || !email.trim())
                  ? 'Please fill required fields'
                  : 'Start 7-Day Free Trial'
                }
              </button>

              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#7a6a5f' }}>
                <Shield size={16} />
                <span style={{ fontSize: '.9rem' }}>
                  256-bit SSL encryption • PCI DSS compliant • Powered by Tranzila
                </span>
              </div>
            </div>
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
