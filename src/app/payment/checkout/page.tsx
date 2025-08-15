'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Shield, Lock } from 'lucide-react'

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState({
    plan: '',
    price: '',
    billing: '',
    code: '',
    planName: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile + splash
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    const t = setTimeout(() => setIsLoading(false), 800)
    return () => { window.removeEventListener('resize', checkMobile); clearTimeout(t) }
  }, [])

  // Read URL params
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setUrlParams({
      plan: p.get('plan') || 'executive',
      price: p.get('price') || '5',
      billing: p.get('billing') || 'monthly',
      code: p.get('code') || 'F75CEJ',
      planName: p.get('planName') || 'Executive Plan'
    })
  }, [])

  const planDetails = {
    executive: { name: 'Executive Plan', features: ['Google Calendar integration','Expense tracking','Contact management','Recurring reminders'] },
    ultimate: { name: 'Ultimate Plan', features: ['All Executive features','Food & calorie tracking','Advanced analytics','Priority support'] }
  }
  const currentPlan = planDetails[(urlParams.plan as 'executive'|'ultimate')] || planDetails.executive

  // Tranzila endpoint
  const tranzilaAction = 'https://direct.tranzila.com/fxpyairsabag/iframenew.php'

  // Duplicate-protection id (DCdisable)
  const dcDisable = useMemo(() => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
    return `yaya-${Date.now()}-${Math.random().toString(36).slice(2)}`
  }, [])

  const successUrl = useMemo(() => {
    const o = window.location.origin
    const q = new URLSearchParams({ plan: urlParams.plan, price: urlParams.price, billing: urlParams.billing, code: urlParams.code, trial: 'true' })
    return `${o}/payment/success?${q.toString()}`
  }, [urlParams])

  const failUrl = useMemo(() => {
    const o = window.location.origin
    const q = new URLSearchParams({ plan: urlParams.plan, price: urlParams.price, billing: urlParams.billing, code: urlParams.code, error: 'true' })
    return `${o}/payment/checkout?${q.toString()}`
  }, [urlParams])

  // Auto-post hidden form into the iframe
  useEffect(() => {
    if (isLoading) return
    const form = document.getElementById('tranzila-form') as HTMLFormElement | null
    // במקרה שהדף איטי – נסה שוב אחרי 100ms
    const send = () => form?.submit()
    send()
    const t = setTimeout(send, 100)
    return () => clearTimeout(t)
  }, [isLoading])

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
          <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' as const : undefined, gridTemplateColumns: isMobile ? undefined : '1fr 2fr', gap: isMobile ? '2rem' : '3rem' }}>
            {/* Order Summary */}
            <div style={{ order: 1 }}>
              <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: '#8B5E3C' }}>Order Summary</h2>
              <div style={{ background: 'white', borderRadius: 20, padding: isMobile ? '1.5rem' : '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: isMobile ? '1.1rem' : '1.2rem', fontWeight: 600, color: '#8B5E3C', marginBottom: '0.5rem' }}>{currentPlan.name}</h3>
                  <p style={{ color: '#8B5E3C', fontSize: isMobile ? '0.875rem' : '0.9rem', opacity: 0.8 }}>
                    {urlParams.billing === 'yearly' ? 'Annual' : 'Monthly'} subscription
                  </p>
                </div>
                {urlParams.code && (
                  <div style={{ background: 'rgba(37,211,102,0.1)', borderRadius: 12, padding: isMobile ? '0.75rem' : '1rem', border: '1px solid rgba(37,211,102,0.3)', marginBottom: '1.5rem' }}>
                    <p style={{ color: '#25d366', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: 600, margin: 0 }}>✅ Registration Code: {urlParams.code}</p>
                  </div>
                )}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#8B5E3C', fontWeight: 600, marginBottom: '0.75rem', opacity: 0.8 }}>Included Features:</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {currentPlan.features.slice(0, 4).map((f, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', color: '#8B5E3C', marginBottom: '0.5rem', opacity: 0.9 }}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C' }}>
                    <span>7-day free trial</span><span style={{ color: '#25d366', fontWeight: 600 }}>$0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C' }}>
                    <span>Then {urlParams.billing === 'yearly' ? 'annually' : 'monthly'}</span><span>${urlParams.price}/{urlParams.billing === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#8B5E3C' }}>
                    <span>Total today</span><span style={{ color: '#25d366' }}>$0.00</span>
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem', padding: isMobile ? '0.75rem' : '1rem', background: 'rgba(37,211,102,0.1)', borderRadius: 12, border: '1px solid rgba(37,211,102,0.2)' }}>
                  <p style={{ fontSize: '0.85rem', color: '#8B5E3C', textAlign: 'center', margin: 0 }}>🎉 Cancel anytime during trial</p>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8B5E3C', fontSize: '0.85rem' }}><Lock size={14} /><span>SSL Secured</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8B5E3C', fontSize: '0.85rem' }}><Shield size={14} /><span>PCI Compliant</span></div>
                </div>
              </div>
            </div>

            {/* Payment Iframe */}
            <div style={{ order: 2 }}>
              <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: '#8B5E3C' }}>Complete Your Order</h2>

              <div style={{ background: 'white', borderRadius: 20, padding: 0, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)', minHeight: isMobile ? 600 : 650 }}>
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 600, flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ width: 50, height: 50, border: '4px solid #E5DDD5', borderTopColor: '#8B5E3C', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: '#8B5E3C', fontSize: '0.9rem' }}>Loading secure payment form...</p>
                  </div>
                ) : (
                  <>
                    {/* Hidden POST form to Tranzila */}
                    <form id="tranzila-form" method="POST" action={tranzilaAction} target="tranzila" style={{ display: 'none' }}>
                      {/* אימות+טוקן (hidesum=1 מותר עם VK) */}
                      <input name="sum" defaultValue="1" />
                      <input name="currency" defaultValue="2" /> {/* USD */}
                      <input name="tranmode" defaultValue="VK" />
                      <input name="hidesum" defaultValue="1" />
                      <input name="nologo" defaultValue="1" />
                      <input name="lang" defaultValue="il" />

                      {/* צבעים/טקסט */}
                      <input name="trBgColor" defaultValue="FAF5F0" />
                      <input name="trTextColor" defaultValue="2D5016" />
                      <input name="trButtonColor" defaultValue="8B5E3C" />
                      <input name="buttonLabel" defaultValue="Start Free Trial" />

                      {/* שדות מותאמים */}
                      <input name="u1" defaultValue={urlParams.code} />
                      <input name="u2" defaultValue={urlParams.plan} />
                      <input name="u3" defaultValue={urlParams.billing} />
                      <input name="u4" defaultValue={urlParams.price} />

                      {/* מניעת כפולים — אם Field 20 לא מוגדר עדיין, אפשר להסיר זמנית את שתי השורות הבאות */}
                      <input name="u71" defaultValue="1" />
                      <input name="DCdisable" defaultValue={dcDisable} />

                      {/* תיאור מוצר */}
                      <input name="pdesc" defaultValue={`Yaya ${urlParams.plan} - 7 Day Trial Authorization`} />

                      {/* Redirect/Notify */}
                      <input name="success_url_address" defaultValue={successUrl} />
                      <input name="fail_url_address" defaultValue={failUrl} />
                      <input name="notify_url_address" defaultValue="https://n8n-TD2y.sliplane.app/webhook/update-user-plan" />
                    </form>

                    {/* Iframe target */}
                    <iframe
                      name="tranzila"
                      title="Secure Payment Form"
                      src="about:blank"
                      style={{ width: '100%', height: isMobile ? 650 : 700, border: 'none', display: 'block' }}
                      allow="payment"
                      sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                    />
                  </>
                )}
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1rem' }}>
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
        </div>
      </main>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
