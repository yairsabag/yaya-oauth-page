// src/app/payment/checkout/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Shield } from 'lucide-react';

type UrlParams = {
  plan: 'executive' | 'ultimate';
  price: string;               // "5" | "14"
  billing: 'monthly' | 'yearly';
  code: string;                // registration code / uid
  planName: string;
};

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState<UrlParams>({
    plan: 'executive',
    price: '5',
    billing: 'monthly',
    code: 'F75CEJ',
    planName: 'Executive Plan',
  });

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [isMobile,  setIsMobile]  = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const plan = ((p.get('plan') || 'executive').toLowerCase() as UrlParams['plan']);
    const price = p.get('price') || (plan === 'ultimate' ? '14' : '5');
    const billing = ((p.get('billing') || 'monthly').toLowerCase() as UrlParams['billing']);

    setUrlParams({
      plan,
      price,
      billing,
      code: p.get('code') || 'F75CEJ',
      planName: p.get('planName') || (plan === 'ultimate' ? 'Ultimate Plan' : 'Executive Plan'),
    });

    const onResize = () => setIsMobile(window.innerWidth < 940);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // מוצג ללקוח בלבד – “החיוב הראשון בעוד 7 ימים”
  const trialEndDate = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }, []);

  // ====== URL למסוף (בדיקה + טוקן) בעיצוב עם לוגו ואייקוני אבטחה ======
  const tokenIframeUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.yayagent.com';

    // מה שיחזור ל-success רק לצורכי תצוגה
    const successQuery = new URLSearchParams({
      plan: urlParams.plan,
      planName: urlParams.planName,
      price: urlParams.price,
      billing: urlParams.billing,
      code: urlParams.code,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    }).toString();

    // NOTE: iframe.php (לא iframenew.php)
    const base = 'https://direct.tranzila.com/fxpyairsabagtok/iframe.php';

    const params = new URLSearchParams({
      // === הפעולה ===
      tranmode: 'NK',               // בדיקה (J2) – אצלך זה שומר טוקן ומצליח
      sum: '1',                    // חייב להיות 1
      currency: '2',               // USD
      cred_type: '1',              // ישראכרט (לא חובה אבל תקין)

      // === עיצוב (עם לוגו ואייקוני האבטחה) ===
      hidesum: '1'
      trBgColor: 'FAF5F0',         // רקע
      trTextColor: '2D5016',       // טקסט
      trButtonColor: '8B5E3C',     // כפתור
      trButtonTextColor: 'FFFFFF', // טקסט כפתור (נתמך ב־iframe.php)
      trTextSize: '16',            // גודל טקסט
      buttonLabel: 'Start Free Trial',
      // אל תשלח nologo=1 – כך הלוגו והאייקונים יוצגו כברירת מחדל

      // === נתוני לקוח להצגה ===
      contact: [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
      email: email.trim(),
      phone: phone.trim(),

      // === מזהי מעקב (יחזרו ב-notify) ===
      uid: urlParams.code,
      u1: urlParams.code,
      u2: urlParams.plan,
      u3: urlParams.billing,
      u4: urlParams.price,
      pdesc: `Yaya ${urlParams.plan} - Trial then ${urlParams.price}$/mo`,

      // === חזרה למשתמש (תצוגה) ===
      success_url_address: `${origin}/payment/success?${successQuery}`,
      fail_url_address: `${origin}/payment/fail`,

      // === Webhook אמיתי לשמירת הטוקן ===
      notify_url_address:
        'https://n8n-TD2y.sliplane.app/webhook/store-tranzila-token' +
        `?uid=${encodeURIComponent(urlParams.code)}` +
        `&plan=${encodeURIComponent(urlParams.plan)}` +
        `&billing=${encodeURIComponent(urlParams.billing)}` +
        `&price=${encodeURIComponent(urlParams.price)}` +
        `&email=${encodeURIComponent(email.trim())}` +
        `&firstName=${encodeURIComponent(firstName.trim())}` +
        `&lastName=${encodeURIComponent(lastName.trim())}`,
    });

    return `${base}?${params.toString()}`;
  }, [urlParams, firstName, lastName, email, phone]);

  const goToTokenIframe = () => {
    if (!email.trim()) {
      alert('Please enter your email so we can send your receipt.');
      return;
    }
    // נפתח את ה־iframe בעמוד ייעודי (מומלץ). כאן פשוט מפנים ישירות:
    window.location.href = tokenIframeUrl;
  };

  return (
    <div style={{minHeight:'100vh',background:'#FAF5F0',fontFamily:'system-ui, -apple-system, Segoe UI, sans-serif'}}>
      <header style={{background:'#fff',borderBottom:'1px solid #eee'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <a href="/" style={{display:'flex',gap:10,alignItems:'center',textDecoration:'none'}}>
            <img src="/yaya-logo.png" width={56} height={56} alt="Yaya" />
            <strong style={{color:'#2d5016',fontSize:20}}>Yaya</strong>
          </a>
          <span style={{display:'flex',gap:6,alignItems:'center',color:'#6b7280',fontSize:14}}>
            <Shield size={16}/> Secure checkout
          </span>
        </div>
      </header>

      <main style={{maxWidth:1200,margin:'0 auto',padding:'24px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'380px 1fr',gap:16,alignItems:'start'}}>
          {/* תקציר הזמנה */}
          <section style={{background:'#fff',border:'1px solid #eee',borderRadius:16,padding:16}}>
            <h2 style={{margin:0,color:'#2d5016'}}>Start Free Trial</h2>
            <div style={{marginTop:12}}>
              <div style={{fontWeight:700,color:'#8B5E3C'}}>{urlParams.planName}</div>
              <p style={{margin:'6px 0 0',color:'#7a6a5f',fontSize:13}}>Monthly subscription</p>

              <div style={{marginTop:10,display:'grid',rowGap:6,borderTop:'1px solid #eee',paddingTop:10}}>
                <Row left="Due today" right="$0.00" />
                <Row left="After trial" right={`$${urlParams.price}.00 / month`} />
                <Row left="First charge on" right={trialEndDate} muted />
                <div style={{
                  marginTop:6, fontSize:12, color:'#166534',
                  background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.25)',
                  borderRadius:8, padding:'6px 10px', width:'fit-content'
                }}>
                  Registration code: <b>{urlParams.code}</b>
                </div>
              </div>
            </div>
          </section>

          {/* פרטי לקוח וכפתור תשלום */}
          <section style={{background:'#fff',border:'1px solid #eee',borderRadius:16,padding:16}}>
            <h2 style={{margin:0,color:'#2d5016'}}>Your details</h2>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12,marginTop:12}}>
              <Field label="First name"  value={firstName} onChange={setFirstName}/>
              <Field label="Last name"   value={lastName}  onChange={setLastName}/>
              <Field label="Email"       type="email" value={email} onChange={setEmail}/>
              <Field label="Phone"       value={phone} onChange={setPhone}/>
            </div>

            <button onClick={goToTokenIframe}
              style={{
                marginTop:12,width:'100%',padding:'14px 18px',
                background:'#8B5E3C',color:'#fff',border:'none',borderRadius:12,
                fontWeight:700,cursor:'pointer',boxShadow:'0 6px 16px rgba(139,94,60,.25)'
              }}>
              Continue to Secure Payment
            </button>

            <p style={{marginTop:10,fontSize:12,color:'#6b7280'}}>
              We won’t charge you today. We verify your card and create a secure token. The first charge happens after the 7-day trial.
            </p>
          </section>
        </div>

        {/* (אופציונלי) אם תרצה להטמיע כאן בעמוד במקום מעבר: */}
        {/* <div style={{marginTop:20, background:'#fff', border:'1px solid #eee', borderRadius:16, padding:8}}>
          <iframe
            name="tranzila"
            src={tokenIframeUrl}
            allow="payment"
            style={{width:'100%', height: 720, border: 0, borderRadius:12}}
          />
        </div> */}
      </main>
    </div>
  );
}

function Row({left,right,muted=false}:{left:string;right:string;muted?:boolean}) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',color: muted? '#6b7280' : '#111827'}}>
      <span>{left}</span><span>{right}</span>
    </div>
  );
}

function Field({
  label, value, onChange, type='text'
}: { label:string; value:string; onChange:(v:string)=>void; type?:string }) {
  return (
    <label style={{display:'grid',rowGap:6,fontSize:14,color:'#6b7280'}}>
      {label}
      <input
        type={type}
        value={value}
        onChange={e=>onChange(e.target.value)}
        style={{padding:'10px 12px',border:'1px solid #E5DDD5',borderRadius:10,fontSize:15}}
      />
    </label>
  );
}
