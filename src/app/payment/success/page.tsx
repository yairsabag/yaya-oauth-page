'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const [urlParams, setUrlParams] = useState({
    plan: '',
    email: '',
    price: '',
    code: '',
    billing: 'monthly',
    firstName: '',
    lastName: '',
  })
  const [planUpdateStatus, setPlanUpdateStatus] =
    useState<'loading' | 'success' | 'error'>('loading')

  // Break out of iframe if embedded (Tranzila)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.top && window.top !== window.self) {
      try {
        window.top.location.href = window.location.href
        return
      } catch {
        window.open(window.location.href, '_top')
      }
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const planData = {
      plan: params.get('plan') || '',
      email: params.get('email') || '',
      price: params.get('price') || '',
      code: params.get('code') || '',
      billing: params.get('billing') || 'monthly',
      firstName: params.get('firstName') || '',
      lastName: params.get('lastName') || '',
    }
    setUrlParams(planData)
    updateUserPlan(planData)
  }, [])

  const updateUserPlan = async (planData: typeof urlParams) => {
    if (!planData.code || !planData.plan) {
      setPlanUpdateStatus('error')
      return
    }
    try {
      const expirationDate = new Date()
      if (planData.billing === 'yearly') {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1)
      } else {
        expirationDate.setMonth(expirationDate.getMonth() + 1)
      }

      const res = await fetch('https://n8n-TD2y.sliplane.app/webhook/update-user-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_code: planData.code,
          plan: planData.plan,
          email: planData.email,
          expires_at: expirationDate.toISOString(),
          billing_type: planData.billing,
          status: 'active',
          first_name: planData.firstName,
          last_name: planData.lastName,
        }),
      })

      if (res.ok) setPlanUpdateStatus('success')
      else setPlanUpdateStatus('error')
    } catch {
      setPlanUpdateStatus('error')
    }
  }

  // Google OAuth URL (state = registration code)
  const googleOAuthUrl = useMemo(() => {
    const clientId =
      '314964896562-o93h71h2cpiqgcikaqeg2a34ht2ipl2j.apps.googleusercontent.com'
    const redirectUri =
      'https://n8n-td2y.sliplane.app/webhook/google-oauth-callback'
    const scope = encodeURIComponent('openid email https://www.googleapis.com/auth/calendar')
    const state = encodeURIComponent(urlParams.code || '')
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`
  }, [urlParams.code])

  const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    background: '#4285f4',
    color: 'white',
    padding: '16px 28px',
    borderRadius: 12,
    border: 'none',
    fontSize: '1.1rem',
    fontWeight: 700,
    cursor: urlParams.code ? 'pointer' : 'not-allowed',
    boxShadow: '0 6px 18px rgba(66,133,244,.35)',
    textDecoration: 'none',
    opacity: urlParams.code ? 1 : 0.6,
  }

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
      }}
    >
      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <CheckCircle size={80} style={{ color: '#22c55e', margin: '0 auto' }} />
          </div>

          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 400,
              color: '#8B5E3C',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            🎉 Payment Successful!
          </h1>

          {planUpdateStatus === 'loading' && (
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: 8,
                padding: 12,
                marginBottom: '2rem',
                color: '#16a34a',
              }}
            >
              Setting up your account…
            </div>
          )}

          {planUpdateStatus === 'success' && (
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: 8,
                padding: 12,
                marginBottom: '2rem',
                color: '#16a34a',
              }}
            >
              ✅ Your account is ready! Connect Google to unlock all features.
            </div>
          )}

          {planUpdateStatus === 'error' && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8,
                padding: 12,
                marginBottom: '2rem',
                color: '#ef4444',
              }}
            >
              ⚠️ There was an issue setting up your account. You can still connect Google below.
            </div>
          )}

          {/* כפתור כקישור אמיתי, נפתח בטופ-וינדו */}
          <a
            href={googleOAuthUrl || '#'}
            target="_top"
            rel="noopener noreferrer"
            style={buttonStyle}
            onClick={(e) => {
              if (!urlParams.code) {
                e.preventDefault()
                alert('Missing registration code (state). Please contact support.')
              }
            }}
          >
            Connect Google Account
          </a>

          <p style={{ marginTop: 24, color: '#718096', fontSize: '.9rem' }}>
            Your data is encrypted and only used to help you manage your day via WhatsApp.
          </p>
        </div>
      </main>
    </div>
  )
}
