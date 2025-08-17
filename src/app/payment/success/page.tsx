'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const [code, setCode] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // הקוד מגיע כ- ?code=XXXX מה־success_url_address
    setCode(params.get('code') || '')
  }, [])

  const googleOAuthUrl = useMemo(() => {
    const base = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount'
    const qs = new URLSearchParams({
      client_id: '314964896562-o93h71h2cpiqgcikaqeg2a34ht2ipl2j.apps.googleusercontent.com',
      redirect_uri: 'https://n8n-td2y.sliplane.app/webhook/google-oauth-callback',
      response_type: 'code',
      scope: 'openid email https://www.googleapis.com/auth/calendar',
      state: code || '',
      access_type: 'offline',
      prompt: 'consent',
      service: 'lso',
      o2v: '2',
      flowName: 'GeneralOAuthFlow',
    })
    return `${base}?${qs.toString()}`
  }, [code])

  const goToGoogle = () => {
    if (!googleOAuthUrl) return
    window.location.href = googleOAuthUrl
  }

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 600 }}>
        <CheckCircle size={80} style={{ color: '#25d366', margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '3rem', fontWeight: 400, color: '#8B5E3C', marginBottom: '1rem' }}>
          🎉 Payment Successful!
        </h1>

        <div
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 8,
            padding: 12,
            marginBottom: '2rem',
          }}
        >
          <p style={{ color: '#22c55e', fontSize: '1rem', margin: 0 }}>
            ✅ Your account is ready! Connect Google to unlock all features.
          </p>
        </div>

        <p style={{ fontSize: '1.2rem', color: '#718096', marginBottom: '2rem' }}>
          Your 7-day free trial has started! Connect your Google account to activate
          calendar & reminders:
        </p>

        {/* anchor + button fallback */}
        <a
          href={googleOAuthUrl}
          onClick={(e) => { e.preventDefault(); goToGoogle() }}
          style={{
            background: '#4285f4',
            color: 'white',
            padding: '16px 32px',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#3367d6')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.background = '#4285f4')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Connect Google Account
        </a>

        <p style={{ fontSize: '.9rem', color: '#718096', marginTop: '2rem', fontStyle: 'italic' }}>
          Your data is encrypted and only used to help you manage your day via WhatsApp.
        </p>
      </div>
    </div>
  )
}
