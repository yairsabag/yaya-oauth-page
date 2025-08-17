'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle, MessageCircle, Calendar, Bell } from 'lucide-react'

export default function SuccessPage() {
  // פרמטרים מה-URL
  const [urlParams, setUrlParams] = useState({
    plan: '',
    email: '',
    price: '',
    code: '',
    billing: 'monthly',
  })

  const [planUpdateStatus, setPlanUpdateStatus] =
    useState<'idle' | 'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const planData = {
      plan: (params.get('plan') || '').toLowerCase(),
      email: params.get('email') || '',
      price: params.get('price') || '',
      code: params.get('code') || '',
      billing: (params.get('billing') || 'monthly').toLowerCase(),
    }
    setUrlParams(planData)
    updateUserPlan(planData)
  }, [])

  // עדכון סטטוס המשתמש לאחר תשלום
  async function updateUserPlan(planData: typeof urlParams) {
    if (!planData.code || !planData.plan) {
      setPlanUpdateStatus('error')
      return
    }

    try {
      // חישוב תאריך תפוגה (חודש/שנה)
      const expirationDate = new Date()
      if (planData.billing === 'yearly') {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1)
      } else {
        expirationDate.setMonth(expirationDate.getMonth() + 1)
      }

      const res = await fetch(
        'https://n8n-TD2y.sliplane.app/webhook/update-user-plan',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registration_code: planData.code,
            plan: planData.plan,
            email: planData.email,
            expires_at: expirationDate.toISOString(),
            billing_type: planData.billing,
            status: 'active',
          }),
        }
      )

      if (!res.ok) throw new Error('Failed to update plan')
      setPlanUpdateStatus('success')
    } catch (e) {
      console.error(e)
      setPlanUpdateStatus('error')
    }
  }

  // נתונים להצגה
  const planNames = {
    executive: 'Executive Plan',
    ultimate: 'Ultimate Plan',
  } as const

  // קישור OAuth של גוגל — עם state = קוד רישום
  const googleOAuthUrl = useMemo(() => {
    const clientId =
      '314964896562-o93h71h2cpiqgcikaqeg2a34ht2ipl2j.apps.googleusercontent.com'
    const redirectUri =
      'https://n8n-td2y.sliplane.app/webhook/google-oauth-callback'

    const base =
      'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount'

    const qs = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email https://www.googleapis.com/auth/calendar',
      state: urlParams.code || '', // <-- חשוב! מזהה המשתמש
      access_type: 'offline',
      prompt: 'consent',
      service: 'lso',
      o2v: '2',
      flowName: 'GeneralOAuthFlow',
    })

    return `${base}?${qs.toString()}`
  }, [urlParams.code])

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          padding: '1rem 0',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '.75rem',
              textDecoration: 'none',
            }}
          >
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ width: 80, height: 80, objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2d5016' }}>
              Yaya
            </span>
          </a>
        </div>
      </header>

      <main style={{ padding: '4rem 0' }}>
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            padding: '0 2rem',
            textAlign: 'center',
          }}
        >
          {/* Success Icon */}
          <div style={{ marginBottom: '2rem' }}>
            <CheckCircle size={80} style={{ color: '#25d366', margin: '0 auto' }} />
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
                background: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                borderRadius: 8,
                padding: 12,
                marginBottom: '2rem',
              }}
            >
              <p style={{ color: '#f59e0b', fontSize: '.9rem', margin: 0 }}>
                ⏳ Setting up your account...
              </p>
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
              }}
            >
              <p style={{ color: '#22c55e', fontSize: '.9rem', margin: 0 }}>
                ✅ Your account is ready! Connect Google to unlock all features.
              </p>
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
              }}
            >
              <p style={{ color: '#ef4444', fontSize: '.9rem', margin: 0 }}>
                ⚠️ There was an issue setting up your account. Don't worry – your payment went
                through. Contact support if needed.
              </p>
            </div>
          )}

          <p
            style={{
              fontSize: '1.2rem',
              color: '#718096',
              marginBottom: '2rem',
              maxWidth: 600,
              marginInline: 'auto',
              lineHeight: 1.5,
            }}
          >
            Your 7-day free trial has started! Connect your Google account to activate
            calendar & reminders:
          </p>

          {/* כפתור OAuth – עדיף <a> כדי למנוע חסימות של popup blockers */}
          <div style={{ marginBottom: '3rem' }}>
            <a
              href={googleOAuthUrl}
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
                pointerEvents: urlParams.code ? 'auto' : 'none',
                opacity: urlParams.code ? 1 : 0.6,
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.background = '#3367d6')
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.background = '#4285f4')
              }
            >
              {/* אייקון G קטן */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="white"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="white"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="white"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="white"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Connect Google Account
            </a>

            {!urlParams.code && (
              <p style={{ marginTop: 8, color: '#ef4444', fontSize: '.9rem' }}>
                Missing registration code in URL (cannot start OAuth).
              </p>
            )}
          </div>

          <p
            style={{
              fontSize: '.9rem',
              color: '#718096',
              marginBottom: '3rem',
              fontStyle: 'italic',
            }}
          >
            Your data is encrypted and only used to help you manage your day via
            WhatsApp.
          </p>

          {/* קופסת "Get started in 3 steps" (כמו שהיה) */}
          <div
            style={{
              background: '#F5F1EB',
              borderRadius: 20,
              padding: '2rem',
              border: '1px solid #E5DDD5',
              marginBottom: '3rem',
              textAlign: 'left',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#8B5E3C',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              🚀 Get Started in 3 Steps
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    background: 'rgba(139, 94, 60, 0.1)',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MessageCircle size={24} style={{ color: '#8B5E3C' }} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#8B5E3C',
                      marginBottom: '.5rem',
                    }}
                  >
                    1. Message Yaya on WhatsApp
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '.9rem', opacity: 0.8 }}>
                    Send: "My code: {urlParams.code || 'XXXXXX'}" to activate your{' '}
                    {planNames[urlParams.plan as keyof typeof planNames] ||
                      'Selected Plan'}
                  </p>
                  <a
                    href={`https://wa.me/972559943649?text=${encodeURIComponent(
                      `My code: ${urlParams.code || ''}`
                    )}`}
                    style={{
                      display: 'inline-block',
                      marginTop: '.5rem',
                      background: '#25d366',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: 6,
                      textDecoration: 'none',
                      fontSize: '.9rem',
                      fontWeight: 600,
                      transition: 'all .2s ease',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.background = '#22c55e')
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.background = '#25d366')
                    }
                  >
                    Open WhatsApp
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    background: 'rgba(139, 94, 60, 0.1)',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Calendar size={24} style={{ color: '#8B5E3C' }} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#8B5E3C',
                      marginBottom: '.5rem',
                    }}
                  >
                    2. Connect Your Calendar (Above)
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '.9rem', opacity: 0.8 }}>
                    Link your Google Calendar for seamless scheduling
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    background: 'rgba(139, 94, 60, 0.1)',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bell size={24} style={{ color: '#8B5E3C' }} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#8B5E3C',
                      marginBottom: '.5rem',
                    }}
                  >
                    3. Set Your First Reminder
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '.9rem', opacity: 0.8 }}>
                    Try: "Remind me to call mom tomorrow at 3pm"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '.8rem', color: '#718096', marginTop: '2rem' }}>
            Need help? Contact us at{' '}
            <a href="mailto:info@textcoco.com" style={{ color: '#8B5E3C' }}>
              info@textcoco.com
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
