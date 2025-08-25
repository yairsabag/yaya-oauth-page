// src/app/payment/checkout/page.tsx
'use client'

import React, { useMemo, useRef, useState } from 'react'

type PlanKey = 'executive' | 'ultimate'

const PLANS: Record<PlanKey, { name: string; price: string }> = {
  executive: { name: 'Executive Plan', price: '5' },
  ultimate:  { name: 'Ultimate Plan',  price: '14' },
}

export default function CheckoutPage() {
  const [plan, setPlan] = useState<PlanKey>('executive')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [phone, setPhone]         = useState('')
  const [code, setCode]           = useState('F75CEJ')

  // תאריך התחלת החיוב בעוד 7 ימים (YYYY-MM-DD)
  const recurStartDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10)
  }, [])

  const formRef = useRef<HTMLFormElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const terminalName = 'fxpyairsabagtok' // <-- החלף לשם מסוף הטוקנים שלך
  const amountMonthly = PLANS[plan].price

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.yoursite.com'

  // URLs לחזרה/נוטיפיקציה
  const successUrl = `${origin}/payment/success?plan=${plan}&price=${amountMonthly}&code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`
  const failUrl    = `${origin}/payment/fail`
  const notifyUrl  = `https://n8n-TD2y.sliplane.app/webhook/update-user-plan` +
    `?uid=${encodeURIComponent(code)}` +
    `&plan=${encodeURIComponent(plan)}` +
    `&price=${encodeURIComponent(amountMonthly)}` +
    `&email=${encodeURIComponent(email)}` +
    `&firstName=${encodeURIComponent(firstName)}` +
    `&lastName=${encodeURIComponent(lastName)}`

  const onPay = () => {
    if (!email.trim()) {
      alert('Please enter an email so we can send your receipt.')
      return
    }
    formRef.current?.submit()
  }

  return (
    <div style={{ maxWidth: 980, margin: '40px auto', padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1>Start Free Trial</h1>

      {/* פרטי לקוח בסיסיים להצגה בממשק טרנזילה ולחיבור Notify */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '16px 0' }}>
        <input placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
        <input placeholder="Last name"  value={lastName}  onChange={e=>setLastName(e.target.value)} />
        <input placeholder="Email"      value={email}     onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Phone"      value={phone}     onChange={e=>setPhone(e.target.value)} />
        <select value={plan} onChange={e=>setPlan(e.target.value as PlanKey)}>
          <option value="executive">Executive – $5/mo</option>
          <option value="ultimate">Ultimate – $14/mo</option>
        </select>
        <input placeholder="Registration code" value={code} onChange={e=>setCode(e.target.value)} />
      </div>

      <button onClick={onPay} style={{ padding: '12px 18px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}>
        Continue to Secure Payment
      </button>

      {/* === טופס POST אל iframenew.php (העמוד החדש) === */}
      <form
        ref={formRef}
        method="POST"
        action={`https://direct.tranzila.com/${terminalName}/iframenew.php`}
        target="tranzila"
        style={{ display: 'none' }}
      >
        {/* --- Trial + Token --- */}
        <input type="hidden" name="tranmode" value="VK" />  {/* Verify + Token */}
        <input type="hidden" name="sum" value="0" />        {/* היום לא מחייבים */}
        <input type="hidden" name="hidesum" value="1" />    {/* מותר כשעובדים עם VK/K/NK */}

        {/* --- Recurring (Fixed, לא בחירת לקוח) --- */}
        <input type="hidden" name="recur_transaction" value="4_approved" />  {/* חודשי */}
        <input type="hidden" name="recur_sum" value={amountMonthly} />
        <input type="hidden" name="recur_start_date" value={recurStartDate} />
        {/* אם תרצה הגבלת כמות חיובים: */}
        {/* <input type="hidden" name="recur_payments" value="12" /> */}

        {/* --- מטבע/סוג כרטיס --- */}
        <input type="hidden" name="currency" value="2" />   {/* 2 = USD (בדוק במסוף שלך) */}
        <input type="hidden" name="cred_type" value="1" />  {/* סוג כרטיס: אשראי רגיל */}

        {/* --- פרטי משתמש להצגה בלבד --- */}
        <input type="hidden" name="contact" value={`${firstName} ${lastName}`.trim()} />
        <input type="hidden" name="email"   value={email} />
        <input type="hidden" name="phone"   value={phone} />
        <input type="hidden" name="pdesc"   value={`Yaya ${plan} - Monthly Plan USD`} />

        {/* --- מזהים משלך (חוזרים ב־success/notify) --- */}
        <input type="hidden" name="uid" value={code} />
        <input type="hidden" name="u1"  value={code} />
        <input type="hidden" name="u2"  value={plan} />
        <input type="hidden" name="u3"  value="monthly" />
        <input type="hidden" name="u4"  value={amountMonthly} />

        {/* --- חזרה/נוטיפיקציה --- */}
        <input type="hidden" name="success_url_address" value={successUrl} />
        <input type="hidden" name="fail_url_address"    value={failUrl} />
        <input type="hidden" name="notify_url_address"  value={notifyUrl} />

        {/* --- UI/שפה (אופציונלי) --- */}
        <input type="hidden" name="buttonLabel"       value="Start Free Trial" />
        <input type="hidden" name="trBgColor"         value="FAF5F0" />
        <input type="hidden" name="trTextColor"       value="2D5016" />
        <input type="hidden" name="trButtonColor"     value="8B5E3C" />
        <input type="hidden" name="trButtonTextColor" value="FFFFFF" />
        <input type="hidden" name="lang"              value="il" />

        {/* --- תן שגיאות מפורטות ולא System Error ריק --- */}
        <input type="hidden" name="err_code" value="1" />

        {/* --- Google Pay (אופציונלי, דורש allow="payment") --- */}
        <input type="hidden" name="google_pay" value="1" />
      </form>

      {/* ה־IFRAME של טרנזילה – העמוד המאובטח */}
      <div style={{ marginTop: 20, border: '1px solid #eaeaea', borderRadius: 8, overflow: 'hidden' }}>
        <iframe
          ref={iframeRef}
          name="tranzila"
          title="Secure Payment"
          style={{ width: '100%', height: 680, border: '0' }}
          // לפי הדוקו של Google Pay בתוך IFRAME:
          allow="payment"
        />
      </div>
    </div>
  )
}
