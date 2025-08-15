// FILE: src/app/payment/checkout/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Lock } from 'lucide-react'

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState({
    plan: '',
    price: '',
    billing: '',
    code: '',
    planName: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    const t = setTimeout(() => setIsLoading(false), 800)
    return () => { window.removeEventListener('resize', check); clearTimeout(t) }
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

  const planDetails = {
    executive: { name: 'Executive Plan', features: ['Google Calendar integration','Expense tracking','Contact management','Recurring reminders'] },
    ultimate: { name: 'Ultimate Plan', features: ['All Executive features','Food & calorie tracking','Advanced analytics','Priority support'] }
  }
  const currentPlan = planDetails[urlParams.plan as keyof typeof planDetails] || planDetails.executive

  const buildIframeUrl = () => {
    // נוסיף תאריכי טרייל ל-success
    const trialStart = new Date().toISOString()
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    // כל מה שה-Success צריך לקבל
    const successQS = new URLSearchParams({
      plan: urlParams.plan,
      price: urlParams.price,
      billing: urlParams.billing,
      code: urlParams.code,
      email: urlParams.email || '',
      trial_start: trialStart,
      trial_end: trialEnd
      // הטוקן יתווסף ע"י טרנזילה כ- TranzilaTK
    })

    // יצירת טוקן על המסוף הרגיל
    const baseUrl = 'https://direct.tranzila.com/fxpyairsabag/iframenew.php'

    const params = new URLSearchParams({
      sum: '1',             // ב-VK גובה האימות נקבע במסוף. 1 נשאר פה ליתר ביטחון.
      currency: '2',        // USD (אם המסוף לא מאופשר מט"ח – יחויב ILS)
      tranmode: 'VK',       // Verification + Token
      hidesum: '1',         // חוקי רק עם VK/K/NK
      nologo: '1',
      lang: 'il',

      // שדות משלך
      u1: urlParams.code,
      u2: urlParams.plan,
      u3: urlParams.billing,
      u4: urlParams.price,

      pdesc: `Yaya ${urlParams.plan} - 7 Day Trial Authorization`,

      // עיצוב
      trBgColor: 'FAF5F0',
      trTextColor: '2D5016',
      trButtonColor: '8B5E3C',
      buttonLabel: 'Start Free Trial',

      // כתובות חזרה
      success_url_address: `${window.location.origin}/payment/success?${successQS.toString()}`,
      fail_url_address: `${window.location.origin}/payment/checkout?plan=${urlParams.plan}&price=${urlParams.price}&billing=${urlParams.billing}&code=${urlParams.code}&error=true`,
      notify_url_address: 'https://n8n-TD2y.sliplane.app/webhook/update-user-plan'
    })

    return `${baseUrl}?${params.toString()}`
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)' }}>
      <header style={{ background:'rgba(255,255,255,0.95)', borderBottom:'1px solid rgba(0,0,0,0.05)', padding:'1rem 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:isMobile?'0 1rem':'0 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:'0.75rem', textDecoration:'none' }}>
            <img src="/yaya-logo.png" alt="Yaya" style={{ width:isMobile?60:80, height:isMobile?60:80, objectFit:'contain' }} />
            <span style={{ fontSize:isMobile?20:24, fontWeight:600, color:'#2d5016' }}>Yaya</span>
          </a>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', color:'#4a5568' }}>
            <Shield size={16} /><span style={{ fontSize:14 }}>Secure Checkout</span>
          </div>
        </div>
      </header>

      <main style={{ padding:isMobile?'1.5rem 0':'3rem 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:isMobile?'0 1rem':'0 2rem' }}>
          {/* צד שמאל – הסיכום (השארתי כמו אצלך) */}

          {/* תשלום */}
          <div style={{ background:'#fff', borderRadius:20, padding:0, overflow:'hidden', boxShadow:'0 4px 6px rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.05)', minHeight:isMobile?600:650 }}>
            {isLoading ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:600, flexDirection:'column', gap:16 }}>
                <div style={{ width:50, height:50, border:'4px solid #E5DDD5', borderTopColor:'#8B5E3C', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                <p style={{ color:'#8B5E3C', fontSize:15 }}>Loading secure payment form...</p>
              </div>
            ) : (
              <iframe
                src={buildIframeUrl()}
                style={{ width:'100%', height:isMobile?650:700, border:'none', display:'block' }}
                title="Secure Payment Form"
                allow="payment"
                sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
              />
            )}
          </div>

          <div style={{ marginTop:'1.5rem', textAlign:'center' }}>
            <p style={{ fontSize:14, color:'#718096' }}>Your payment information is encrypted and secure. We never store your credit card details.</p>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'1.5rem', flexWrap:'wrap' }}>
              <img src="https://www.tranzila.com/images/logo-tranzila.png" alt="Tranzila" style={{ height:30, opacity:0.7 }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" style={{ height:20, opacity:0.7 }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height:30, opacity:0.7 }} />
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export {}
