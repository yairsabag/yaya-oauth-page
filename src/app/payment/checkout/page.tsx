// src/app/payment/checkout/page.tsx
'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Shield, CheckCircle, CreditCard } from 'lucide-react'

type PlanKey = 'executive' | 'ultimate'
const PLANS: Record<PlanKey, { name: string; price: string }> = {
  executive: { name: 'Executive Plan', price: '5' },
  ultimate:  { name: 'Ultimate Plan',  price: '14' },
}

export default function CheckoutPage() {
  // ---- URL params (fallbacks) ----
  const [plan, setPlan]         = useState<PlanKey>('executive')
  const [planName, setPlanName] = useState(PLANS.executive.name)
  const [price, setPrice]       = useState(PLANS.executive.price)
  const [billing, setBilling]   = useState('monthly')
  const [code, setCode]         = useState('F75CEJ')

  // ---- Customer fields ----
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')

  const formRef   = useRef<HTMLFormElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const qPlan = (p.get('plan') || 'executive').toLowerCase() as PlanKey
    const qPrice = p.get('price') || (qPlan === 'ultimate' ? '14' : '5')
    setPlan(qPlan)
    setPlanName(p.get('planName') || PLANS[qPlan].name)
    setPrice(qPrice)
    setBilling((p.get('billing') || 'monthly').toLowerCase())
    setCode(p.get('code') || 'F75CEJ')
  }, [])

  // 7 ימים לקראת החיוב – נשתמש בזה בשלב 2 (n8n), לא נשלח לטרנזילה עכשיו:
  const chargeDateISO = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10)
  }, [])

  const terminalName = 'fxpyairsabagtok' // <-- מסוף טוקנים
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.yoursite.com'

  const successUrl = `${origin}/payment/success?plan=${plan}&price=${price}&code=${encodeURIComponent(code)}&billing=${billing}&email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&charge_start=${chargeDateISO}`
  const failUrl    = `${origin}/payment/fail`
  const notifyUrl  = `https://n8n-TD2y.sliplane.app/webhook/update-user-plan` +
    `?uid=${encodeURIComponent(code)}` +
    `&plan=${encodeURIComponent(plan)}` +
    `&billing=${encodeURIComponent(billing)}` +
    `&price=${encodeURIComponent(price)}` +
    `&email=${encodeURIComponent(email)}` +
    `&firstName=${encodeURIComponent(firstName)}` +
    `&lastName=${encodeURIComponent(lastName)}` +
    `&charge_start=${encodeURIComponent(chargeDateISO)}`

  const onPay = () => {
    if (!email.trim()) {
      alert('Please enter your email so we can send the receipt.')
      return
    }
    formRef.current?.submit()
    // גלילה ל־iframe
    setTimeout(() => iframeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  // ---- UI ----
  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(180deg,#faf5f0,#fff)'}}>
      <header style={{position:'sticky',top:0,background:'rgba(255,255,255,.9)',backdropFilter:'saturate(120%) blur(6px)',borderBottom:'1px solid #eee'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <img src="/yaya-logo.png" alt="Yaya" style={{width:40,height:40}} />
            <strong style={{fontSize:18,color:'#2d5016'}}>Yaya</strong>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,color:'#677'}}>
            <Shield size={16}/><span>Secure checkout</span>
          </div>
        </div>
      </header>

      <main style={{maxWidth:1100,margin:'24px auto',padding:'0 16px',display:'grid',gap:16,gridTemplateColumns:'360px 1fr'}}>
        {/* Summary */}
        <section style={{background:'#fff',border:'1px solid #eee',borderRadius:16,padding:16,boxShadow:'0 6px 18px rgba(0,0,0,.04)',height:'fit-content',position:'sticky',top:20}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <CreditCard size={18}/><h2 style={{margin:0,fontSize:18,color:'#2d5016'}}>Start Free Trial</h2>
          </div>
          <div style={{padding:12,border:'1px solid #E7E1DA',borderRadius:12,background:'#FBFAF8'}}>
            <div style={{fontWeight:700,color:'#8B5E3C'}}>{planName}</div>
            <div style={{color:'#7a6a5f',fontSize:13,marginTop:4}}>Monthly subscription</div>

            <div style={{marginTop:12,display:'flex',alignItems:'center',gap:6}}>
              <CheckCircle size={16} style={{color:'#22c55e'}}/>
              <span style={{fontSize:12, padding:'4px 8px', border:'1px solid rgba(34,197,94,.25)', background:'rgba(34,197,94,.08)', borderRadius:8, color:'#166534'}}>
                Registration Code: {code}
              </span>
            </div>

            <div style={{marginTop:12,borderTop:'1px dashed #E7E1DA',paddingTop:12,fontSize:14}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span>Due today</span><strong>$0.00</strong></div>
              <div style={{display:'flex',justifyContent:'space-between'}}><span>After trial</span><strong>${price}.00 / month</strong></div>
              <div style={{marginTop:6,color:'#697',fontSize:12}}>First charge on {chargeDateISO}</div>
            </div>
          </div>
        </section>

        {/* Form + Iframe */}
        <section>
          <div style={{background:'#fff',border:'1px solid #eee',borderRadius:16,padding:16,boxShadow:'0 6px 18px rgba(0,0,0,.04)'}}>
            <h3 style={{margin:'4px 0 12px',color:'#2d5016'}}>Your details</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <input placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} style={inputStyle}/>
              <input placeholder="Last name"  value={lastName}  onChange={e=>setLastName(e.target.value)} style={inputStyle}/>
              <input placeholder="Email"      value={email}     onChange={e=>setEmail(e.target.value)} style={inputStyle} type="email"/>
              <input placeholder="Phone"      value={phone}     onChange={e=>setPhone(e.target.value)} style={inputStyle}/>
            </div>
            <button onClick={onPay} style={payBtnStyle}>Continue to Secure Payment</button>
            <p style={{margin:'8px 0 0',fontSize:12,color:'#6b7280',textAlign:'center'}}>Encrypted • We don’t store card details</p>
          </div>

          {/* טופס ה־POST אל Tranzila – יצירת טוקן בלבד */}
          <form
            ref={formRef}
            method="POST"
            target="tranzila"
            action={`https://direct.tranzila.com/${terminalName}/iframenew.php`}
            style={{display:'none'}}
          >
            {/* יצירת טוקן בלבד (אין recurring כאן) */}
            <input type="hidden" name="tranmode" value="VK" />
            <input type="hidden" name="sum" value="0" />
            <input type="hidden" name="hidesum" value="1" />
            {/* עדיף ש״ח במסוף טוקנים כדי להימנע משגיאות מט״ח */}
            <input type="hidden" name="currency" value="1" />
            <input type="hidden" name="cred_type" value="1" />

            {/* פרטי תצוגה/זהות */}
            <input type="hidden" name="contact" value={`${firstName} ${lastName}`.trim()} />
            <input type="hidden" name="email"   value={email} />
            <input type="hidden" name="phone"   value={phone} />
            <input type="hidden" name="pdesc"   value={`Yaya ${plan} - Monthly Plan USD`} />

            {/* מזהי U* שיחזרו אליך */}
            <input type="hidden" name="uid" value={code} />
            <input type="hidden" name="u1"  value={code} />
            <input type="hidden" name="u2"  value={plan} />
            <input type="hidden" name="u3"  value={billing} />
            <input type="hidden" name="u4"  value={price} />

            {/* חזרה / נוטיפיקציה */}
            <input type="hidden" name="success_url_address" value={successUrl} />
            <input type="hidden" name="fail_url_address"    value={failUrl} />
            <input type="hidden" name="notify_url_address"  value={notifyUrl} />

            {/* UI / שפה */}
            <input type="hidden" name="buttonLabel"       value="Start Free Trial" />
            <input type="hidden" name="trBgColor"         value="FAF5F0" />
            <input type="hidden" name="trTextColor"       value="2D5016" />
            <input type="hidden" name="trButtonColor"     value="8B5E3C" />
            <input type="hidden" name="trButtonTextColor" value="FFFFFF" />
            <input type="hidden" name="lang"              value="il" />

            {/* הצג שגיאות תקינות במקום System Error */}
            <input type="hidden" name="err_code" value="1" />

            {/* אופציונלי: Google Pay (ב־iframe צריך allow="payment") */}
            <input type="hidden" name="google_pay" value="1" />
          </form>

          <div style={{marginTop:16,border:'1px solid #eee',borderRadius:12,overflow:'hidden',background:'#fff'}}>
            <iframe
              ref={iframeRef}
              name="tranzila"
              title="Secure Payment"
              style={{width:'100%',height:720,border:'0'}}
              allow="payment"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding:'12px 14px', border:'1px solid #E5DDD5', borderRadius:10, fontSize:14, outline:'none'
}
const payBtnStyle: React.CSSProperties = {
  marginTop:14, width:'100%', padding:'14px 18px',
  background:'linear-gradient(135deg,#8B5E3C,#A0673F)',
  color:'#fff', border:'0', borderRadius:12, fontWeight:700, fontSize:16, cursor:'pointer',
  boxShadow:'0 6px 18px rgba(139,94,60,.25)'
}
