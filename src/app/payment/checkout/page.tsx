// src/app/payment/checkout/page.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Shield } from 'lucide-react';

type UrlParams = {
  plan: 'executive' | 'ultimate';
  price: string;                 // "5" | "14" | ...
  billing: 'monthly' | 'yearly';
  code: string;                  // registration code / uid
  planName: string;
};

const TERMINAL = 'fxpyairsabagtok'; // ← החלף אם צריך
const IFRAME_URL = `https://direct.tranzila.com/${TERMINAL}/iframenew.php`;

// מיפוי billing → recurring code של טרנזילה
const RECUR_CODE: Record<UrlParams['billing'], '4_approved' | '7_approved'> = {
  monthly: '4_approved',
  yearly: '7_approved',
};

// מטבע: 2 = USD, 1 = ILS, 978 = EUR, 826 = GBP
const CURRENCY = '2';

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

  const formRef = useRef<HTMLFormElement|null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const plan = ((p.get('plan') || 'executive').toLowerCase() as UrlParams['plan']);
    const billing = ((p.get('billing') || 'monthly').toLowerCase() as UrlParams['billing']);
    const price = p.get('price') || (plan === 'ultimate' ? '14' : '5');
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

  // בניית טופס POST ושיגורו ל-IFRAME
  const submitToIframe = () => {
    if (!email.trim()) {
      alert('Please enter your email so we can send your receipt.');
      return;
    }

    const origin = window.location.origin;
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

    // פרמטרים לטרנזילה (חיוב עכשיו + מחזורי אוטומטי)
    const payload: Record<string, string> = {
      // סכום לתשלום עכשיו
      sum: urlParams.price,
      // חיוב מחזורי באותו סכום
      recur_sum: urlParams.price,
      recur_transaction: RECUR_CODE[urlParams.billing],
      // אם תרצה להגביל מספר חיובים: payload.recur_payments = '12';

      currency: CURRENCY,
      buttonLabel: 'Pay',

      // שפה + מיתוג (אופציונלי)
      lang: 'il',
      trBgColor: 'FAF5F0',
      trTextColor: '2D5016',
      trButtonColor: '8B5E3C',

      // זיהוי/תיאור
      uid: urlParams.code,
      u1: urlParams.code,
      u2: urlParams.plan,
      u3: urlParams.billing,
      u4: urlParams.price,
      pdesc: `Yaya ${urlParams.planName} - ${urlParams.billing}`,

      // פרטי לקוח
      contact: [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
      email: email.trim(),
      phone: phone.trim(),

      // כתובות חזרה + Notify
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
    };

    // יוצרים/מנקים טופס נסתר ומגישים ל-IFRAME
    let form = formRef.current;
    if (!form) return;

    // נקה אינפוטים קודמים
    while (form.firstChild) form.removeChild(form.firstChild);

    // קבע יעד וכתובת
    form.action = IFRAME_URL;
    form.method = 'POST';
    form.target = 'tranzila';

    // הוסף שדות חבויים
    Object.entries(payload).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    form.submit();
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
            <h2 style={{margin:0,color:'#2d5016'}}>Your plan</h2>
            <div style={{marginTop:12}}>
              <div style={{fontWeight:700,color:'#8B5E3C'}}>{urlParams.planName}</div>
              <div style={{marginTop:8,borderTop:'1px solid #eee',paddingTop:8,display:'grid',rowGap:6}}>
                <div style={{display:'flex',justifyContent:'space-between'}}><span>Due now</span><span>${urlParams.price}.00</span></div>
                <div style={{display:'flex',justifyContent:'space-between'}}><span>Then</span><span>${urlParams.price}.00 / {urlParams.billing === 'monthly' ? 'month' : 'year'}</span></div>
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
              onClick={submitToIframe}
              style={{marginTop:12,width:'100%',padding:'14px 18px',background:'#8B5E3C',color:'#fff',border:'none',borderRadius:12,fontWeight:700,cursor:'pointer'}}
            >
              Pay securely
            </button>

            <p style={{marginTop:10,fontSize:12,color:'#6b7280'}}>
              Your card will be charged now and automatically every {urlParams.billing === 'monthly' ? 'month' : 'year'} for {urlParams.planName}. You can cancel anytime.
            </p>

            {/* טופס נסתר שישוגר אל ה־IFRAME */}
            <form ref={formRef} style={{display:'none'}} />
          </section>
        </div>

        {/* IFRAME של טרנזילה (נשארים באותו עמוד) */}
        <div style={{marginTop:16}}>
          <div style={{width:'100%',maxWidth:820,height:720}}>
            <iframe
              id="tranzila-frame"
              name="tranzila"
              src=""
              allow="payment"
              allowPaymentRequest
              style={{width:'100%',height:'100%',border:0,borderRadius:12,background:'#fff'}}
              title="Secure payment"
            />
          </div>
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
