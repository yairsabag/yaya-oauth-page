'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Shield, Lock } from 'lucide-react'

type Params = {
  plan: string
  price: string
  billing: string
  code: string
  planName: string
}

function plusDays(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  // טרנזילה דורשים yyyy-mm-dd
  return d.toISOString().slice(0, 10)
}

export default function CheckoutPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // שדות פרטי לקוח שנשלחים כ־predetermined fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // פרמטרים מה־URL (כמו שהיה אצלך)
  const params = useMemo<Params>(() => {
    if (typeof window === 'undefined') {
      return { plan: 'executive', price: '5', billing: 'monthly', code: 'F75CEJ', planName: 'Executive Plan' }
    }
    const p = new URLSearchParams(window.location.search)
    return {
      plan: p.get('plan') || 'executive',
      price: p.get('price') || '5',
      billing: p.get('billing') || 'monthly',
      code: p.get('code') || 'F75CEJ',
      planName: p.get('planName') || 'Executive Plan',
    }
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    const t = setTimeout(() => setIsLoading(false), 300)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
    }
  }, [])

  // Calculated dates for the 7-day free trial
  const recurStart = useMemo(() => plusDays(7), [])
  const trialStart = useMemo(() => plusDays(0), [])
  const trialEnd = useMemo(() => plusDays(7), [])

  // חשוב: לא לשים src על ה־iframe; אנחנו טוענים באמצעות POST
  const formRef = useRef<HTMLFormElement>(null)

  // נתוני תכנית להצגה בלבד
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
  const currentPlan = (planDetails as any)[params.plan] || planDetails.executive

  // מסוף ו־URL
  const terminal = 'fxpyairsabag'
  const iframePostUrl = `https://direct.tranzila.com/${terminal}/iframenew.php`

  // כתובות החזרה – כבר הגדרת במסוף, אבל שמים גם כאן לטובת שקיפות
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://yayagent.com'
  const successUrl = `${base}/payment/success?plan=${encodeURIComponent(params.plan)}&price=${encodeURIComponent(
    params.price
  )}&billing=${encodeURIComponent(params.billing)}&code=${encodeURIComponent(params.code)}&trial=true&trial_start=${encodeURIComponent(
    trialStart
  )}&trial_end=${encodeURIComponent(trialEnd)}`
  const failUrl = `${base}/payment/failed`
  const notifyUrl = 'https://n8n-TD2y.sliplane.app/webhook/update-user-plan'

  // שולח את הטופס ל־iframe (לא חובה אוטומטי; לחיצה על הכפתור תעשה submit)
  const submitToIframe = (e: React.FormEvent) => {
    e.preventDefault()
    formRef.current?.submit()
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
            maxWidth: '1200px',
            margin: '0 auto',
            padding: isMobile ? '0 1rem' : '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img src="/yaya-logo.png" alt="Yaya Assistant Logo" style={{ width: isMobile ? 60 : 80, height: isMobile ? 60 : 80, objectFit: 'contain' }} />
            <span style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 600, color: '#2d5016' }}>
              Yaya
            </span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a5568' }}>
            <Shield size={16} />
            {!isMobile && <span style={{ fontSize: '0.9rem' }}>Secure Checkout</span>}
          </div>
        </div>
      </header>

      <main style={{ padding: isMobile ? '1.5rem 0' : '3rem 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem' }}>
          {/* Progress */}
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: 8, color: '#8B5E3C' }}>
            <div>1 • Plan Selection</div>
            <div>—</div>
            <div style={{ fontWeight: 700 }}>2 • Payment</div>
            <div>—</div>
            <div>3 • Confirmation</div>
          </div>

          <div
            style={{
              display: isMobile ? 'flex' : 'grid',
              flexDirection: isMobile ? 'column' : undefined,
              gridTemplateColumns: isMobile ? undefined : '1fr 2fr',
              gap: isMobile ? '1.5rem' : '2.5rem',
            }}
          >
            {/* Order Summary */}
            <div>
              <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#8B5E3C' }}>
                Order Summary
              </h2>
              <div
                style={{
                  background: 'white',
                  borderRadius: 20,
                  padding: isMobile ? '1.25rem' : '1.75rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: isMobile ? '1.1rem' : '1.2rem', fontWeight: 600, color: '#8B5E3C', margin: 0 }}>
                    {currentPlan.name}
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: isMobile ? '.875rem' : '.9rem', opacity: .8, marginTop: 4 }}>
                    {params.billing === 'yearly' ? 'Annual' : 'Monthly'} subscription
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(37, 211, 102, 0.1)',
                    borderRadius: 12,
                    padding: isMobile ? '.75rem' : '1rem',
                    border: '1px solid rgba(37, 211, 102, 0.3)',
                    marginBottom: '1rem',
                    color: '#25d366',
                    fontWeight: 600,
                    fontSize: isMobile ? '.875rem' : '.9rem',
                  }}
                >
                  ✅ Registration Code: {params.code}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '.9rem', color: '#8B5E3C', fontWeight: 600, marginBottom: '.5rem', opacity: .85 }}>
                    Included Features:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {currentPlan.features.slice(0, 4).map((f: string, i: number) => (
                      <li key={i} style={{ fontSize: '.85rem', color: '#8B5E3C', marginBottom: '.4rem' }}>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: 12, marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#8B5E3C' }}>
                    <span>7-day free trial</span>
                    <span style={{ color: '#25d366', fontWeight: 600 }}>$0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#8B5E3C' }}>
                    <span>Then {params.billing === 'yearly' ? 'annually' : 'monthly'}</span>
                    <span>${params.price}/{params.billing === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#8B5E3C', marginTop: 6 }}>
                    <span>Total today</span>
                    <span style={{ color: '#25d366' }}>$0.00</span>
                  </div>
                </div>

                <div style={{ marginTop: 14, display: 'flex', gap: 12, justifyContent: 'center', color: '#8B5E3C' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.85rem' }}>
                    <Lock size={14} />
                    <span>SSL Secured</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment form + IFRAME */}
            <div>
              <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#8B5E3C' }}>
                Complete Your Order
              </h2>

              {/* שדות פרטי לקוח – נשלחים כמוגדר במסמך תחת "predetermined additional fields" */}
              <div
                style={{
                  background: 'white',
                  borderRadius: 20,
                  padding: isMobile ? '1rem' : '1.25rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: '.85rem', color: '#8B5E3C' }}>First name*</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John"
                      style={{ width: '100%', border: '1px solid #E5DDD5', borderRadius: 10, padding: '10px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '.85rem', color: '#8B5E3C' }}>Last name*</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe"
                      style={{ width: '100%', border: '1px solid #E5DDD5', borderRadius: 10, padding: '10px' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '.85rem', color: '#8B5E3C' }}>Email*</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                      style={{ width: '100%', border: '1px solid #E5DDD5', borderRadius: 10, padding: '10px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '.85rem', color: '#8B5E3C' }}>Phone (optional)</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+9725..."
                      style={{ width: '100%', border: '1px solid #E5DDD5', borderRadius: 10, padding: '10px' }} />
                  </div>
                </div>
              </div>

              {/* ה־form שמבצע POST אל IFRAME */}
              <div
                style={{
                  background: 'white',
                  borderRadius: 20,
                  padding: 0,
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <form
                  ref={formRef}
                  action={iframePostUrl}
                  method="POST"
                  target="tranzila"
                  onSubmit={submitToIframe}
                  autoComplete="off"
                  style={{ padding: isMobile ? '1rem' : '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                >
                  {/* סכום היום = 0 לצורך הרשמה, המטבע דולר */}
                  <input type="hidden" name="sum" value="0" />
                  <input type="hidden" name="currency" value="2" />
                  <input type="hidden" name="lang" value="en" />

                  {/* חיוב מחזורי אחרי 7 ימים – סכום חודשי */}
                  <input type="hidden" name="recur_transaction" value="4_approved" />
                  <input type="hidden" name="recur_sum" value={params.price} />
                  <input type="hidden" name="recur_start_date" value={recurStart} />

                  {/* צבעים וכפתור */}
                  <input type="hidden" name="trBgColor" value="FAF5F0" />
                  <input type="hidden" name="trTextColor" value="2D5016" />
                  <input type="hidden" name="trButtonColor" value="8B5E3C" />
                  <input type="hidden" name="buttonLabel" value="Start Free Trial" />

                  {/* U fields לזיהוי אצלך */}
                  <input type="hidden" name="u1" value={params.code} />
                  <input type="hidden" name="u2" value={params.plan} />
                  <input type="hidden" name="u3" value={params.billing} />
                  <input type="hidden" name="u4" value={params.price} />
                  <input type="hidden" name="pdesc" value={`Yaya ${params.plan} - 7 day trial then $${params.price}/${params.billing === 'yearly' ? 'yr' : 'mo'}`} />

                  {/* success/fail/notify – גם אם הוגדר במסוף, שומרים עקביות */}
                  <input type="hidden" name="success_url_address" value={successUrl} />
                  <input type="hidden" name="fail_url_address" value={failUrl} />
                  <input type="hidden" name="notify_url_address" value={notifyUrl} />

                  {/* שדות מוגדרים מראש (שם/מייל/טלפון) */}
                  <input type="hidden" name="contact" value={`${firstName} ${lastName}`.trim()} />
                  <input type="hidden" name="email" value={email} />
                  <input type="hidden" name="phone" value={phone} />

                  {/* כפתור שמבצע submit אל ה־iframe */}
                  <button
                    type="submit"
                    disabled={isLoading || !firstName || !lastName || !email}
                    style={{
                      background: '#8B5E3C',
                      color: 'white',
                      padding: '12px 18px',
                      borderRadius: 10,
                      border: 'none',
                      fontWeight: 600,
                      cursor: isLoading || !firstName || !lastName || !email ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isLoading ? 'Loading…' : 'Open Secure Payment'}
                  </button>
                  <div style={{ fontSize: 12, color: '#8B5E3C', opacity: .7, marginTop: 8 }}>
                    The secure card form loads below. We never store your card.
                  </div>
                </form>

                {/* כאן נטען דף התשלום הבטוח של טרנזילה */}
                <div style={{ width: '100%', height: isMobile ? 600 : 720 }}>
                  <iframe
                    id="tranzila-frame"
                    name="tranzila"
                    title="Secure Payment Form"
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    // חשוב ל-Google Pay
                    allow="payment"
                    // חשוב לשילוב IFRAME חדש של טרנזילה
                    allowPaymentRequest
                    // לא חוסמים פופאפים כי 3DS/Wallet פותחים חלונות
                    sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info footer */}
          <div style={{ marginTop: '2rem', textAlign: 'center', color: '#718096', fontSize: '.9rem' }}>
            Your payment information is encrypted and secure. We never store your credit card details.
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
