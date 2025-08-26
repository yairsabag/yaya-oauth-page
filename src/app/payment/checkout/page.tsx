// src/app/payment/checkout/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Shield } from 'lucide-react';

type UrlParams = {
  plan: 'executive' | 'ultimate';
  price: string;            // "5" | "14"
  billing: 'monthly' | 'yearly';
  code: string;             // registration code / uid
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

  // תאריך החיוב הראשון לתצוגה
  const trialEndDate = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }, []);

  // ===== URL למסוף טוקנים: בדיקה + טוקן (N) =====
  const tokenIframeUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.yayagent.com';

    // מה שנוח שיגיע ל-success בתור GET (תצוגה בלבד)
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

    // חשוב: iframe.php (ישן/יציב) – לא iframenew.php
    const base = 'https://direct.tranzila.com/fxpyairsabagtok/iframenew.php';

const params = new URLSearchParams({
  // יצירת טוקן דרך בדיקה (J2 + Token)
  tranmode: 'NK',
  sum: '1',            // חייב להישאר 1 – אך יוסתר
  currency: '2',
  cred_type: '1',

  // הסתרת המחיר + מיתוג
  hidesum: '1',
  trBgColor: 'FAF5F0',
  trTextColor: '2D5016',
  trButtonColor: '8B5E3C',
  trButtonTextColor: 'FFFFFF', // אם נתמך במסוף שלך
  buttonLabel: 'Start Free Trial',

  // פרטי לקוח
  contact: [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
  email: email.trim(),
  phone: phone.trim(),

  // מזהים
  uid: urlParams.code,
  u1: urlParams.code,
  u2: urlParams.plan,
  u3: urlParams.billing,
  u4: urlParams.price,
  pdesc: `Yaya ${urlParams.plan} - Trial then ${urlParams.price}$/mo`,

  // חזרה + webhook
  success_url_address: `${origin}/payment/success?${successQuery}`,
  fail_url_address: `${origin}/payment/fail`,
  notify_url_address:
    'https://yairsabag.app.n8n.cloud/webhook/tranzila' +
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
          <span style={{display:'flex',gap:6,alignItems:'center',color:'#6b7280',fontSize:14}}><Shield size={16}/> Secure checkout</span>
        </div>
      </header>

      <main style={{maxWidth:1200,margin:'0 auto',padding:'24px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'380px 1fr',gap:16}}>
          {/* Summary */}
          <section style={{background:'#fff',border:'1px solid #eee',borderRadius:16,padding:16}}>
            <h2 style={{margin:0,color:'#2d5016'}}>Start Free Trial</h2>
            <div style={{marginTop:12}}>
              <div style={{fontWeight:700,color:'#8B5E3C'}}>{urlParams.planName}</div>
              <div style={{marginTop:8,borderTop:'1px solid #eee',paddingTop:8,display:'grid',rowGap:6}}>
                <div style={{display:'flex',justifyContent:'space-between'}}><span>Due today</span><span>$0.00</span></div>
                <div style={{display:'flex',justifyContent:'space-between'}}><span>After trial</span><span>${urlParams.price}.00 / month</span></div>
                <div style={{display:'flex',justifyContent:'space-between',color:'#6b7280'}}><span>First charge on</span><span>{trialEndDate}</span></div>
                <div style={{marginTop:8,fontSize:12,color:'#6b7280'}}>Registration code: <b>{urlParams.code}</b></div>
              </div>
            </div>
          </section>

          {/* Form */}
          <section style={{background:'#fff',border:'1px solid #eee',borderRadius:16,padding:16}}>
            <h2 style={{margin:0,color:'#2d5016'}}>Your details</h2>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12,marginTop:12}}>
              <Field label="First name"  value={firstName} onChange={setFirstName}/>
              <Field label="Last name"   value={lastName}  onChange={setLastName}/>
              <Field label="Email"       type="email" value={email} onChange={setEmail}/>
              <Field label="Phone"       value={phone} onChange={setPhone}/>
            </div>

            <button
              onClick={goToTokenIframe}
              style={{marginTop:12,width:'100%',padding:'14px 18px',background:'#8B5E3C',color:'#fff',border:'none',borderRadius:12,fontWeight:700,cursor:'pointer'}}
            >
              Continue to Secure Payment
            </button>

            <p style={{marginTop:10,fontSize:12,color:'#6b7280'}}>
              We won’t charge you today. We’ll only verify your card and create a secure token. Your first charge will occur after the 7-day trial.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

function Field({label,value,onChange,type='text'}:{
  label:string; value:string; onChange:(v:string)=>void; type?:string;
}) {
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
