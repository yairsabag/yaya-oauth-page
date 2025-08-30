// src/app/payment/checkout/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Shield } from 'lucide-react';

type UrlParams = {
  plan: 'executive' | 'ultimate';
  price: string;            // "5" | "14"
  billing: 'monthly' | 'yearly';
  code: string;
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

  // iframe URL (charge now; no recurring params in iframe)
  const iframeUrl = useMemo(() => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://www.yayagent.com';

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

    const base = 'https://direct.tranzila.com/fxpyairsabagtok/iframenew.php';

    const params = new URLSearchParams({
      // Standard charge (no “recur_” params here)
      tranmode: 'A',
      sum: urlParams.price,
      currency: '2',            // USD
      cred_type: '1',

      // Styling (basic)
      trBgColor: 'FAF5F0',
      trTextColor: '2D5016',
      trButtonColor: '8B5E3C',
      buttonLabel: 'Pay',

      // Payer info (for receipt)
      contact: [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
      email: email.trim(),
      phone: phone.trim(),

      // Tracking
      uid: urlParams.code,
      u1: urlParams.code,
      u2: urlParams.plan,
      u3: urlParams.billing,
      u4: urlParams.price,
      pdesc: `Yaya ${urlParams.plan} - ${urlParams.price}$/mo`,

      // Redirects + notify
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

  const continueToPayment = () => {
    if (!email.trim()) {
      alert('Please enter your email so we can send your receipt.');
      return;
    }
    // מעבירים ישירות למסך התשלום בתוך ה-iframe המשולב
    const el = document.getElementById('tranzila-frame') as HTMLIFrameElement | null;
    if (!el) window.location.href = iframeUrl;
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
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'380px 1fr',gap:16}}>
          {/* LEFT: Subscribe — unchanged layout */}
          <section style={{background:'#fff',border:'1px solid #eee',borderRadius:16,padding:16}}>
            <h2 style={{margin:0,color:'#2d5016'}}>Subscribe</h2>
            <div style={{marginTop:12}}>
              <div style={{fontWeight:700,color:'#8B5E3C'}}>{urlParams.planName}</div>
              <div style={{marginTop:8,borderTop:'1px solid #eee',paddingTop:8,display:'grid',rowGap:6}}>
                <div style={{display:'flex',justifyContent:'space-between'}}><span>Charged today</span><span>${Number(urlParams.price).toFixed(2)}</span></div>
                <div style={{display:'flex',justifyContent:'space-between'}}><span>Renews</span><span>${Number(urlParams.price).toFixed(2)} / month</span></div>
                <div style={{marginTop:8,fontSize:12,color:'#6b7280'}}>Registration code: <b>{urlParams.code}</b></div>
              </div>
            </div>
          </section>

          {/* RIGHT: form + iframe */}
          <section style={{background:'#fff',border:'1px solid #eee',borderRadius:16,padding:16}}>
            <h2 style={{margin:0,color:'#2d5016'}}>Your details</h2>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12,marginTop:12}}>
              <Field label="First name"  value={firstName} onChange={setFirstName}/>
              <Field label="Last name"   value={lastName}  onChange={setLastName}/>
              <Field label="Email"       type="email" value={email} onChange={setEmail}/>
              <Field label="Phone"       value={phone} onChange={setPhone}/>
            </div>

            <button
              onClick={continueToPayment}
              style={{marginTop:12,width:'100%',padding:'14px 18px',background:'#8B5E3C',color:'#fff',border:'none',borderRadius:12,fontWeight:700,cursor:'pointer'}}
            >
              Continue to Secure Payment
            </button>

            <div style={{marginTop:16,border:'1px solid #eee',borderRadius:12,overflow:'hidden'}}>
              <iframe
                id="tranzila-frame"
                name="tranzila"
                src={iframeUrl}
                allow="payment"
                title="Secure payment"
                style={{width:'100%',height:520,border:0}}
              />
            </div>

            {/* Trust strip (optional, matches your style) */}
            <div
              aria-label="Secure badges"
              style={{
                marginTop: 12,
                padding: '10px 12px',
                border: '1px solid #eee',
                borderRadius: 12,
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap'
              }}
            >
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <img src="/tranzila-logo.svg" alt="Tranzila" height={20}/>
                <span style={{color:'#6b7280',fontSize:13}}>Secured by Tranzila</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <img src="/badge-3ds.svg" alt="3D Secure" height={22}/>
                <img src="/badge-firewall.svg" alt="Firewall" height={22}/>
                <img src="/badge-ssl.svg" alt="SSL" height={22}/>
                <img src="/badge-pci.svg" alt="PCI DSS Level 1" height={22}/>
              </div>
            </div>
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
