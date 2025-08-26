// src/app/payment/checkout/page.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle, Shield } from 'lucide-react'

type UrlParams = {
  plan: 'executive' | 'ultimate'
  price: string          // "5" | "14"
  billing: 'monthly' | 'yearly'
  code: string
  planName: string
}

const PLANS = {
  executive: { name: 'Executive Plan', defaultPrice: '5' },
  ultimate:  { name: 'Ultimate Plan',  defaultPrice: '14' },
} as const

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState<UrlParams>({
    plan: 'executive',
    price: '5',
    billing: 'monthly',
    code: 'F75CEJ',
    planName: 'Executive Plan',
  })

  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [isMobile,  setIsMobile]  = useState(false)

  // קלט מה־URL + התאמה למסך קטן
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const plan = ((p.get('plan') || 'executive') as UrlParams['plan']).toLowerCase() as UrlParams['plan']
    const planInfo = PLANS[plan] || PLANS.executive

    setUrlParams({
      plan,
      price: p.get('price') || planInfo.defaultPrice,
      billing: ((p.get('billing') || 'monthly') as UrlParams['billing']).toLowerCase() as UrlParams['billing'],
      code: p.get('code') || 'F75CEJ',
      planName: p.get('planName') || planInfo.name,
    })

    const onResize = () => setIsMobile(window.innerWidth < 940)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // תאריך התחלת החיוב המחזורי – עוד 7 ימים
  const recurStartDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10) // yyyy-mm-dd
  }, [])

  // כתובת למסך ה־iframe של טרנזילה (מסוף טוקנים)
  const tranzilaUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.yayagent.com'

    // מה שנוח לנו לקלוט ב-success
    const successQuery = new URLSearchParams({
      plan: urlParams.plan,
      price: urlParams.price,
      billing: urlParams.billing,
      code: urlParams.code,
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    }).toString()

    // מסוף הטוקנים
    const base = 'https://direct.tranzila.com/fxpyairsabagfxp/iframe.php'

    // בניית הפרמטרים
    const params = new URLSearchParams({
      // ===== פעולה: אימות כרטיס + יצירת טוקן =====
      tranmode: 'VK',        // V=Verify, K=Token
      sum: '1',              // היום לא מחייבים
      currency: '2',         // 2 = USD
      cred_type: '1',        // סוג כרטיס (אפשר להשאיר 1)
      
      // ===== חיוב מחזורי (Fixed, לא בחירת לקוח) =====
      // אם תרצה "בחירת לקוח" – השתמש ב- '4' ללא "_approved"
      recur_transaction: '4_approved', // חודשי
      recur_sum: urlParams.price,      // סכום החיוב החודשי
      recur_start_date: recurStartDate,

      // פרטי לקוח לתצוגה בממשק
      contact: [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
      email: email.trim(),
      phone: phone.trim(),

      // מזהים כלליים
      uid: urlParams.code,
      u1: urlParams.code,
      u2: urlParams.plan,
      u3: urlParams.billing,
      u4: urlParams.price,
      pdesc: `Yaya ${urlParams.plan} - Monthly Plan USD`,

      // חזרה/נוטיפיקציה
      success_url_address: `${origin}/payment/success?${successQuery}`,
      fail_url_address: `${origin}/payment/fail`,
      notify_url_address:
        `https://n8n-TD2y.sliplane.app/webhook/update-user-plan` +
        `?uid=${encodeURIComponent(urlParams.code)}` +
        `&plan=${encodeURIComponent(urlParams.plan)}` +
        `&billing=${encodeURIComponent(urlParams.billing)}` +
        `&price=${encodeURIComponent(urlParams.price)}` +
        `&email=${encodeURIComponent(email.trim())}` +
        `&firstName=${encodeURIComponent(firstName.trim())}` +
        `&lastName=${encodeURIComponent(lastName.trim())}`,

      // UI (אופציונלי)
      trBgColor: 'FAF5F0',
      trTextColor: '2D5016',
      trButtonColor: '8B5E3C',
      trButtonTextColor: 'FFFFFF',
      trTextSize: '16',
      buttonLabel: 'Start Free Trial',

      // בקש שגיאות מפורטות במקום System Error כללי
      err_code: '1',
    })

    return `${base}?${params.toString()}`
  }, [urlParams, email, firstName, lastName, phone, recurStartDate])

  const handleRedirectToTranzila = () => {
    if (!email.trim()) {
      alert('Please enter an email so we can send your receipt.')
      return
    }
    window.location.href = tranzilaUrl
  }

  const currentPlan = PLANS[urlParams.plan] || PLANS.executive

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)' }}>
      <header style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', textDecoration: 'none' }}>
            <img src="/yaya-logo.png" alt="Yaya Assistant" style={{ width: 72, height: 72, objectFit: 'contain' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2d5016' }}>Yaya</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4a5568' }}>
            <Shield size={16} />
            {!isMobile && <span style={{ fontSize: '.9rem' }}>Secure Checkout</span>}
          </div>
        </div>
      </header>

      <main style={{ padding: isMobile ? '1.5rem 0' : '3rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '380px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Order Summary */}
          <section style={{ background: 'white', borderRadius: 20, padding: '1.25rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 6px rgba(0,0,0,0.04)', position: 'sticky', top: 24 }}>
            <h2 style={{ margin: 0, color: '#2d5016', fontWeight: 700, fontSize: '1.1rem' }}>Order Summary</h2>
            <div style={{ marginTop: 16, padding: 16, border: '1px solid #E5DDD5', borderRadius: 12, background: '#FBFAF8' }}>
              <h3 style={{ margin: 0, color: '#8B5E3C', fontWeight: 700 }}>{currentPlan.name}</h3>
              <p style={{ margin: '6px 0 0', color: '#7a6a5f', fontSize: '.9rem' }}>Monthly subscription</p>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} style={{ color: '#22c55e' }} />
                <span style={{ fontSize: '.85rem', padding: '6px 10px', borderRadius: 8, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', color: '#166534' }}>
                  Registration Code: {urlParams.code}
                </span>
              </div>
              <div style={{ marginTop: 12, borderTop: '1px solid #E5DDD5', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Total due today:</span><span>$0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Total after trial:</span><span>${urlParams.price}.00/month</span>
                </div>
              </div>
            </div>
          </section>

          {/* Customer + Pay */}
          <section>
            <h2 style={{ margin: 0, color: '#2d5016', fontWeight: 700, fontSize: '1.1rem' }}>Complete Your Order</h2>
            <div style={{ marginTop: 12, background: 'white', borderRadius: 20, padding: '1rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 6px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <div><label style={label}>First name</label><input style={input} value={firstName} onChange={e=>setFirstName(e.target.value)} /></div>
                <div><label style={label}>Last name</label> <input style={input} value={lastName} onChange={e=>setLastName(e.target.value)} /></div>
                <div><label style={label}>Email</label>     <input style={input} type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
                <div><label style={label}>Phone</label>     <input style={input} value={phone} onChange={e=>setPhone(e.target.value)} /></div>
              </div>
              <button
                onClick={handleRedirectToTranzila}
                style={{ marginTop: 12, width: '100%', padding: '16px 24px', background: 'linear-gradient(135deg, #8B5E3C 0%, #A0673F 100%)',
                  color: 'white', border: 'none', borderRadius: 12, fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(139, 94, 60, 0.3)' }}
              >
                Start Free Trial
              </button>
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

const label: React.CSSProperties = { display: 'block', fontSize: '.85rem', color: '#6b7280', marginBottom: 6 }
const input:  React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E5DDD5', outline: 'none', fontSize: '.95rem' }
