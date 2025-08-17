'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const [registrationCode, setRegistrationCode] = useState('')

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    // נמשוך את הקוד שהבאתם ב-redirect של הסליקה (למשל ?code=F75CEJ)
    setRegistrationCode(p.get('code') || '')
  }, [])

  const authHref = `/api/google/authorize?state=${encodeURIComponent(registrationCode || '')}`

  return (
    <div style={{
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', textDecoration: 'none' }}>
            <img src="/yaya-logo.png" alt="Yaya" style={{ width: 72, height: 72, objectFit: 'contain' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2d5016' }}>Yaya</span>
          </a>
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <CheckCircle size={80} style={{ color: '#22c55e', margin: '0 auto' }} />
          </div>
          <h1 style={{
            fontSize: '3rem', fontWeight: 400, color: '#8B5E3C',
            marginBottom: '1rem', letterSpacing: '-0.02em'
          }}>
            🎉 Payment Successful!
          </h1>

          {/* פס ירוק קצר – אופציונלי */}
          <div style={{
            background: 'rgba(34,197,94,.12)',
            border: '1px solid rgba(34,197,94,.35)',
            color: '#166534',
            borderRadius: 8,
            padding: '12px 16px',
            margin: '0 auto 24px',
            maxWidth: 720
          }}>
            ✅ Your account is ready! Connect Google to unlock all features.
          </div>

          <p style={{ fontSize: '1.15rem', color: '#718096', marginBottom: '1.5rem' }}>
            Your 7-day free trial has started! Connect your Google account to activate calendar & reminders:
          </p>

          {/* הכפתור – תמיד <a>, עושה bridge לראוט השרת */}
          <a
            href={authHref}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              gap: 12, padding: '16px 28px', borderRadius: 12,
              background: '#4285f4', color: 'white', textDecoration: 'none',
              fontSize: '1.1rem', fontWeight: 700, minWidth: 320,
              boxShadow: '0 6px 18px rgba(66,133,244,0.35)'
            }}
            onClick={(e) => {
              // אם אין קוד – עדיין נמשיך (state ריק), אבל נוכל להתריע
              if (!registrationCode) {
                console.warn('Missing registration code in state')
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
              <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
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
