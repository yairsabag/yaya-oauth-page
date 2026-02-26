'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const [code, setCode] = useState('')

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setCode(p.get('code') || '')
  }, [])

  const googleOAuthUrl = useMemo(() => {
    const clientId = '314964896562-o93h71h2cpiqgcikaqeg2a34ht2ipl2j.apps.googleusercontent.com'
    const redirectUri = 'https://n8n-postgres-fgkwgf.sliplane.app/webhook/google-oauth-callback'
    const scope = encodeURIComponent('openid email https://www.googleapis.com/auth/calendar')
    const state = encodeURIComponent(code)
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`
  }, [code])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #faf5f0, #f7f3ed)' }}>
      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <CheckCircle size={80} style={{ color: '#22c55e', margin: '0 auto 1.5rem' }} />

          <h1 style={{ fontSize: '3rem', fontWeight: 400, color: '#8B5E3C', marginBottom: '1rem' }}>
            🎉 Payment Successful!
          </h1>

          <div style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 8, padding: 12, marginBottom: '2rem', color: '#16a34a' }}>
            ✅ Your account is ready! Connect Google to unlock all features.
          </div>

          
            href={googleOAuthUrl || '#'}
            target="_top"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              padding: '16px 28px', borderRadius: 12,
              background: '#4285f4', color: 'white', textDecoration: 'none',
              fontSize: '1.1rem', fontWeight: 700, minWidth: 320,
              boxShadow: '0 6px 18px rgba(66,133,244,0.35)'
            }}
          >
            Connect Google Account
          </a>

          <p style={{ marginTop: 20, color: '#7a6a5f', fontSize: '.9rem' }}>
            Your data is encrypted and only used to help you manage your day via WhatsApp.
          </p>
        </div>
      </main>
    </div>
  )
}
```

---

### 3. עדכן את הקישור לצ'קאאוט בכל מקום שמפנה אליו:
```
/payment/checkout?code=REGISTRATION_CODE&wa_id=WA_ID&plan=pro&planName=Pro Plan
