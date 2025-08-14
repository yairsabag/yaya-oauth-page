'use client'

import React, { useEffect, useMemo, useState } from 'react'

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState({ plan:'', price:'', billing:'', code:'', planName:'' })
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
      planName: p.get('planName') || 'Executive Plan'
    })
  }, [])

  const tranzilaAction = 'https://direct.tranzila.com/fxpyairsabag/iframenew.php'

  const dcDisable = useMemo(() => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
    return `yaya-${Date.now()}-${Math.random().toString(36).slice(2)}`
  }, [])

  const successUrl = useMemo(() => {
    const o = window.location.origin
    const q = new URLSearchParams({ plan:urlParams.plan, price:urlParams.price, billing:urlParams.billing, code:urlParams.code, trial:'true' })
    return `${o}/payment/success?${q.toString()}`
  }, [urlParams])

  const failUrl = useMemo(() => {
    const o = window.location.origin
    const q = new URLSearchParams({ plan:urlParams.plan, price:urlParams.price, billing:urlParams.billing, code:urlParams.code, error:'true' })
    return `${o}/payment/checkout?${q.toString()}`
  }, [urlParams])

  useEffect(() => {
    if (isLoading) return
    const form = document.getElementById('tranzila-form') as HTMLFormElement | null
    const send = () => form?.submit()
    send()
    const t = setTimeout(send, 100)
    return () => clearTimeout(t)
  }, [isLoading])

  const card = { bg:'#fff', br:20, shadow:'0 4px 6px rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.05)' }

  return (
    <div style={{ fontFamily:"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight:'100vh', background:'linear-gradient(135deg,#faf5f0 0%,#f7f3ed 100%)' }}>
      <header style={{ background:'rgba(255,255,255,0.95)', borderBottom:'1px solid rgba(0,0,0,0.05)', padding:'1rem 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:isMobile?'0 1rem':'0 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
            <img src="/yaya-logo.png" alt="Yaya" style={{ width:isMobile?60:80, height:isMobile?60:80, objectFit:'contain' }} />
            <span style={{ fontSize:isMobile?20:24, fontWeight:600, color:'#2d5016' }}>Yaya</span>
          </a>
          <div style={{ color:'#4a5568', fontSize:14 }}>Secure Checkout</div>
        </div>
      </header>

      <main style={{ padding:isMobile?'1.5rem 0':'3rem 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:isMobile?'0 1rem':'0 2rem' }}>
          <div style={{ display:isMobile?'flex':'grid', flexDirection:isMobile?'column' as const:undefined, gridTemplateColumns:isMobile?undefined:'1fr 2fr', gap:isMobile?'2rem':'3rem' }}>
            <div style={{ order:1 }}>
              <h2 style={{ fontSize:isMobile?21:24, fontWeight:600, marginBottom:'1.5rem', color:'#8B5E3C' }}>Order Summary</h2>
              <div style={{ background:card.bg, borderRadius:card.br, padding:isMobile?'1.5rem':'2rem', boxShadow:card.shadow, border:card.border }}>
                <div style={{ marginBottom:'1.5rem' }}>
                  <h3 style={{ fontSize:isMobile?18:19, fontWeight:600, color:'#8B5E3C', marginBottom:8 }}>{urlParams.planName || 'Executive Plan'}</h3>
                  <p style={{ color:'#8B5E3C', fontSize:isMobile?14:15, opacity:0.8 }}>
                    {urlParams.billing === 'yearly' ? 'Annual' : 'Monthly'} subscription
                  </p>
                </div>
                {urlParams.code && (
                  <div style={{ background:'rgba(37,211,102,0.1)', borderRadius:12, padding:isMobile?12:16, border:'1px solid rgba(37,211,102,0.3)', marginBottom:'1.5rem' }}>
                    <p style={{ color:'#25d366', fontSize:isMobile?14:15, fontWeight:600, margin:0 }}>✅ Registration Code: {urlParams.code}</p>
                  </div>
                )}
                <div style={{ marginBottom:'1.5rem' }}>
                  <h4 style={{ fontSize:14, color:'#8B5E3C', fontWeight:600, marginBottom:12, opacity:0.8 }}>Included Features:</h4>
                  <ul style={{ margin:0, paddingLeft:20 }}>
                    {['Google Calendar integration','Expense tracking','Contact management','Recurring reminders'].map((f,i)=>(
                      <li key={i} style={{ fontSize:14, color:'#8B5E3C', marginBottom:8, opacity:0.9 }}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ borderTop:'1px solid #E5DDD5', paddingTop:16, marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, color:'#8B5E3C' }}>
                    <span>7-day free trial</span><span style={{ color:'#25d366', fontWeight:600 }}>$0.00</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, color:'#8B5E3C' }}>
                    <span>Then {urlParams.billing === 'yearly' ? 'annually' : 'monthly'}</span><span>${urlParams.price}/{urlParams.billing === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                </div>
                <div style={{ borderTop:'1px solid #E5DDD5', paddingTop:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontWeight:600, color:'#8B5E3C' }}>
                    <span>Total today</span><span style={{ color:'#25d366' }}>$0.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ order:2 }}>
              <h2 style={{ fontSize:isMobile?21:24, fontWeight:600, marginBottom:'1.5rem', color:'#8B5E3C' }}>Complete Your Order</h2>
              <div style={{ background:'#fff', borderRadius:20, padding:0, overflow:'hidden', boxShadow:card.shadow, border:card.border, minHeight:isMobile?600:650 }}>
                {isLoading ? (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:600, flexDirection:'column', gap:16 }}>
                    <div style={{ width:50, height:50, border:'4px solid #E5DDD5', borderTopColor:'#8B5E3C', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                    <p style={{ color:'#8B5E3C', fontSize:15 }}>Loading secure payment form...</p>
                  </div>
                ) : (
                  <>
                    <form id="tranzila-form" method="POST" action={tranzilaAction} target="tranzila" style={{ display:'none' }}>
                      <input name="sum" defaultValue="1" />
                      <input name="currency" defaultValue="2" />
                      <input name="tranmode" defaultValue="VK" />
                      <input name="hidesum" defaultValue="1" />
                      <input name="nologo" defaultValue="1" />
                      <input name="lang" defaultValue="il" />
                      <input name="trBgColor" defaultValue="FAF5F0" />
                      <input name="trTextColor" defaultValue="2D5016" />
                      <input name="trButtonColor" defaultValue="8B5E3C" />
                      <input name="buttonLabel" defaultValue="Start Free Trial" />
                      <input name="u1" defaultValue={urlParams.code} />
                      <input name="u2" defaultValue={urlParams.plan} />
                      <input name="u3" defaultValue={urlParams.billing} />
                      <input name="u4" defaultValue={urlParams.price} />
                      {/* אם Field 20 ל-DCdisable עדיין לא מוגדר – הסר את שתי השורות הבאות */}
                      <input name="u71" defaultValue="1" />
                      <input name="DCdisable" defaultValue={dcDisable} />
                      <input name="pdesc" defaultValue={`Yaya ${urlParams.plan} - 7 Day Trial Authorization`} />
                      <input name="success_url_address" defaultValue={successUrl} />
                      <input name="fail_url_address" defaultValue={failUrl} />
                      <input name="notify_url_address" defaultValue="https://n8n-TD2y.sliplane.app/webhook/update-user-plan" />
                    </form>

                    <iframe
                      name="tranzila"
                      title="Secure Payment Form"
                      src="about:blank"
                      style={{ width:'100%', height:isMobile?650:700, border:'none', display:'block' }}
                      allow="payment"
                      sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* אנימציה ל-spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export {}
