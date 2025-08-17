'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle, Shield } from 'lucide-react'

type UrlParams = {
  plan: string; price: string; billing: string; code: string; planName: string
}

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState<UrlParams>({
    plan: 'executive', price: '5', billing: 'monthly', code: 'F75CEJ', planName: 'Executive Plan'
  })

  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')

  const [isMobile, setIsMobile]   = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    const t = setTimeout(() => setIsLoading(false), 300)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t) }
  }, [])

  const planDetails = {
    executive: { name: 'Executive Plan', features: ['Google Calendar integration','Expense tracking','Contact management','Recurring reminders'] },
    ultimate:  { name: 'Ultimate Plan',  features: ['All Executive features','Food & calorie tracking','Advanced analytics','Priority support'] },
  } as const

  const currentPlan =
    planDetails[(urlParams.plan as keyof typeof planDetails) || 'executive'] || planDetails.executive

  // תאריך התחלת החיוב החודשי (בעוד 7 ימים)
  const recurStartDate = useMemo(() => new Date(Date.now() + 7*24*60*60*1000).toISOString().slice(0,10), [])

  const TRZ_BASE = 'https://direct.tranzila.com/fxpyairsabag/iframenew.php'

  // *** Trial $0 עכשיו + recurring אחרי 7 ימים ***
  const iframeSrc = useMemo(() => {
    const successUrl = new URL('https://www.yayagent.com/payment/success')
    successUrl.searchParams.set('plan', urlParams.plan)
    successUrl.searchParams.set('price', urlParams.price)
    successUrl.searchParams.set('code', urlParams.code)
    successUrl.searchParams.set('billing', urlParams.billing)
    if (email)     successUrl.searchParams.set('email', email)
    if (firstName) successUrl.searchParams.set('firstName', firstName)
    if (lastName)  successUrl.searchParams.set('lastName', lastName)

    const params = new URLSearchParams({
      // אין חיוב עכשיו – ניסיון חינם
      sum: '0',
      currency: '2',               // USD
      tranmode: 'VK',              // Verification (J5) – טוקן + ללא חיוב
      // recurring
      recur_sum: urlParams.price,
      recur_transaction: '4_approved',
      recur_start_date: recurStartDate,
      // פרטי הלקוח
      contact: [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
      email: email.trim(),
      phone: phone.trim(),
      // עיצוב
      nologo: '1', trBgColor:'FAF5F0', trTextColor:'2D5016', trButtonColor:'8B5E3C',
      buttonLabel: 'Start Free Trial',
      // מזהים
      uid: urlParams.code, u1: urlParams.code, u2: urlParams.plan, u3: urlParams.billing, u4: urlParams.price,
      pdesc: `Yaya ${urlParams.plan} - 7 Day Free Trial (USD)`,
      // החזרות
      success_url_address: successUrl.toString(),
      fail_url_address: 'https://www.yayagent.com/payment/fail',
      notify_url_address: 'https://n8n-td2y.sliplane.app/webhook/update-user-plan'
    })

    return `${TRZ_BASE}?${params.toString()}`
  }, [urlParams.plan, urlParams.price, urlParams.billing, urlParams.code, firstName, lastName, email, phone, recurStartDate])

  return (
    <div style={{ fontFamily:"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight:'100vh', background:'linear-gradient(135deg,#faf5f0 0%,#f7f3ed 100%)' }}>
      {/* Header (כמו אצלך) */}

      <main style={{ padding: isMobile ? '1.5rem 0' : '3rem 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:isMobile?'0 1rem':'0 2rem',
          display:'grid', gridTemplateColumns:isMobile?'1fr':'380px 1fr', gap:'1.5rem' }}>
          
          {/* Order Summary – מציג $0 היום */}
          <section style={{ background:'#fff', borderRadius:20, padding:'1.25rem',
            border:'1px solid rgba(0,0,0,.06)', boxShadow:'0 4px 6px rgba(0,0,0,.04)', position:'sticky', top:24 }}>
            <h2 style={{ margin:0, color:'#2d5016', fontWeight:700, fontSize:'1.1rem' }}>Order Summary</h2>

            <div style={{ marginTop:16, padding:16, border:'1px solid #E5DDD5',
              borderRadius:12, background:'#FBFAF8' }}>
              <h3 style={{ margin:0, color:'#8B5E3C', fontWeight:700 }}>{currentPlan.name}</h3>
              <p style={{ margin:'6px 0 0', color:'#7a6a5f', fontSize:'.9rem' }}>Monthly subscription</p>

              <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:8 }}>
                <CheckCircle size={16} style={{ color:'#22c55e' }} />
                <span style={{ fontSize:'.85rem', padding:'6px 10px', borderRadius:8,
                  background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.25)', color:'#166534' }}>
                  Registration Code: {urlParams.code}
                </span>
              </div>

              <ul style={{ margin:'14px 0 0 16px', padding:0, color:'#6b7280', fontSize:'.9rem' }}>
                {currentPlan.features.map((f, i) => <li key={i} style={{ marginBottom:6 }}>{f}</li>)}
              </ul>

              <div style={{ marginTop:12, borderTop:'1px solid #E5DDD5', paddingTop:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span>7-day free trial</span><span style={{ color:'#16a34a' }}>$0.00</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span>Then monthly (from {new Date(recurStartDate).toLocaleDateString()})</span>
                  <span>${urlParams.price}/month</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, paddingTop:10,
                  borderTop:'1px dashed #E5DDD5', fontWeight:700 }}>
                  <span>Total today</span><span style={{ color:'#16a34a' }}>$0.00</span>
                </div>
              </div>

              <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:6, color:'#7a6a5f' }}>
                <Shield size={14} /><span style={{ fontSize:'.85rem' }}>SSL Secured • PCI Compliant</span>
              </div>
            </div>
          </section>

          {/* Form + Iframe (מופיע מיידית) */}
          <section>
            <h2 style={{ margin:0, color:'#2d5016', fontWeight:700, fontSize:'1.1rem' }}>Complete Your Order</h2>

            <div style={{ marginTop:12, background:'#fff', borderRadius:20, padding:'1rem',
              border:'1px solid rgba(0,0,0,.06)', boxShadow:'0 4px 6px rgba(0,0,0,.04)' }}>
              <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:12 }}>
                <LabeledInput label="First name" value={firstName} onChange={setFirstName} placeholder="John" />
                <LabeledInput label="Last name"  value={lastName}  onChange={setLastName}  placeholder="Doe" />
                <LabeledInput label="Email"      value={email}     onChange={setEmail}     placeholder="john@example.com" type="email" />
                <LabeledInput label="Phone"      value={phone}     onChange={setPhone}     placeholder="+1 555 123 4567" />
              </div>
              <p style={{ marginTop:8, color:'#7a6a5f', fontSize:'.9rem' }}>The secure payment form is loaded below.</p>
            </div>

            <div style={{ marginTop:12, background:'#fff', borderRadius:20, overflow:'hidden',
              border:'1px solid rgba(0,0,0,.06)', boxShadow:'0 4px 6px rgba(0,0,0,.04)', minHeight:650 }}>
              {isLoading ? (
                <div style={{ minHeight:650, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
                  <div style={{ width:50, height:50, border:'4px solid #E5DDD5', borderTopColor:'#8B5E3C',
                    borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                  <p style={{ color:'#8B5E3C', fontSize:'.95rem', marginTop:8 }}>Loading secure payment form...</p>
                </div>
              ) : (
                <iframe
                  key={iframeSrc}
                  src={iframeSrc}
                  title="Secure Payment Form"
                  allow="payment"
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                  style={{ width:'100%', height:700, border:'none', display:'block' }}
                />
              )}
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function LabeledInput({
  label, value, onChange, placeholder, type='text'
}: { label:string; value:string; onChange:(v:string)=>void; placeholder?:string; type?:string }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:'.85rem', color:'#6b7280', marginBottom:6 }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #E5DDD5',
          outline:'none', fontSize:'.95rem' }}
      />
    </div>
  )
}
