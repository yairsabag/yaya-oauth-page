'use client';

import { useEffect, useState } from 'react';

type Params = {
  code: string;
  token: string;
  trialStart?: string;
  trialEnd?: string;
};

export default function PaymentSuccessPage() {
  const [params, setParams] = useState<Params | null>(null);

  useEffect(() => {
    // נוודא שאנחנו בצד לקוח
    if (typeof window !== 'undefined') {
      // לצאת מ-iframe אם צריך
      const topWin: Window | null = window.top;
      if (topWin && topWin !== window.self) {
        try {
          topWin.location.href = window.location.href;
        } catch {
          // במקרה של cross-domain נשתוק
        }
      }

      const q = new URLSearchParams(window.location.search);
      const data: Params = {
        code: q.get('code') || q.get('u1') || '',
        token: q.get('token') || '',
        trialStart: q.get('trial_start') || '',
        trialEnd: q.get('trial_end') || '',
      };
      setParams(data);
    }
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ Payment Successful</h1>
      {params ? (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>User Code:</strong> {params.code}</p>
          <p><strong>Token:</strong> {params.token}</p>
          {params.trialStart && (
            <p><strong>Trial Start:</strong> {params.trialStart}</p>
          )}
          {params.trialEnd && (
            <p><strong>Trial End:</strong> {params.trialEnd}</p>
          )}
        </div>
      ) : (
        <p>Loading payment details...</p>
      )}
    </div>
  );
}
