// FILE: src/app/payment/checkout/page.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
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

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    const t = setTimeout(() => setIsLoading(false), 500)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t) }
  }, [])

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

  const currentPlan = useMemo(() => ({
    name: urlParams.plan === 'ultimate' ? 'Ultimate Plan' : 'Executive Plan',
    features: urlParams.plan === 'ultimate'
      ? ['All Executive features', 'Food & calorie tracking', 'Advanced analytics', 'Priority support']
      : ['Google Calendar integration', 'Expense tracking', 'Contact management', 'Recurring reminders']
  }), [urlParams.plan])

  const iframeSrc = useMemo(() => {
    if (typeof window === 'undefined') return ''

    const trialStart = new Date().toISOString()
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const baseUrl = 'https://direct.tranzila.com/fxpyairsabagtok/iframenew.php'

const params = new URLSearchParams({
  tranmode: 'VK',
  hidesum: '1',
  currency: '2', // אם הטרמינל לא עובד במט"ח, תראה חיוב ב-₪ בפועל

  // שדות מותאמים – חוזרים ב-success/notify
  u1: urlParams.code,
  u2: urlParams.plan,
  u3: urlParams.billing,
  u4: urlParams.price,

  trial_start: trialStart,
  trial_end: trialEnd,

  pdesc: `Yaya ${urlParams.plan} - 7 Day Trial Authorization`,
  trBgColor: 'FAF5F0',
  trTextColor: '2D5016',
  trButtonColor: '8B5E3C',
  buttonLabel: 'Start Free Trial',

  success_url_address: `${window.location.origin}/api/tranzila/success-bridge`,
  fail_url_address: `${window.location.origin}/api/tranzila/fail-bridge`,
  notify_url_address: 'https://n8n-TD2y.sliplane.app/webhook/update-user-plan',
})

    return `${baseUrl}?${params.toString()}`
  }, [urlParams])

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          {/* GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
            gap: isMobile ? '1.5rem' : '2rem',
            alignItems: 'start'
          }}>
            {/* Order summary */}
            <div>
              <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#8B5E3C' }}>
                Order Summary
              </h2>
              <div style={{ background: '#fff', borderRadius: 20, padding: isMobile ? '1.25rem' : '1.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: isMobile ? '1.1rem' : '1.2rem', fontWeight: 600, color: '#8B5E3C', marginBottom: 6 }}>
                    {currentPlan.name}
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: 14, opacity: 0.8 }}>
                    {urlParams.billing === 'yearly' ? 'Annual' : 'Monthly'} subscription
                  </p>
                </div>
                {urlParams.code && (
                  <div style={{ background: 'rgba(37,211,102,0.1)', borderRadius: 12, padding: '0.75rem 1rem', border: '1px solid rgba(37,211,102,0.3)', marginBottom: '1.25rem' }}>
                    <p style={{ color: '#25d366', fontSize: 14, fontWeight: 600, margin: 0 }}>
                      ✅ Registration Code: {urlParams.code}
                    </p>
                  </div>
                )}
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
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', color: '#8B5E3C', fontSize: 13.5 }}>
                  <Lock size={14} /> SSL Secured
                </div>
              </div>
            </div>

            {/* Iframe */}
            <div>
              <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#8B5E3C' }}>
                Complete Your Order
              </h2>
              <div style={{ background: '#fff', borderRadius: 20, padding: 0, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)', minHeight: isMobile ? 600 : 650 }}>
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 600 }}>
                    <div style={{ width: 50, height: 50, border: '4px solid #E5DDD5', borderTopColor: '#8B5E3C', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
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
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
