// FILE: src/app/payment/success/page.tsx
'use client'
import React, { useEffect, useState } from 'react'

type Params = {
  code: string
  plan: string
  billing: string
  price: string
  token: string
  trial_start: string
  trial_end: string
}

export default function PaymentSuccessPage() {
  const [p, setP] = useState<Params | null>(null)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)

    // לצאת מה-iframe למסך מלא
    if (window.top !== window.self) window.top.location.href = window.location.href

    const data: Params = {
      code: q.get('code') || q.get('u1') || '',
      plan: q.get('plan') || q.get('u2') || 'executive',
      billing: q.get('billing') || q.get('u3') || 'monthly',
      price: q.get('price') || q.get('u4') || '5',
      token: q.get('TranzilaTK') || q.get('TranzilaTK0') || '',
      trial_start: q.get('trial_start') || new Date().toISOString(),
      trial_end: q.get('trial_end') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
    setP(data)

    // שלח ל-n8n אם תרצה לעדכון משתמש
    fetch('https://n8n-TD2y.sliplane.app/webhook/update-user-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registration_code: data.code,
        plan: data.plan,
        billing_type: data.billing,
        price: data.price,
        payment_token: data.token,
        trial_start: data.trial_start,
        trial_end: data.trial_end,
        payment_date: new Date().toISOString(),
        status: 'trial_active',
      }),
    }).catch(() => {})
  }, [])

  if (!p) return <div style={{padding:24}}>Loading...</div>

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)', padding:'3rem 1rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', background:'#fff', borderRadius:20, padding:'2rem', border:'1px solid rgba(0,0,0,0.05)' }}>
        <h1 style={{ color:'#8B5E3C', marginTop:0 }}>🎉 Payment Successful</h1>
        <p>Registration Code: <b style={{fontFamily:'monospace'}}>{p.code}</b></p>
        <p>Plan: <b>{p.plan}</b> • Billing: <b>{p.billing}</b> • Price: <b>${p.price}</b></p>
        <p>Trial: <b>{new Date(p.trial_start).toLocaleDateString()}</b> → <b>{new Date(p.trial_end).toLocaleDateString()}</b></p>
        <p>Token: <b style={{fontFamily:'monospace'}}>{p.token || '(pending)'}</b></p>
        <hr />
        <a href="/" style={{color:'#8B5E3C', textDecoration:'underline'}}>Back to Home</a>
      </div>
    </div>
  )
}
