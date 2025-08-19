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

  const plans = {
    executive: { name: 'Executive Plan' },
    ultimate: { name: 'Ultimate Plan' },
  } as const
  const currentPlan = plans[(urlParams.plan as keyof typeof plans) || 'executive'] || plans.executive

  const recurStartDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10)
  }, [])

  const tranzilaUrl = useMemo(() => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://www.yayagent.com'

    // מה שנרצה שיגיע ל-success ישירות דרך GET
    const successQuery = new URLSearchParams({
      plan: urlParams.plan,
      email: email.trim(),
      price: urlParams.price,
      code: urlParams.code,
      billing: urlParams.billing,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    }).toString()

    const base = 'https://direct.tranzila.com/fxpyairsabag/iframenew.php'
    const params = new URLSearchParams({
      // עסקה רגילה (כמו הלינק שעבד לך)
      sum: urlParams.price,
      currency: '2',
      tranmode: 'AK',
      cred_type: '1',

      // חיוב חוזר החל בעוד 7 ימים
      recur_sum: urlParams.price,
      recur_transaction: '4_approved',
      recur_start_date: recurStartDate,

      // פרטי לקוח למסוף (לא חובה, אבל נוח)
      contact: [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
      email: email.trim(),
      phone: phone.trim(),

      // ===== 🎨 עיצוב – עם לוגו ואייקונים של Tranzila =====
      trBgColor: 'FAF5F0',         // רקע
      trTextColor: '2D5016',       // טקסט
      trButtonColor: '8B5E3C',     // כפתור
      trButtonTextColor: 'FFFFFF', // טקסט הכפתור
      trTextSize: '16',
      buttonLabel: 'Pay and Start',
      google_pay: '1',

      // מזהים
      uid: urlParams.code,
      u1: urlParams.code,
      u2: urlParams.plan,
      u3: urlParams.billing,
      u4: urlParams.price,
      pdesc: `Yaya ${urlParams.plan} - Monthly Plan USD`,

      // חזרה ישירה לעמוד הצלחה/כישלון
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
    })

    return `${base}?${params.toString()}`
  }, [
    urlParams.plan, urlParams.price, urlParams.billing, urlParams.code,
    firstName, lastName, email, phone, recurStartDate
  ])

  const handleRedirectToTranzila = () => {
    if (!email.trim()) {
      alert('Please enter an email so we can send your receipt.')
      return
    }
    window.location.href = tranzilaUrl
  }

  return (
    <div style={{
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
    }}>
      <header style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '1rem 0',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: isMobile ? '0 1rem' : '0 2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
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
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: isMobile ? '0 1rem' : '0 2rem',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '380px 1fr',
          gap: '1.5rem', alignItems: 'start'
        }}>
          {/* Order Summary */}
          <section style={{
            background: 'white', borderRadius: 20, padding: '1.25rem',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
            position: 'sticky', top: 24,
          }}>
            <h2 style={{ margin: 0, color: '#2d5016', fontWeight: 700, fontSize: '1.1rem' }}>Order Summary</h2>
            <div style={{ marginTop: 16, padding: 16, border: '1px solid #E5DDD5', borderRadius: 12, background: '#FBFAF8' }}>
              <h3 style={{ margin: 0, color: '#8B5E3C', fontWeight: 700 }}>{currentPlan.name}</h3>
              <p style={{ margin: '6px 0 0', color: '#7a6a5f', fontSize: '.9rem' }}>Monthly subscription</p>

              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} style={{ color: '#22c55e' }} />
                <span style={{
                  fontSize: '.85rem', padding: '6px 10px', borderRadius: 8,
                  background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', color: '#166534'
                }}>
                  Registration Code: {urlParams.code}
                </span>
              </div>

              {/* 🔹 כאן השינוי היחיד בתצוגה 🔹 */}
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

            <div style={{
              marginTop: 12, background: 'white', borderRadius: 20, padding: '1rem',
              border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 6px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <div><label style={label}>First name</label><input style={input} value={firstName} onChange={e=>setFirstName(e.target.value)} /></div>
                <div><label style={label}>Last name</label> <input style={input} value={lastName} onChange={e=>setLastName(e.target.value)} /></div>
                <div><label style={label}>Email</label>     <input style={input} type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
                <div><label style={label}>Phone</label>     <input style={input} value={phone} onChange={e=>setPhone(e.target.value)} /></div>
              </div>

              <button
                onClick={handleRedirectToTranzila}
                style={{
                  marginTop: 12, width: '100%', padding: '16px 24px',
                  background: 'linear-gradient(135deg, #8B5E3C 0%, #A0673F 100%)',
                  color: 'white', border: 'none', borderRadius: 12,
                  fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(139, 94, 60, 0.3)'
                }}
              >
                Pay Securely
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
