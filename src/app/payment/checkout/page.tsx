'use client'

import React, { useMemo, useRef, useState } from 'react'
import { CheckCircle, Shield } from 'lucide-react'

type UrlParams = {
  plan: 'executive' | 'ultimate'
  price: '5' | '14'
  billing: 'monthly'
  code: string
  planName: string
}

export default function CheckoutPage() {
  // -------- URL params (with safe defaults) --------
  const [urlParams] = useState<UrlParams>(() => {
    const p = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const plan = (p.get('plan') || 'executive').toLowerCase() as UrlParams['plan']
    const price = (p.get('price') || (plan === 'ultimate' ? '14' : '5')) as UrlParams['price']
    return {
      plan,
      price,
      billing: 'monthly',
      code: (p.get('code') || 'F75CEJ').toUpperCase(),
      planName: p.get('planName') || (plan === 'ultimate' ? 'Ultimate Plan' : 'Executive Plan'),
    }
  })

  // -------- customer fields (for your records only) --------
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')

  // -------- trial start (today + 7) --------
  const recurStartDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    // Tranzila expects yyyy-mm-dd
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }, [])

  // -------- success/fail/notify URLs --------
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.yayagent.com'

  // NOTE: עדיף שה־Return Method במסוף יהיה GET
  const successUrl = `${origin}/payment/success?plan=${encodeURIComponent(urlParams.plan)}&price=${urlParams.price}&billing=${urlParams.billing}&code=${encodeURIComponent(urlParams.code)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}`
  const failUrl    = `${origin}/payment/fail?plan=${encodeURIComponent(urlParams.plan)}&price=${urlParams.price}&billing=${urlParams.billing}&code=${encodeURIComponent(urlParams.code)}`
  const notifyUrl  = `https://yairsabag.app.n8n.cloud/webhook/tranzila`

  // -------- form ref (we post into the IFRAME) --------
  const formRef = useRef<HTMLFormElement>(null)

  const handleStartTrial = () => {
    if (!email.trim()) {
      alert('Please enter your email so we can send your receipt.')
      return
    }
    // submit the hidden POST to Tranzila
    formRef.current?.submit()
    // optional: scroll to iframe area after submit
    document.getElementById('tranzila-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ====== UI STYLES ======
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 940 : false
  const brand = {
    green: '#2d5016',
    tan:   '#faf5f0',
    brown: '#8B5E3C',
    ink:   '#6b7280'
  }

  return (
    <div style={{
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${brand.tan} 0%, #f7f3ed 100%)`
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255,255,255,.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,.05)'
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <img alt="Yaya" src="/yaya-logo.png" style={{ width: 56, height: 56, objectFit: 'contain' }}/>
            <span style={{ color: brand.green, fontSize: 20, fontWeight: 700 }}>Yaya</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: brand.ink }}>
            <Shield size={16} />
            {!isMobile && <span style={{ fontSize: 14 }}>Secure checkout</span>}
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px' : '32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '360px 1fr',
          gap: 20,
          alignItems: 'start'
        }}>
          {/* Summary card */}
          <section style={{
            background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,.06)',
            boxShadow: '0 4px 14px rgba(0,0,0,.04)', padding: 16, position: 'sticky', top: 24
          }}>
            <h2 style={{ margin: 0, color: brand.green, fontWeight: 800, fontSize: 18 }}>Start Free Trial</h2>
            <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: '#FBFAF8', border: '1px solid #E5DDD5' }}>
              <div style={{ fontWeight: 700, color: brand.brown }}>{urlParams.planName}</div>
              <div style={{ marginTop: 6, color: '#7a6a5f', fontSize: 14 }}>Monthly subscription</div>

              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} color="#22c55e" />
                <span style={{
                  fontSize: 12, padding: '4px 8px', borderRadius: 8,
                  background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', color: '#166534'
                }}>
                  Registration Code: {urlParams.code}
                </span>
              </div>

              <div style={{ marginTop: 12, borderTop: '1px solid #E5DDD5', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Due today</span><strong>$0.00</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>After trial</span><strong>${urlParams.price}.00 / month</strong>
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: '#94a3b8' }}>
                  First charge on <strong>{recurStartDate}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Form + Iframe */}
          <section>
            <h2 style={{ margin: 0, color: brand.green, fontWeight: 800, fontSize: 18 }}>Your details</h2>

            <div style={{
              marginTop: 12, background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,.06)',
              boxShadow: '0 4px 14px rgba(0,0,0,.04)', padding: 12
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 10
              }}>
                <Input label="First name" value={firstName} onChange={setFirstName}/>
                <Input label="Last name"  value={lastName}  onChange={setLastName}/>
                <Input label="Email"      value={email}     onChange={setEmail} type="email"/>
                <Input label="Phone"      value={phone}     onChange={setPhone}/>
              </div>

              <button
                onClick={handleStartTrial}
                style={{
                  marginTop: 12, width: '100%', padding: '14px 20px',
                  background: `linear-gradient(135deg, ${brand.brown} 0%, #A0673F 100%)`,
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontSize: 16, fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(139,94,60,.3)'
                }}
              >
                Continue to Secure Payment
              </button>

              <p style={{ marginTop: 8, fontSize: 12, color: brand.ink, textAlign: 'center' }}>
                Encrypted • We don’t store card details. You may see a temporary $1 authorization — it isn’t a charge.
              </p>
            </div>

            {/* Tranzila Form (hidden inputs) that POSTS into the iframe */}
            <form
              ref={formRef}
              action="https://direct.tranzila.com/fxpyairsabagtok/iframenew.php"
              method="POST"
              target="tranzila_iframe"
              style={{ display: 'none' }}
            >
              {/* ---- amount & currency ---- */}
              <input name="sum" defaultValue="0" />
              <input name="currency" defaultValue="2" /> {/* 2 = USD */}
              <input name="hidesum" defaultValue="1" />   {/* hide $0 from Tranzila UI */}

              {/* ---- create token + verify (J2). If VK causes issues on your terminal, NK is safest. ---- */}
              <input name="tranmode" defaultValue="NK" />

              {/* ---- recurring: start in 7 days, monthly, not customer choice ---- */}
              <input name="recur_sum" defaultValue={urlParams.price} />
              <input name="recur_transaction" defaultValue="4_approved" />
              <input name="recur_start_date" defaultValue={recurStartDate} />
              {/* omit recur_payments => unlimited (until canceled) */}

              {/* ---- customer reference fields (nice to have) ---- */}
              <input name="contact" defaultValue={[firstName, lastName].filter(Boolean).join(' ').trim()} />
              <input name="email" defaultValue={email.trim()} />
              <input name="phone" defaultValue={phone.trim()} />
              <input name="pdesc" defaultValue={`Yaya ${urlParams.plan} - Monthly Plan USD`} />

              {/* ---- identifiers you’ll get back on success/notify ---- */}
              <input name="uid" defaultValue={urlParams.code} />
              <input name="u1" defaultValue={urlParams.code} />
              <input name="u2" defaultValue={urlParams.plan} />
              <input name="u3" defaultValue={urlParams.billing} />
              <input name="u4" defaultValue={urlParams.price} />

              {/* ---- success/fail/notify ---- */}
              <input name="success_url_address" defaultValue={successUrl} />
              <input name="fail_url_address" defaultValue={failUrl} />
              <input name="notify_url_address" defaultValue={notifyUrl} />

              {/* ---- look & feel (optional) ---- */}
              <input name="trBgColor"         defaultValue="FAF5F0" />
              <input name="trTextColor"       defaultValue="2D5016" />
              <input name="trButtonColor"     defaultValue="8B5E3C" />
              <input name="trButtonTextColor" defaultValue="FFFFFF" />
              <input name="trTextSize"        defaultValue="16" />
              <input name="buttonLabel"       defaultValue="Start Free Trial" />
              <input name="google_pay"        defaultValue="1" />
            </form>

            {/* IFRAME target (loads the Tranzila page) */}
            <div id="tranzila-container" style={{ marginTop: 14, borderRadius: 12, overflow: 'hidden',
              border: '1px solid rgba(0,0,0,.08)', background: '#fff' }}>
              <iframe
                name="tranzila_iframe"
                id="tranzila_iframe"
                title="Secure payment"
                src=""
                allow="payment"
                allowPaymentRequest
                style={{ width: '100%', height: 720, border: '0' }}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

// small input helper
function Input(props: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, color: '#6b7280' }}>{props.label}</span>
      <input
        type={props.type || 'text'}
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 10,
          border: '1px solid #E5DDD5', outline: 'none', fontSize: 15
        }}
      />
    </label>
  )
}
