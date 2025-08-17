'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Calendar, Bell, MessageCircle, Shield, CreditCard } from 'lucide-react'

type Step = 'plan' | 'payment' | 'oauth'
type PlanKey = 'executive' | 'ultimate'
type Billing = 'monthly' | 'yearly'

interface Plan {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  popular: boolean
  features: string[]
}

const PLANS: Record<PlanKey, Plan> = {
  executive: {
    name: 'Executive Plan',
    monthlyPrice: 5,
    yearlyPrice: 4,
    popular: true,
    features: [
      'Unlimited messages',
      'Unlimited one-time reminders',
      '100+ languages supported',
      'ChatGPT',
      '100 Voice Notes / Month',
      'Create Lists',
      'Send/Receive reminders with friends',
      'Google Calendar',
      'Expense tracking',
      'Repeat reminders',
      '20 Image Analysis / Month',
      '20 Internet Searches'
    ]
  },
  ultimate: {
    name: 'Ultimate Plan',
    monthlyPrice: 14,
    yearlyPrice: 13,
    popular: false,
    features: [
      'Unlimited messages',
      'Unlimited one-time reminders',
      '100+ languages supported',
      'ChatGPT',
      '500 Voice Notes / Month',
      'Create Lists',
      'Send/Receive reminders with friends',
      'Google Calendar',
      'Expense tracking',
      'Repeat reminders',
      'Food Tracking (Calories)',
      '100 Image Analysis / Month',
      '100 Internet Searches'
    ]
  }
}

export default function RegisterPage() {
  const searchParams = useSearchParams()

  const [registrationCode, setRegistrationCode] = useState<string>('')
  const [step, setStep] = useState<Step>('plan')
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('executive')
  const [billingType, setBillingType] = useState<Billing>('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile once on client
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Read code from URL
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      setRegistrationCode(code)
    } else {
      // אין קוד? נחזיר לדף הבית
      window.location.href = '/'
    }
  }, [searchParams])

  const handlePlanSelection = () => setStep('payment')

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      const plan = PLANS[selectedPlan]
      const price =
        billingType === 'yearly' ? plan.yearlyPrice.toString() : plan.monthlyPrice.toString()

      const url = new URL(window.location.origin + '/payment/checkout')
      url.searchParams.set('plan', selectedPlan)
      url.searchParams.set('price', price)          // זה סכום החיוב החוזר לאחר ה־trial
      url.searchParams.set('billing', billingType)
      url.searchParams.set('code', registrationCode)
      url.searchParams.set('planName', plan.name)

      window.location.href = url.toString()
    } catch (e) {
      console.error('Redirect to checkout failed:', e)
      alert('שגיאה במעבר לדף התשלום')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleOAuth = () => {
    const clientId =
      '314964896562-o93h71h2cpiqgcikaqeg2a34ht2ipl2j.apps.googleusercontent.com'
    const redirectUri = encodeURIComponent(
      'https://n8n-td2y.sliplane.app/webhook/google-oauth-callback'
    )
    const scopes = encodeURIComponent(
      ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/calendar'].join(' ')
    )
    const state = encodeURIComponent(registrationCode)

    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}` +
      `&response_type=code&access_type=offline&prompt=consent&state=${state}`

    window.location.href = googleAuthUrl
  }

  if (!registrationCode) {
    return null
  }

  const plan = PLANS[selectedPlan]

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)'
      }}
    >
      {/* Header */}
      <header
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          padding: '1rem 0'
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: isMobile ? '0 1rem' : '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '.75rem',
              textDecoration: 'none'
            }}
          >
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{
                width: isMobile ? 60 : 80,
                height: isMobile ? 60 : 80,
                objectFit: 'contain'
              }}
            />
            <span
              style={{
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                fontWeight: 600,
                color: '#2d5016'
              }}
            >
              Yaya
            </span>
          </a>

          {step === 'payment' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#4a5568'
              }}
            >
              <Shield size={16} />
              {!isMobile && <span style={{ fontSize: '.9rem' }}>Secure Registration</span>}
            </div>
          )}
        </div>
      </header>

      <main style={{ padding: isMobile ? '1.5rem 0' : '2rem 0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem' }}>
          {/* Progress */}
          <div style={{ marginBottom: isMobile ? '2rem' : '3rem', textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? '0.5rem' : '1rem',
                marginBottom: '1rem'
              }}
            >
              <div
                style={{
                  width: isMobile ? 32 : 40,
                  height: isMobile ? 32 : 40,
                  borderRadius: '50%',
                  background: step === 'plan' ? '#8B5E3C' : '#c3d9c6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: isMobile ? '.875rem' : '1rem'
                }}
              >
                1
              </div>
              <div
                style={{
                  width: isMobile ? 40 : 100,
                  height: 4,
                  background: step !== 'plan' ? '#8B5E3C' : '#c3d9c6',
                  borderRadius: 2
                }}
              />
              <div
                style={{
                  width: isMobile ? 32 : 40,
                  height: isMobile ? 32 : 40,
                  borderRadius: '50%',
                  background: step !== 'plan' ? '#8B5E3C' : '#c3d9c6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: isMobile ? '.875rem' : '1rem'
                }}
              >
                2
              </div>
              <div
                style={{
                  width: isMobile ? 40 : 100,
                  height: 4,
                  background: step === 'oauth' ? '#8B5E3C' : '#c3d9c6',
                  borderRadius: 2
                }}
              />
              <div
                style={{
                  width: isMobile ? 32 : 40,
                  height: isMobile ? 32 : 40,
                  borderRadius: '50%',
                  background: step === 'oauth' ? '#8B5E3C' : '#c3d9c6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: isMobile ? '.875rem' : '1rem'
                }}
              >
                3
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: isMobile ? '2rem' : '6rem',
                fontSize: isMobile ? '.75rem' : '.9rem',
                color: '#8B5E3C',
                fontWeight: 500
              }}
            >
              <span>Choose Plan</span>
              <span>Payment</span>
              <span>Connect</span>
            </div>
          </div>

          {/* Step 1 – Plan selection */}
          {step === 'plan' && (
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
                <h1
                  style={{
                    fontSize: isMobile ? '2rem' : '3rem',
                    fontWeight: 400,
                    color: '#8B5E3C',
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Choose Your Plan
                </h1>

                <p
                  style={{
                    fontSize: isMobile ? '1rem' : '1.2rem',
                    color: '#718096',
                    marginBottom: '2rem'
                  }}
                >
                  Select the perfect plan for your needs. Start your 7-day free trial today.
                </p>

                <div
                  style={{
                    background: 'rgba(37, 211, 102, 0.1)',
                    borderRadius: 12,
                    padding: isMobile ? '.75rem' : '1rem',
                    border: '1px solid rgba(37, 211, 102, 0.3)',
                    display: 'inline-block',
                    fontSize: isMobile ? '.875rem' : '1rem'
                  }}
                >
                  <p style={{ color: '#25d366', fontWeight: 600, margin: 0 }}>
                    ✅ Registration Code: {registrationCode}
                  </p>
                </div>
              </div>

              {/* Billing toggle */}
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  justifyContent: 'center',
                  marginBottom: '3rem',
                  background: '#f7fafc',
                  borderRadius: 8,
                  padding: 4,
                  width: 'fit-content',
                  marginInline: 'auto',
                  cursor: 'pointer'
                }}
              >
                <span
                  onClick={() => setBillingType('monthly')}
                  style={{
                    background: billingType === 'monthly' ? 'white' : 'transparent',
                    color: billingType === 'monthly' ? '#8B5E3C' : '#999',
                    padding: isMobile ? '6px 12px' : '8px 20px',
                    borderRadius: 6,
                    fontSize: isMobile ? '.875rem' : '1rem',
                    fontWeight: 500,
                    boxShadow: billingType === 'monthly' ? '0 2px 4px rgba(0,0,0,.1)' : 'none'
                  }}
                >
                  Monthly Billing
                </span>
                <span
                  onClick={() => setBillingType('yearly')}
                  style={{
                    background: billingType === 'yearly' ? 'white' : 'transparent',
                    color: billingType === 'yearly' ? '#8B5E3C' : '#999',
                    padding: isMobile ? '6px 12px' : '8px 20px',
                    borderRadius: 6,
                    fontSize: isMobile ? '.875rem' : '1rem',
                    fontWeight: 500,
                    boxShadow: billingType === 'yearly' ? '0 2px 4px rgba(0,0,0,.1)' : 'none'
                  }}
                >
                  Yearly Billing
                </span>
              </div>

              {/* Plan cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: isMobile ? '1.5rem' : '2rem',
                  marginBottom: '3rem'
                }}
              >
                {(Object.keys(PLANS) as PlanKey[]).map((key) => {
                  const item = PLANS[key]
                  const isSelected = selectedPlan === key
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedPlan(key)}
                      style={{
                        background: isSelected ? 'rgba(139, 94, 60, 0.1)' : '#F5F1EB',
                        borderRadius: 20,
                        padding: isMobile ? '1.5rem' : '2.5rem 2rem',
                        textAlign: 'left',
                        position: 'relative',
                        border: item.popular
                          ? '2px solid #8B5E3C'
                          : isSelected
                          ? '2px solid #8B5E3C'
                          : '1px solid #E5DDD5',
                        transform: item.popular ? 'scale(1.02)' : 'none',
                        cursor: 'pointer',
                        transition: 'all .3s ease',
                        boxShadow: '0 4px 6px rgba(0,0,0,.05)'
                      }}
                    >
                      {item.popular && (
                        <div
                          style={{
                            position: 'absolute',
                            top: isMobile ? '.75rem' : '1rem',
                            right: isMobile ? '.75rem' : '1rem',
                            background: '#8B5E3C',
                            color: 'white',
                            padding: isMobile ? '3px 8px' : '4px 12px',
                            borderRadius: 12,
                            fontSize: isMobile ? '.625rem' : '.75rem',
                            fontWeight: 500
                          }}
                        >
                          MOST POPULAR
                        </div>
                      )}

                      <div
                        style={{
                          fontSize: '.9rem',
                          color: '#8B5E3C',
                          fontWeight: 500,
                          marginBottom: '.5rem',
                          textTransform: 'uppercase',
                          letterSpacing: '.05em'
                        }}
                      >
                        {item.name.toUpperCase()}
                      </div>

                      <div
                        style={{
                          fontSize: isMobile ? '2.5rem' : '3.5rem',
                          fontWeight: 300,
                          color: '#8B5E3C',
                          marginBottom: '1rem',
                          lineHeight: 1,
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 8
                        }}
                      >
                        ${billingType === 'yearly' ? item.yearlyPrice : item.monthlyPrice}
                        <span style={{ fontSize: isMobile ? '.875rem' : '1rem', fontWeight: 400 }}>
                          /month
                        </span>
                      </div>

                      {billingType === 'yearly' && (
                        <div
                          style={{
                            fontSize: '.85rem',
                            color: '#25d366',
                            fontWeight: 600,
                            marginBottom: '1.5rem'
                          }}
                        >
                          💰 Save ${(item.monthlyPrice - item.yearlyPrice) * 12}/year
                        </div>
                      )}

                      <div style={{ marginBottom: '2rem' }}>
                        {item.features.map((f, i) => (
                          <div
                            key={i}
                            style={{
                              color: '#8B5E3C',
                              marginBottom: '.75rem',
                              fontSize: isMobile ? '.875rem' : '.95rem',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 8
                            }}
                          >
                            <span style={{ color: '#25d366', fontSize: '1rem', fontWeight: 600 }}>
                              ✓
                            </span>
                            {f}
                          </div>
                        ))}
                      </div>

                      {isSelected && (
                        <div
                          style={{
                            background: '#8B5E3C',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: 6,
                            textAlign: 'center',
                            fontSize: '.9rem',
                            fontWeight: 500,
                            marginBottom: '1rem'
                          }}
                        >
                          ✓ Selected
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handlePlanSelection}
                  style={{
                    padding: isMobile ? '.875rem 2rem' : '1rem 3rem',
                    background: '#8B5E3C',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 94, 60, .3)',
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  Continue with {plan.name}
                </button>
              </div>
            </div>
          )}

          {/* Step 2 – Payment (summary & redirect) */}
          {step === 'payment' && (
            <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
              <button
                onClick={() => setStep('plan')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'transparent',
                  border: 'none',
                  color: '#8B5E3C',
                  fontSize: isMobile ? '.875rem' : '.9rem',
                  cursor: 'pointer',
                  marginBottom: '2rem'
                }}
              >
                ← Back to Plan Selection
              </button>

              <h1
                style={{
                  fontSize: isMobile ? '1.875rem' : '2.5rem',
                  fontWeight: 400,
                  color: '#8B5E3C',
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em'
                }}
              >
                Secure Payment
              </h1>

              <div
                style={{
                  background: '#F5F1EB',
                  borderRadius: 20,
                  padding: isMobile ? '1.5rem' : '2rem',
                  border: '1px solid #E5DDD5',
                  marginBottom: '2rem'
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? '1.1rem' : '1.2rem',
                    fontWeight: 600,
                    color: '#8B5E3C',
                    marginBottom: '1.5rem'
                  }}
                >
                  Order Summary
                </h3>

                <div style={{ textAlign: 'left', marginBottom: '1.5rem', color: '#8B5E3C' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '.5rem',
                      fontSize: isMobile ? '.875rem' : '1rem'
                    }}
                  >
                    <span>
                      <strong>Plan:</strong> {plan.name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                      fontSize: isMobile ? '.875rem' : '1rem'
                    }}
                  >
                    <span>
                      <strong>Billing:</strong> {billingType === 'yearly' ? 'Annual' : 'Monthly'}
                    </span>
                  </div>
                </div>

                {/* Trial today = $0 */}
                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '.5rem',
                      color: '#8B5E3C',
                      fontSize: isMobile ? '.875rem' : '1rem'
                    }}
                  >
                    <span>7-day free trial</span>
                    <span style={{ color: '#25d366', fontWeight: 600 }}>$0.00</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#8B5E3C',
                      fontSize: isMobile ? '.875rem' : '1rem'
                    }}
                  >
                    <span>
                      Then ${billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}/
                      {billingType === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 600,
                      fontSize: isMobile ? '1rem' : '1.1rem',
                      color: '#2d5016'
                    }}
                  >
                    <span>Total today</span>
                    <span style={{ color: '#25d366' }}>$0.00</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: isMobile ? '.875rem 1.5rem' : '1rem 2rem',
                  background: isLoading ? '#9ca3af' : '#8B5E3C',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <CreditCard size={20} />
                {isLoading ? 'Processing...' : 'Start Free Trial'}
              </button>

              <p
                style={{
                  fontSize: isMobile ? '.75rem' : '.8rem',
                  color: '#8B5E3C',
                  textAlign: 'center',
                  marginTop: '1rem',
                  opacity: 0.8
                }}
              >
                By continuing, you agree to our Terms of Service and Privacy Policy. Your trial
                starts today and you can cancel anytime before it ends.
              </p>
            </div>
          )}

          {/* Step 3 – OAuth */}
          {step === 'oauth' && (
            <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ marginBottom: '2rem' }}>
                <CheckCircle size={isMobile ? 60 : 80} style={{ color: '#25d366', margin: '0 auto' }} />
              </div>

              <h1
                style={{
                  fontSize: isMobile ? '1.875rem' : '2.5rem',
                  fontWeight: 400,
                  color: '#8B5E3C',
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em'
                }}
              >
                🎉 Payment Successful!
              </h1>

              <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: '#718096', marginBottom: '3rem' }}>
                Now connect your Google account to enable smart calendar features and complete your setup.
              </p>

              <div
                style={{
                  background: '#F5F1EB',
                  borderRadius: 20,
                  padding: isMobile ? '1.5rem' : '2rem',
                  border: '1px solid #E5DDD5',
                  marginBottom: '2rem'
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? '1.1rem' : '1.2rem',
                    fontWeight: 600,
                    color: '#8B5E3C',
                    marginBottom: '1rem'
                  }}
                >
                  Why Connect Google?
                </h3>
                <div style={{ textAlign: 'left', color: '#8B5E3C', fontSize: isMobile ? '.875rem' : '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
                    <Calendar size={16} />
                    <span>Sync with your Google Calendar</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
                    <Bell size={16} />
                    <span>Smart reminders and scheduling</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                    <MessageCircle size={16} />
                    <span>Seamless WhatsApp integration</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoogleOAuth}
                style={{
                  width: '100%',
                  padding: isMobile ? '.875rem 1.5rem' : '1rem 2rem',
                  background: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '.5rem',
                  marginBottom: '1rem'
                }}
              >
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
              </button>

              <p style={{ fontSize: isMobile ? '.75rem' : '.8rem', color: '#718096', textAlign: 'center' }}>
                Your data is encrypted and only used to help you manage your day via WhatsApp.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
