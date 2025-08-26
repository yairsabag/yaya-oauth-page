// src/app/payment/checkout/page.tsx
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

  const [firstName, setFirstName] = useState('Yair')
  const [lastName,  setLastName]  = useState('Sabag')
  const [email,     setEmail]     = useState('yairsabag@gmail.com')
  const [phone,     setPhone]     = useState('0542598700')

  const [isMobile, setIsMobile]   = useState(false)

  // הטופס שאנחנו מגישים ל־Tranzila
  const tranzilaFormRef = useRef<HTMLFormElement>(null)

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

  // תאריך התחלת חיוב מחזורי (מידע לתצוגה; את החיוב נעשה בהמשך במסוף הרגיל אחרי 7 ימים)
  const recurStartDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10)
  }, [])

  const currentPlanName = useMemo(() => {
    return urlParams.planName || (urlParams.plan === 'ultimate' ? 'Ultimate Plan' : 'Executive Plan')
  }, [urlParams.plan, urlParams.planName])

  // כתובות חזרה
  const successUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yayagent.com'
    const qp = new URLSearchParams({
      plan: urlParams.plan,
      price: urlParams.price,
      billing: urlParams.billing,
      code: urlParams.code,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    })
    return `${origin}/payment/success?${qp.toString()}`
  }, [urlParams, firstName, lastName, email, phone])

  const failUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yayagent.com'
    return `${origin}/payment/fail`
  }, [])

  // שלח ל־Tranzila – יצירת טוקן בלבד (VK) + sum=0 + hidesum=1 + חובה לשלוח id כי מופעל במסוף
  const handleRedirectToTranzila = () => {
    if (!email.trim()) {
      alert('Please enter an email so we can send your receipt.')
      return
    }
    const form = tranzilaFormRef.current
    if (!form) return

    // נעדכן שדות דינמיים לפני שליחה
    setHiddenValue(form, 'contact', [firstName.trim(), lastName.trim()].filter(Boolean).join(' '))
    setHiddenValue(form, 'email', email.trim())
    setHiddenValue(form, 'phone', phone.trim())
    setHiddenValue(form, 'uid', urlParams.code) // מזהה לעקיבה (u* לא חובה, uid מועיל לך)

    form.submit()
  }

  function setHiddenValue(form: HTMLFormElement, name: string, value: string) {
    const input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`)
    if (input) input.value = value
  }

  return (
    <div style={{
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
      color: '#2d2a26'
    }}>
      {/* Header */}
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
            <img src="/yaya-logo.png" alt="Yaya Assistant" style={{ width: 56, height: 56, objectFit: 'contain' }} />
            <span style={{ fontSize: '1.35rem', fontWeight: 700, color: '#2d5016' }}>Yaya</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4a5568' }}>
            <Shield size={16} />
            {!isMobile && <span style={{ fontSize: '.9rem' }}>Secure checkout</span>}
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: isMobile ? '1.5rem 0' : '3rem 0' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: isMobile ? '0 1rem' : '0 2rem',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '360px 1fr',
          gap: '1.5rem', alignItems: 'start'
        }}>
          {/* Summary Card */}
          <section style={{
            background: 'white', borderRadius: 20, padding: '1.25rem',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
            position: 'sticky', top: 24,
          }}>
            <h2 style={{ margin: 0, color: '#2d5016', fontWeight: 800, fontSize: '1.05rem', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ display:'inline-flex', width:8, height:8, borderRadius:9999, background:'#22c55e' }} />
              Start Free Trial
            </h2>

            <div style={{ marginTop: 16, padding: 16, border: '1px solid #E5DDD5', borderRadius: 14, background: '#FBFAF8' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <h3 style={{ margin: 0, color: '#8B5E3C', fontWeight: 800, fontSize:'1rem' }}>{currentPlanName}</h3>
                <span style={{ fontSize:'.8rem', color:'#6b7280' }}>Monthly subscription</span>
              </div>

              <div style={{ marginTop: 10, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                <CheckCircle size={16} style={{ color: '#22c55e' }} />
                <span style={{
                  fontSize: '.8rem', padding: '6px 10px', borderRadius: 8,
                  background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.25)', color: '#166534'
                }}>
                  Registration Code: {urlParams.code}
                </span>
              </div>

              <div style={{ marginTop: 12, borderTop: '1px solid #E5DDD5', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Due today:</span><span>$0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>After trial:</span><span>${urlParams.price}.00 / month</span>
                </div>
                <div style={{ fontSize:'.8rem', color:'#8592a1', marginTop:4 }}>
                  First charge on <strong>{recurStartDate}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Details + Iframe */}
          <section>
            <h2 style={{ margin: 0, color: '#2d5016', fontWeight: 800, fontSize: '1.05rem' }}>Your details</h2>

            <div style={{
              marginTop: 12, background: 'white', borderRadius: 20, padding: '1rem',
              border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 20px rgba(0,0,0,0.04)'
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
                  fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 6px 14px rgba(139, 94, 60, 0.28)'
                }}
              >
                Continue to Secure Payment
              </button>

              <p style={{ marginTop: 8, color: '#6b7280', fontSize: '.85rem', textAlign: 'center' }}>
                Encrypted • We don’t store card details
              </p>
            </div>

            {/* ===== IFRAME + FORM (POST) ===== */}
            <div style={{ marginTop: 14, background: 'white', borderRadius: 20, padding: '0.75rem',
              border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 6px 14px rgba(0,0,0,0.04)' }}>
              <iframe
                name="tranzila"
                id="tranzila-frame"
                // allowpaymentrequest=true חשוב ל־Google Pay בעתיד; לא מזיק גם עכשיו
                allow="payment"
                style={{ width:'100%', height: 640, border: '0', borderRadius: 12 }}
                title="Secure payment"
              />
            </div>

            {/* טופס POST ל־Tranzila — יצירת טוקן בלבד */}
            <form
              ref={tranzilaFormRef}
              method="POST"
              target="tranzila"
              action="https://direct.tranzila.com/fxpyairsabagtok/iframenew.php"
              // אין צורך ב־autoComplete ולא בנראות — זה נסתר
            >
              {/* יצירת טוקן בלבד — Verify + Token */}
              <input type="hidden" name="tranmode" value="VK" />
              {/* 0$ כדי להראות “Due today: $0” בקופה — sum=0 + hidesum=1 */}
              <input type="hidden" name="sum" value="0" />
              <input type="hidden" name="hidesum" value="1" />

              {/* מטבע — במסוף הטוקנים מוגדר ש"ח (1). לטוקן זה לא מהותי, פשוט נשמור עקביות */}
              <input type="hidden" name="currency" value="1" />
              {/* סוג כרטיס — ישראכרט=1, ויזה=2 וכו'. לא חובה לטוקן, אפשר להשאיר 1 */}
              <input type="hidden" name="cred_type" value="1" />

              {/* מסוף דורש ת"ז חובה — אחרת נקבל System Error */}
              <input type="hidden" name="id" value="000000000" />

              {/* פרטים לנוחות במסוף */}
              <input type="hidden" name="contact" value="" />
              <input type="hidden" name="email"   value="" />
              <input type="hidden" name="phone"   value="" />

              {/* מזהה לעקיבה / u*  */}
              <input type="hidden" name="uid" value="" />
              <input type="hidden" name="u1"  value="trial_token" />

              {/* כתובות חזרה */}
              <input type="hidden" name="success_url_address" value={successUrl} />
              <input type="hidden" name="fail_url_address"    value={failUrl} />

              {/* אם תרצה טריגר לשרת שלך על סיום (מומלץ) — יש לך כבר במסך ההגדרות Notify קבוע.
                  אם אתה רוצה לשלוח כאן ספציפי, אפשר לפתוח:
                  <input type="hidden" name="notify_url_address" value="https://yairsabag.app.n8n.cloud/webhook/tranzila" />
              */}

              {/* UI של הכפתור בתוך העמוד של טרנזילה */}
              <input type="hidden" name="buttonLabel" value="Start Free Trial" />
              {/* עיצוב נעים (לא חובה) */}
              <input type="hidden" name="trBgColor" value="FAF5F0" />
              <input type="hidden" name="trTextColor" value="2D5016" />
              <input type="hidden" name="trButtonColor" value="8B5E3C" />
              <input type="hidden" name="trButtonTextColor" value="FFFFFF" />
              <input type="hidden" name="trTextSize" value="16" />
              {/* אם תרצה לשלב Google Pay בהמשך:
                 <input type="hidden" name="google_pay" value="1" />
              */}
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}

const label: React.CSSProperties = { display: 'block', fontSize: '.85rem', color: '#6b7280', marginBottom: 6 }
const input:  React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E5DDD5', outline: 'none', fontSize: '.95rem' }
