'use client';

import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

declare global {
  interface Window {
    Paddle: any;
  }
}

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState({
    code: '',
    wa_id: '',
    plan: 'pro',
    planName: 'Pro Plan',
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUrlParams({
      code: p.get('code') || '',
      wa_id: p.get('wa_id') || '',
      plan: p.get('plan') || 'pro',
      planName: p.get('planName') || 'Pro Plan',
    });

    const onResize = () => setIsMobile(window.innerWidth < 940);
    onResize();
    window.addEventListener('resize', onResize);

    // טען Paddle.js
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.onload = () => {
      window.Paddle.Initialize({
        token: 'live_0f57a73a8cfdbda0d5507d7e100',
        eventCallback: (event: any) => {
          if (event.name === 'checkout.completed') {
            const code = new URLSearchParams(window.location.search).get('code') || '';
            window.location.href = `/payment/success?code=${code}`;
          }
        }
      });
    };
    document.head.appendChild(script);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const openCheckout = () => {
    if (!urlParams.code) {
      alert('Missing registration code. Please contact support.');
      return;
    }

    window.Paddle.Checkout.open({
      items: [{ priceId: 'pri_01kjcrg1q1zmkqyn9wswdwknsz', quantity: 1 }],
      customData: {
        registration_code: urlParams.code,
        wa_id: urlParams.wa_id,
      },
      successUrl: `${window.location.origin}/payment/success?code=${urlParams.code}`,
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF5F0', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', gap: 10, alignItems: 'center', textDecoration: 'none' }}>
            <img src="/yaya-logo.png" width={56} height={56} alt="Yaya" />
            <strong style={{ color: '#2d5016', fontSize: 20 }}>Yaya</strong>
          </a>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center', color: '#6b7280', fontSize: 14 }}>
            <Shield size={16} /> Secure checkout
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 600, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: 32 }}>
          <h1 style={{ color: '#2d5016', fontSize: 28, marginBottom: 8 }}>Upgrade to {urlParams.planName}</h1>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>$5.00 / month • Cancel anytime</p>

          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Yaya Pro Monthly</span>
              <strong>$5.00</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: 14 }}>
              <span>Registration code</span>
              <span>{urlParams.code}</span>
            </div>
          </div>

          <button
            onClick={openCheckout}
            style={{
              width: '100%', padding: '16px 24px',
              background: 'linear-gradient(135deg, #8B5E3C, #a0714f)',
              color: '#fff', border: 'none', borderRadius: 12,
              fontSize: 18, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(139,94,60,0.35)'
            }}
          >
            Continue to Secure Payment
          </button>

          <p style={{ marginTop: 16, fontSize: 12, color: '#9ca3af' }}>
            Powered by Paddle • PCI DSS Compliant • SSL Encrypted
          </p>
        </div>
      </main>
    </div>
  );
}
