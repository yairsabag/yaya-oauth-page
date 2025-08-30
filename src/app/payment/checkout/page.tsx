// src/app/payment/checkout/page.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Shield } from 'lucide-react';

type UrlParams = {
  plan: 'pro' | 'ultimate';
  price: string;                 // e.g. "5" or "14" in USD
  billing: 'monthly';            // monthly only
  code: string;                  // registration code / uid
  planName: string;
};

// ===== Config =====
const TERMINAL_FOR_CHARGE = 'fxpyairsabag'; // your CHARGE terminal (not the token one)
const CURRENCY_CODE = '2'; // 1=ILS, 2=USD, 978=EUR

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState<UrlParams>({
    plan: 'pro',
    price: '5',
    billing: 'monthly',
    code: 'F75CEJ',
    planName: 'Pro Plan',
  });

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [isMobile,  setIsMobile]  = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const plan = ((p.get('plan') || 'pro').toLowerCase() as UrlParams['plan']);
    const price = p.get('price') || (plan === 'ultimate' ? '14' : '5');
    const billing = 'monthly';
    setUrlParams({
      plan,
      price,
      billing,
      code: p.get('code') || 'F75CEJ',
      planName: p.get('planName') || (plan === 'ultimate' ? 'Ultimate Plan' : 'Pro Plan'),
    });

    const onResize = () => setIsMobile(window.innerWidth < 940);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.yayagent.com';

  // Success / Fail / Notify
  const successUrl = useMemo(() => {
    const q = new URLSearchParams({
      plan: urlParams.plan,
      planName: urlParams.planName,
      price: urlParams.price,
      billing: urlParams.billing,
      code: urlParams.code,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    });
    return `${origin}/payment/success?${q}`;
  }, [origin, urlParams, firstName, lastName, email]);

  const failUrl = `${origin}/payment/fail`;

  const notifyUrl = useMemo(() => {
    const q = new URLSearchParams({
      uid: urlParams.code,
      plan: urlParams.plan,
      billing: urlParams.billing,
      price: urlParams.price,
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    return `https://yairsabag.app.n8n.cloud/webhook/tranzila?${q.toString()}`;
  }, [urlParams, email, firstName, lastName]);

  // submit form into iframe
  const goToIframe = () => {
    if (!email.trim()) {
      alert('Please enter your email so we can send your receipt.');
      return;
    }
    formRef.current?.submit();
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
          {/* Summary (unchanged) */}
          <section style={{background:'#fff',border:'1px solid #eee',borderRadius:16,padding:16}}>
            <h2 style={{margin:0,color:'#2d5016'}}>Subscribe</h2>
            <div style={{marginTop:12}}>
              <div style={{fontWeight:700,color:'#8B5E3C'}}>{urlParams.planName}</div>
              <div style={{marginTop:8,borderTop:'1px solid #eee',paddingTop:8,display:'grid',rowGap:6}}>
                <div style={{display:'flex',justifyContent:'space-between'}}><span>Charged today</span><span>${urlParams.price}.00</span></div>
                <div style={{display:'flex',justifyContent:'space-between'}}><span>Renews</span><span>${urlParams.price}.00 / month</span></div>
                <div style={{marginTop:8,fontSize:12,color:'#6b7280'}}>Registration code: <b>{urlParams.code}</b></div>
              </div>
            </div>
          </section>

          {/* Form + IFRAME */}
          <section style={{background:'#fff',border:'1px solid #eee',borderRadius:16,padding:16}}>
            <h2 style={{margin:0,color:'#2d5016'}}>Your details</h2>

            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12,marginTop:12}}>
              <Field label="First name"  value={firstName} onChange={setFirstName}/>
              <Field label="Last name"   value={lastName}  onChange={setLastName}/>
              <Field label="Email"       type="email" value={email} onChange={setEmail}/>
              <Field label="Phone"       value={phone} onChange={setPhone}/>
            </div>

            {/* POST directly to Tranzila into the iframe */}
            <form
              ref={formRef}
              action={`https://direct.tranzila.com/${TERMINAL_FOR_CHARGE}/iframenew.php`}
              method="POST"
              target="tranzila"
              style={{marginTop:12}}
              noValidate
              autoComplete="off"
            >
              {/* Amount & currency */}
              <input type="hidden" name="sum" value={urlParams.price} />
              <input type="hidden" name="currency" value={CURRENCY_CODE} />
              <input type="hidden" name="cred_type" value="1" />

              {/* Look & feel */}
              <input type="hidden" name="buttonLabel" value="Pay" />
              <input type="hidden" name="trBgColor" value="FAF5F0" />
              <input type="hidden" name="trTextColor" value="2D5016" />
              <input type="hidden" name="trButtonColor" value="8B5E3C" />
              {/* remove nologo so Tranzila logo can show inside the iframe */}
              {/* <input type="hidden" name="nologo" value="1" /> */}

              {/* Google Pay option */}
              <input type="hidden" name="google_pay" value="1" />

              {/* IMPORTANT: no recur_* params so iframe shows only "Total" + amount */}
              {/* If/when you want to run STO creation, do it server-side on notify/success. */}

              {/* Payer info */}
              <input type="hidden" name="contact" value={[firstName.trim(), lastName.trim()].filter(Boolean).join(' ')} />
              <input type="hidden" name="email" value={email.trim()} />
              <input type="hidden" name="phone" value={phone.trim()} />

              {/* Tracking */}
              <input type="hidden" name="uid" value={urlParams.code} />
              <input type="hidden" name="u1" value={urlParams.code} />
              <input type="hidden" name="u2" value={urlParams.plan} />
              <input type="hidden" name="u3" value={urlParams.billing} />
              <input type="hidden" name="u4" value={urlParams.price} />
              <input type="hidden" name="pdesc" value={`Yaya ${urlParams.plan} - $${urlParams.price}/mo`} />

              {/* Redirects */}
              <input type="hidden" name="success_url_address" value={successUrl} />
              <input type="hidden" name="fail_url_address" value={failUrl} />
              <input type="hidden" name="notify_url_address" value={notifyUrl} />

              <button
                type="button"
                onClick={goToIframe}
                style={{marginTop:12,width:'100%',padding:'14px 18px',background:'#8B5E3C',color:'#fff',border:'none',borderRadius:12,fontWeight:700,cursor:'pointer'}}
              >
                Continue to Secure Payment
              </button>
            </form>

            <p style={{marginTop:10,fontSize:12,color:'#6b7280'}}>
              You’ll be charged ${urlParams.price}.00 today and then ${urlParams.price}.00 every month until you cancel.
            </p>

            <div style={{marginTop:16,width:'100%',height:isMobile?500:800}}>
              <iframe
                id="tranzila-frame"
                name="tranzila"
                src=""
                allow="payment"
                style={{width:'100%',height:'100%',border:0,borderRadius:12,background:'#fff'}}
                title="Secure payment"
              />
            </div>

            {/* Trust badges strip (outside the iframe) */}
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
