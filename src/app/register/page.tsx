'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, MessageCircle, Calendar, Bell, Shield, CreditCard } from 'lucide-react'

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const [registrationCode, setRegistrationCode] = useState<string | null>(null)
  const [step, setStep] = useState<'plan' | 'payment' | 'oauth'>('plan')
  const [selectedPlan, setSelectedPlan] = useState('executive')
  const [billingType, setBillingType] = useState('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const plans = {
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

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      setRegistrationCode(code)
    } else {
      window.location.href = '/'
    }
  }, [searchParams])

  const handlePlanSelection = () => {
    setStep('payment')
  }

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      const checkoutUrl = new URL(window.location.origin + '/payment/checkout')
      checkoutUrl.searchParams.set('plan', selectedPlan)
      checkoutUrl.searchParams.set('price', billingType === 'yearly' 
        ? plans[selectedPlan as keyof typeof plans].yearlyPrice.toString()
        : plans[selectedPlan as keyof typeof plans].monthlyPrice.toString()
      )
      checkoutUrl.searchParams.set('billing', billingType)
      checkoutUrl.searchParams.set('code', registrationCode || '')
      checkoutUrl.searchParams.set('planName', plans[selectedPlan as keyof typeof plans].name)
      
      window.location.href = checkoutUrl.toString()
      
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      alert('שגיאה במעבר לדף התשלום')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleOAuth = () => {
    const clientId = '314964896562-o93h71h2cpiqgcikaqeg2a34ht2ipl2j.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('https://n8n-td2y.sliplane.app/webhook/google-oauth-callback');
    
    const scopes = encodeURIComponent([
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/calendar'
    ].join(' '));
    
    const state = encodeURIComponent(registrationCode || '');
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scopes}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${state}`;
      
    window.location.href = googleAuthUrl;
  };

  if (!registrationCode) {
    return (
      <div style={{ 
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{ 
          background: '#F5F1EB', 
          borderRadius: '20px', 
          padding: isMobile ? '2rem 1.5rem' : '3rem 2rem', 
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          border: '1px solid #E5DDD5'
        }}>
          <h1 style={{ 
            fontSize: isMobile ? '1.5rem' : '2rem', 
            fontWeight: '600', 
            color: '#8B5E3C', 
            marginBottom: '1rem' 
          }}>
            Access Denied
          </h1>
          <p style={{ 
            color: '#8B5E3C', 
            marginBottom: '2rem', 
            fontSize: isMobile ? '0.95rem' : '1.1rem',
            opacity: 0.8 
          }}>
            You need to receive a registration link from our WhatsApp bot to access this page.
          </p>
          <a 
            href="/" 
            style={{ 
              background: '#8B5E3C',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-block',
              transition: 'all 0.2s ease'
            }}
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)' 
    }}>
      <header style={{ 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid rgba(0,0,0,0.05)', 
        padding: '1rem 0' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: isMobile ? '0 1rem' : '0 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <a href="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            textDecoration: 'none' 
          }}>
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ width: isMobile ? '60px' : '80px', height: isMobile ? '60px' : '80px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: '600', color: '#2d5016' }}>Yaya</span>
          </a>
          {step === 'payment' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a5568' }}>
              <Shield size={16} />
              {!isMobile && <span style={{ fontSize: '0.9rem' }}>Secure Registration</span>}
            </div>
          )}
        </div>
      </header>

      <main style={{ padding: isMobile ? '1.5rem 0' : '2rem 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem' }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: isMobile ? '2rem' : '3rem', textAlign: 'center' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: isMobile ? '0.5rem' : '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: isMobile ? '32px' : '40px',
                height: isMobile ? '32px' : '40px',
                borderRadius: '50%',
                background: step === 'plan' ? '#8B5E3C' : '#c3d9c6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>1</div>
              <div style={{ width: isMobile ? '40px' : '100px', height: '4px', background: step !== 'plan' ? '#8B5E3C' : '#c3d9c6', borderRadius: '2px' }}></div>
              <div style={{
                width: isMobile ? '32px' : '40px',
                height: isMobile ? '32px' : '40px',
                borderRadius: '50%',
                background: step === 'payment' ? '#8B5E3C' : (step === 'oauth') ? '#8B5E3C' : '#c3d9c6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>2</div>
              <div style={{ width: isMobile ? '40px' : '100px', height: '4px', background: step === 'oauth' ? '#8B5E3C' : '#c3d9c6', borderRadius: '2px' }}></div>
              <div style={{
                width: isMobile ? '32px' : '40px',
                height: isMobile ? '32px' : '40px',
                borderRadius: '50%',
                background: step === 'oauth' ? '#8B5E3C' : '#c3d9c6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>3</div>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: isMobile ? '2rem' : '6rem',
              fontSize: isMobile ? '0.75rem' : '0.9rem', 
              color: '#8B5E3C',
              fontWeight: '500'
            }}>
              <span>Choose Plan</span>
              <span>Payment</span>
              <span>Connect</span>
            </div>
          </div>

          {/* Step 1: Plan Selection */}
          {step === 'plan' && (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
                <h1 style={{ 
                  fontSize: isMobile ? '2rem' : '3rem', 
                  fontWeight: '400', 
                  color: '#8B5E3C', 
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em'
                }}>
                  Choose Your Plan
                </h1>
                <p style={{ 
                  fontSize: isMobile ? '1rem' : '1.2rem', 
                  color: '#718096', 
                  marginBottom: '2rem'
                }}>
                  Select the perfect plan for your needs. Start your 7-day free trial today.
                </p>
                
                <div style={{ 
                  background: 'rgba(37, 211, 102, 0.1)', 
                  borderRadius: '12px', 
                  padding: isMobile ? '0.75rem' : '1rem', 
                  border: '1px solid rgba(37, 211, 102, 0.3)',
                  display: 'inline-block',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  <p style={{ 
                    color: '#25d366', 
                    fontWeight: '600',
                    margin: '0'
                  }}>
                    ✅ Registration Code: {registrationCode}
                  </p>
                </div>
              </div>

              {/* Billing Toggle */}
              <div style={{
                display: 'flex',
                gap: '4px',
                justifyContent: 'center',
                marginBottom: '3rem',
                background: '#f7fafc',
                borderRadius: '8px',
                padding: '4px',
                width: 'fit-content',
                margin: '0 auto 3rem',
                cursor: 'pointer'
              }}>
                <span 
                  onClick={() => setBillingType('monthly')}
                  style={{
                    background: billingType === 'monthly' ? 'white' : 'transparent',
                    color: billingType === 'monthly' ? '#8B5E3C' : '#999',
                    padding: isMobile ? '6px 12px' : '8px 20px',
                    borderRadius: '6px',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    fontWeight: '500',
                    boxShadow: billingType === 'monthly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
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
                    borderRadius: '6px',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    fontWeight: '500',
                    boxShadow: billingType === 'yearly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Yearly Billing
                </span>
              </div>

              {/* Plan Cards */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: isMobile ? '1.5rem' : '2rem', 
                marginBottom: '3rem' 
              }}>
                {Object.entries(plans).map(([planId, plan]) => (
                  <div
                    key={planId}
                    onClick={() => setSelectedPlan(planId)}
                    style={{
                      background: selectedPlan === planId ? 'rgba(139, 94, 60, 0.1)' : '#F5F1EB',
                      borderRadius: '20px',
                      padding: isMobile ? '1.5rem' : '2.5rem 2rem',
                      textAlign: 'left',
                      position: 'relative',
                      border: plan.popular ? '2px solid #8B5E3C' : selectedPlan === planId ? '2px solid #8B5E3C' : '1px solid #E5DDD5',
                      transform: plan.popular ? 'scale(1.02)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = plan.popular ? 'scale(1.05)' : 'scale(1.02)'
                        e.currentTarget.style.boxShadow = '0 20px 25px rgba(139, 94, 60, 0.15)'
                        e.currentTarget.style.border = '2px solid #8B5E3C'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = plan.popular ? 'scale(1.02)' : 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)'
                        e.currentTarget.style.border = plan.popular ? '2px solid #8B5E3C' : selectedPlan === planId ? '2px solid #8B5E3C' : '1px solid #E5DDD5'
                      }
                    }}
                  >
                    {plan.popular && (
                      <div style={{
                        position: 'absolute',
                        top: isMobile ? '0.75rem' : '1rem',
                        right: isMobile ? '0.75rem' : '1rem',
                        background: '#8B5E3C',
                        color: 'white',
                        padding: isMobile ? '3px 8px' : '4px 12px',
                        borderRadius: '12px',
                        fontSize: isMobile ? '0.625rem' : '0.75rem',
                        fontWeight: '500'
                      }}>
                        MOST POPULAR
                      </div>
                    )}

                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: '#8B5E3C', 
                      fontWeight: '500', 
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {plan.name.toUpperCase()}
                    </div>

                    <div style={{ 
                      fontSize: isMobile ? '2.5rem' : '3.5rem', 
                      fontWeight: '300', 
                      color: '#8B5E3C', 
                      marginBottom: '1rem',
                      lineHeight: '1',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px'
                    }}>
                      ${billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                      <span style={{ fontSize: isMobile ? '0.875rem' : '1rem', fontWeight: '400' }}>/month</span>
                    </div>

                    {billingType === 'yearly' && (
                      <div style={{ 
                        fontSize: '0.85rem', 
                        color: '#25d366', 
                        fontWeight: '600', 
                        marginBottom: '1.5rem'
                      }}>
                        💰 Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                      </div>
                    )}
                    
                    <div style={{ marginBottom: '2rem' }}>
                      {plan.features.map((feature, index) => (
                        <div key={index} style={{ 
                          color: '#8B5E3C', 
                          marginBottom: '0.75rem', 
                          fontSize: isMobile ? '0.875rem' : '0.95rem', 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '8px' 
                        }}>
                          <span style={{ color: '#25d366', fontSize: '1rem', fontWeight: '600' }}>✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {selectedPlan === planId && (
                      <div style={{
                        background: '#8B5E3C',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        marginBottom: '1rem'
                      }}>
                        ✓ Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handlePlanSelection}
                  style={{
                    padding: isMobile ? '0.875rem 2rem' : '1rem 3rem',
                    background: '#8B5E3C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(139, 94, 60, 0.3)',
                    width: isMobile ? '100%' : 'auto'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#7c4a32'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#8B5E3C'}
                >
                  Continue with {plans[selectedPlan as keyof typeof plans].name}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <button
                onClick={() => setStep('plan')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#8B5E3C',
                  fontSize: isMobile ? '0.875rem' : '0.9rem',
                  cursor: 'pointer',
                  marginBottom: '2rem'
                }}
              >
                ← Back to Plan Selection
              </button>

              <h1 style={{ 
                fontSize: isMobile ? '1.875rem' : '2.5rem', 
                fontWeight: '400', 
                color: '#8B5E3C', 
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                Secure Payment
              </h1>

              <div style={{ 
                background: '#F5F1EB', 
                borderRadius: '20px', 
                padding: isMobile ? '1.5rem' : '2rem', 
                border: '1px solid #E5DDD5',
                marginBottom: '2rem'
              }}>
                <h3 style={{ 
                  fontSize: isMobile ? '1.1rem' : '1.2rem', 
                  fontWeight: '600', 
                  color: '#8B5E3C', 
                  marginBottom: '1.5rem' 
                }}>
                  Order Summary
                </h3>
                
                <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                    <span><strong>Plan:</strong> {plans[selectedPlan as keyof typeof plans].name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#8B5E3C', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                    <span><strong>Billing:</strong> {billingType === 'yearly' ? 'Annual' : 'Monthly'}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                    <span>7-day free trial</span>
                    <span style={{ color: '#25d366', fontWeight: '600' }}>$0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8B5E3C', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                    <span>Then ${billingType === 'yearly' ? plans[selectedPlan as keyof typeof plans].yearlyPrice : plans[selectedPlan as keyof typeof plans].monthlyPrice}/{billingType === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: isMobile ? '1rem' : '1.1rem', color: '#8B5E3C' }}>
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
                  padding: isMobile ? '0.875rem 1.5rem' : '1rem 2rem',
                  background: isLoading ? '#9ca3af' : '#8B5E3C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <CreditCard size={20} />
                {isLoading ? 'Processing...' : 'Start Free Trial'}
              </button>

              <p style={{ fontSize: isMobile ? '0.75rem' : '0.8rem', color: '#8B5E3C', textAlign: 'center', marginTop: '1rem', opacity: 0.8 }}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
                Your trial starts today and you can cancel anytime before it ends.
              </p>
            </div>
          )}

          {/* Step 3: OAuth */}
          {step === 'oauth' && (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ marginBottom: '2rem' }}>
                <CheckCircle size={isMobile ? 60 : 80} style={{ color: '#25d366', margin: '0 auto' }} />
              </div>

              <h1 style={{ 
                fontSize: isMobile ? '1.875rem' : '2.5rem', 
                fontWeight: '400', 
                color: '#8B5E3C', 
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                🎉 Payment Successful!
              </h1>

              <p style={{ 
                fontSize: isMobile ? '1rem' : '1.2rem', 
                color: '#718096', 
                marginBottom: '3rem'
              }}>
                Now connect your Google account to enable smart calendar features and complete your setup.
              </p>

              <div style={{ 
                background: '#F5F1EB', 
                borderRadius: '20px', 
                padding: isMobile ? '1.5rem' : '2rem', 
                border: '1px solid #E5DDD5',
                marginBottom: '2rem'
              }}>
                <h3 style={{ 
                  fontSize: isMobile ? '1.1rem' : '1.2rem', 
                  fontWeight: '600', 
                  color: '#8B5E3C', 
                  marginBottom: '1rem' 
                }}>
                  Why Connect Google?
                </h3>
                <div style={{ textAlign: 'left', color: '#8B5E3C', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Calendar size={16} />
                    <span>Sync with your Google Calendar</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Bell size={16} />
                    <span>Smart reminders and scheduling</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageCircle size={16} />
                    <span>Seamless WhatsApp integration</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoogleOAuth}
                style={{
                  width: '100%',
                  padding: isMobile ? '0.875rem 1.5rem' : '1rem 2rem',
                  background: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Connect Google Account
              </button>

              <p style={{ fontSize: isMobile ? '0.75rem' : '0.8rem', color: '#718096', textAlign: 'center' }}>
                Your data is encrypted and only used to help you manage your day via WhatsApp.
              </p>

              <div style={{ 
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(37, 211, 102, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(37, 211, 102, 0.2)'
              }}>
                <p style={{ 
                  color: '#25d366', 
                  fontSize: isMobile ? '0.875rem' : '0.9rem',
                  margin: '0'
                }}>
                  💡 <strong>Next:</strong> After connecting Google, you'll receive a confirmation code to send to our WhatsApp bot at +972 55-994-3649
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
