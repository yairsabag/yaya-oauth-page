// FILE: src/app/payment/checkout/page.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Shield, Lock } from 'lucide-react'

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const [urlParams, setUrlParams] = useState({
    plan: 'executive',
    price: '5',
    billing: 'monthly',
    code: 'F75CEJ',
    planName: 'Executive Plan',
    email: ''
  })

  // detect mobile
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    const t = setTimeout(() => setIsLoading(false), 600)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t) }
  }, [])

  // read URL params once
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setUrlParams({
      plan: p.get('plan') || 'executive',
      price: p.get('price') || '5',
      billing: p.get('billing') || 'monthly',
      code: p.get('code') || 'F75CEJ',
      planName: p.get('planName') || 'Executive Plan',
      email: p.get('email') || ''
    })
  }, [])

  const planDetails = {
    executive: {
      name: 'Executive Plan',
      features: [
        'Google Calendar integration',
        'Expense tracking',
        'Contact management',
        'Recurring reminders'
      ],
    },
    ultimate: {
      name: 'Ultimate Plan',
      features: [
        'All Executive features',
        'Food & calorie tracking',
        'Advanced analytics',
        'Priority support'
      ],
    },
  }
  const currentPlan = planDetails[urlParams.plan as keyof typeof planDetails] || planDetails.executive

  // build the iframe URL (VK -> token + אימות לפי הטרמינל)
  const iframeSrc = useMemo(() => {
    if (typeof window === 'undefined') return ''

    const trialStart = new Date().toISOString()
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    // מה שיעבור אל /payment/success
    const successQS = new URLSearchParams({
      plan: urlParams.plan,
      price: urlParams.price,
      billing: urlParams.billing,
      code: urlParams.code,
      email: urlParams.email || '',
      trial_start: trialStart,
      trial_end: trialEnd
      // Tranzila תוסיף TranzilaTK ב-redirect
    })

    // חשוב: iframe חדש + VK מותר לשלוח בפרמטרי GET
    const baseUrl = 'https://direct.tranzila.com/fxpyairsabag/iframenew.php'

    const params = new URLSearchParams({
      // VK = Verification + Token (סכום האימות נקבע במסוף)
      tranmode: 'VK',
      hidesum: '1',
      currency: '2', // USD (אם אין מט"ח במסוף – יחויב ILS)
      nologo: '1',
      lang: 'il',

      // שדות משלך (יחזרו ב-notify/redirect)
      u1: urlParams.code,
      u2: urlParams.plan,
      u3: urlParams.billing,
      u4: urlParams.price,

      // תיאור
      pdesc: `Yaya ${urlParams.plan} - 7 Day Trial Authorization`,

      // עיצוב
      trBgColor: 'FAF5F0',
      trTextColor: '2D5016',
      trButtonColor: '8B5E3C',
      buttonLabel: 'Start Free Trial',

      // כתובות חזרה (בממשק מסוף -> מתקדמות: Return Method = GET)
      success_url_address: `${window.location.origin}/payment/success?${successQS.toString()}`,
      fail_url_address: `${window.location.origin}/payment/checkout?plan=${urlParams.plan}&price=${urlParams.price}&billing=${urlParams.billing}&code=${urlParams.code}&error=true`,
      notify_url_address: 'https://n8n-TD2y.sliplane.app/webhook/update-user-plan',
    })

    return `${baseUrl}?${params.toString()}`
  }, [urlParams])

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img src="/yaya-logo.png" alt="Yaya Assistant Logo" style={{ width: isMobile ? 60 : 80, height: isMobile ? 60 : 80, objectFit: 'contain' }} />
            <span style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 600, color: '#2d5016' }}>Yaya</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a5568' }}>
            <Shield size={16} />
            {!isMobile && <span style={{ fontSize: '0.9rem' }}>Secure Checkout</span>}
          </div>
        </div>
      </header>

      <main style={{ padding: isMobile ? '1.5rem 0' : '3rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem' }}>
          {/* Progress */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#8B5E3C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>1</div>
                <span style={{ fontSize: 14, color: '#8B5E3C', fontWeight: 500 }}>Plan Selection</span>
              </div>
              <div style={{ width: 50, height: 2, background: '#8B5E3C' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#8B5E3C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>2</div>
                <span style={{ fontSize: 14, color: '#8B5E3C', fontWeight: 500 }}>Payment</span>
              </div>
              <div style={{ width: 50, height: 2, background: '#E5DDD5' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#E5DDD5', color: '#8B5E3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>3</div>
                <span style={{ fontSize: 14, color: '#8B5E3C', opacity: 0.6 }}>Confirmation</span>
              </div>
            </div>
          </div>

          {/* GRID – משמאל סיכום, מימין iframe */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
              gap: isMobile ? '1.5rem' : '2rem',
              alignItems: 'start',
            }}
          >
            {/* LEFT: Order Summary */}
            <div>
              <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#8B5E3C' }}>
                Order Summary
              </h2>

              <div style={{ background: 'white', borderRadius: 20, padding: isMobile ? '1.25rem' : '1.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: isMobile ? '1.1rem' : '1.2rem', fontWeight: 600, color: '#8B5E3C', marginBottom: 6 }}>
                    {currentPlan.name}
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: 14, opacity: 0.8 }}>
                    {urlParams.billing === 'yearly' ? 'Annual' : 'Monthly'} subscription
                  </p>
                </div>

                {urlParams.code && (
                  <div style={{ background: 'rgba(37, 211, 102, 0.1)', borderRadius: 12, padding: '0.75rem 1rem', border: '1px solid rgba(37,211,102,0.3)', marginBottom: '1.25rem' }}>
                    <p style={{ color: '#25d366', fontSize: 14, fontWeight: 600, margin: 0 }}>
                      ✅ Registration Code: {urlParams.code}
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: 14, color: '#8B5E3C', fontWeight: 600, marginBottom: 8, opacity: 0.8 }}>Included Features:</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {currentPlan.features.slice(0, 4).map((f, i) => (
                      <li key={i} style={{ fontSize: 13.5, color: '#8B5E3C', marginBottom: 6 }}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#8B5E3C', fontSize: 15 }}>
                    <span>7-day free trial</span>
                    <span style={{ color: '#25d366', fontWeight: 600 }}>$0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8B5E3C', fontSize: 15 }}>
                    <span>Then {urlParams.billing === 'yearly' ? 'annually' : 'monthly'}</span>
                    <span>${urlParams.price}/{urlParams.billing === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: isMobile ? 16 : 17, color: '#8B5E3C' }}>
                    <span>Total today</span>
                    <span style={{ color: '#25d366' }}>$0.00</span>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(37, 211, 102, 0.1)', borderRadius: 12, border: '1px solid rgba(37,211,102,0.2)' }}>
                  <p style={{ fontSize: 13.5, color: '#8B5E3C', textAlign: 'center', margin: 0 }}>
                    🎉 Cancel anytime during trial
                  </p>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8B5E3C', fontSize: 13.5 }}>
                    <Lock size={14} />
                    <span>SSL Secured</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8B5E3C', fontSize: 13.5 }}>
                    <Shield size={14} />
                    <span>PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Iframe */}
            <div>
              <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#8B5E3C' }}>
                Complete Your Order
              </h2>

              <div style={{ background: '#fff', borderRadius: 20, padding: 0, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)', minHeight: isMobile ? 600 : 650 }}>
                {isLoading || !iframeSrc ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 600, flexDirection: 'column', gap: 16 }}>
                    <div style={{ width: 50, height: 50, border: '4px solid #E5DDD5', borderTopColor: '#8B5E3C', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: '#8B5E3C', fontSize: 15 }}>Loading secure payment form...</p>
                  </div>
                ) : (
                  <iframe
                    src={iframeSrc}
                    style={{ width: '100%', height: isMobile ? 650 : 700, border: 'none', display: 'block' }}
                    title="Secure Payment"
                    allow="payment"
                    sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                  />
                )}
              </div>

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#718096', marginBottom: '0.75rem' }}>
                  Your payment information is encrypted and secure. We never store your credit card details.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <img src="https://www.tranzila.com/images/logo-tranzila.png" alt="Tranzila" style={{ height: 30, opacity: 0.7 }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" style={{ height: 20, opacity: 0.7 }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: 30, opacity: 0.7 }} />
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#718096' }}>
              By proceeding, you agree to our <a href="/terms" style={{ color: '#8B5E3C', textDecoration: 'underline' }}>Terms</a> and <a href="/privacy" style={{ color: '#8B5E3C', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export {}
