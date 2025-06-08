'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, MessageCircle, Calendar, Bell, ArrowLeft, Shield, CreditCard } from 'lucide-react'

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const [registrationCode, setRegistrationCode] = useState<string | null>(null)
  const [step, setStep] = useState<'form' | 'payment' | 'oauth'>('form')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+972'
  })
  const [selectedPlan, setSelectedPlan] = useState('executive')
  const [billingType, setBillingType] = useState('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const countries = [
    { code: '+972', name: 'Israel', flag: '🇮🇱' },
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' }
  ]

  const plans = {
    executive: {
      name: 'Executive Plan',
      monthlyPrice: 5,
      yearlyPrice: 4,
      features: [
        'Unlimited messages',
        'Unlimited one-time reminders',
        '100+ languages supported',
        'ChatGPT',
        'Repeat reminders',
        'Google / Outlook Calendar',
        '100 Voice Notes / Month',
        '20 Image Analysis / Month',
        '20 Internet Searches',
        'Send/Receive reminders with friends',
        'AI Memory of You',
        'Create Lists'
      ]
    },
    ultimate: {
      name: 'Ultimate Plan',
      monthlyPrice: 14,
      yearlyPrice: 13,
      features: [
        'Unlimited messages',
        'Unlimited one-time reminders',
        '100+ languages supported',
        'ChatGPT',
        'Repeat reminders',
        'Google / Outlook Calendar',
        '500 Voice Notes / Month',
        '100 Image Analysis / Month',
        '100 Internet Searches',
        'Send/Receive reminders with friends',
        'AI Memory of You',
        'Create Lists'
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setStep('payment')
  }

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('https://yairsabag.app.n8n.cloud/webhook-test/whatsapp-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formData.countryCode + formData.phone,
          email: formData.email,
          name: formData.name,
          plan: selectedPlan,
          registration_code: registrationCode,
          billing_type: billingType,
          price: billingType === 'yearly' ? plans[selectedPlan as keyof typeof plans].yearlyPrice : plans[selectedPlan as keyof typeof plans].monthlyPrice
        })
      })
      
      console.log('Webhook response:', response.status)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep('oauth')
    } catch (error) {
      console.error('Payment error:', error)
      setStep('oauth')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleOAuth = () => {
    const googleOAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleOAuthUrl.searchParams.set('client_id', '314964896562-o93h71h2cpiqgcikaqeg2a34ht2ipl2j.apps.googleusercontent.com')
    googleOAuthUrl.searchParams.set('redirect_uri', 'https://yairsabag.app.n8n.cloud/webhook/google-oauth-callback')
    googleOAuthUrl.searchParams.set('response_type', 'code')
    googleOAuthUrl.searchParams.set('scope', 'openid email https://www.googleapis.com/auth/calendar')
    googleOAuthUrl.searchParams.set('state', JSON.stringify({
      registrationCode,
      formData,
      plan: selectedPlan,
      billing: billingType
    }))

    window.location.href = googleOAuthUrl.toString()
  }

  if (!registrationCode) {
    return (
      <div style={{ 
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          background: '#F5F1EB', 
          borderRadius: '20px', 
          padding: '3rem 2rem', 
          textAlign: 'center',
          maxWidth: '500px',
          border: '1px solid #E5DDD5'
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '600', 
            color: '#8B5E3C', 
            marginBottom: '1rem' 
          }}>
            Access Denied
          </h1>
          <p style={{ 
            color: '#8B5E3C', 
            marginBottom: '2rem', 
            fontSize: '1.1rem',
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
          padding: '0 2rem', 
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
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016' }}>Yaya</span>
          </a>
          {step === 'payment' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a5568' }}>
              <Shield size={16} />
              <span style={{ fontSize: '0.9rem' }}>Secure Registration</span>
            </div>
          )}
        </div>
      </header>

      <main style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step === 'form' ? '#8B5E3C' : '#c3d9c6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>1</div>
              <div style={{ width: '100px', height: '4px', background: step !== 'form' ? '#8B5E3C' : '#c3d9c6', borderRadius: '2px' }}></div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step === 'payment' ? '#8B5E3C' : (step === 'oauth') ? '#8B5E3C' : '#c3d9c6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>2</div>
              <div style={{ width: '100px', height: '4px', background: step === 'oauth' ? '#8B5E3C' : '#c3d9c6', borderRadius: '2px' }}></div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step === 'oauth' ? '#8B5E3C' : '#c3d9c6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>3</div>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '6rem',
              fontSize: '0.9rem', 
              color: '#8B5E3C',
              fontWeight: '500'
            }}>
              <span>Details</span>
              <span>Payment</span>
              <span>Connect</span>
            </div>
          </div>

          {step === 'form' && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ 
                  fontSize: '3rem', 
                  fontWeight: '400', 
                  color: '#8B5E3C', 
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em'
                }}>
                  Complete Your Registration
                </h1>
                <p style={{ 
                  fontSize: '1.2rem', 
                  color: '#718096', 
                  marginBottom: '2rem'
                }}>
                  You're almost there! Fill in your details to activate your Yaya Assistant.
                </p>
                
                <div style={{ 
                  background: 'rgba(37, 211, 102, 0.1)', 
                  borderRadius: '12px', 
                  padding: '1rem', 
                  border: '1px solid rgba(37, 211, 102, 0.3)',
                  display: 'inline-block'
                }}>
                  <p style={{ 
                    color: '#25d366', 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    margin: '0'
                  }}>
                    ✅ Registration Code: {registrationCode}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                <div>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    color: '#8B5E3C', 
                    marginBottom: '1.5rem' 
                  }}>
                    Choose Your Plan
                  </h2>

                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    background: '#f7fafc',
                    borderRadius: '8px',
                    padding: '4px',
                    width: 'fit-content',
                    cursor: 'pointer'
                  }}>
                    <span 
                      onClick={() => setBillingType('monthly')}
                      style={{
                        background: billingType === 'monthly' ? 'white' : 'transparent',
                        color: billingType === 'monthly' ? '#8B5E3C' : '#999',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        boxShadow: billingType === 'monthly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Monthly
                    </span>
                    <span 
                      onClick={() => setBillingType('yearly')}
                      style={{
                        background: billingType === 'yearly' ? 'white' : 'transparent',
                        color: billingType === 'yearly' ? '#8B5E3C' : '#999',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        boxShadow: billingType === 'yearly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Yearly
                    </span>
                  </div>

                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {Object.entries(plans).map(([planId, plan]) => (
                      <div
                        key={planId}
                        onClick={() => setSelectedPlan(planId)}
                        style={{
                          background: selectedPlan === planId ? 'rgba(139, 94, 60, 0.1)' : '#F5F1EB',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          border: selectedPlan === planId ? '2px solid #8B5E3C' : '1px solid #E5DDD5',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: '#8B5E3C', 
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {plan.name}
                          </span>
                          {planId === 'executive' && (
                            <span style={{
                              background: '#8B5E3C',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '8px',
                              fontSize: '0.7rem',
                              fontWeight: '500',
                              marginLeft: '0.5rem'
                            }}>
                              POPULAR
                            </span>
                          )}
                        </div>
                        <div style={{ 
                          fontSize: '2rem', 
                          fontWeight: '300', 
                          color: '#8B5E3C', 
                          marginBottom: '1rem'
                        }}>
                          ${billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                          <span style={{ fontSize: '0.8rem', fontWeight: '400' }}>/month</span>
                        </div>
                        {selectedPlan === planId && (
                          <div style={{
                            background: '#8B5E3C',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            ✓ Selected
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    color: '#8B5E3C', 
                    marginBottom: '1.5rem' 
                  }}>
                    Your Details
                  </h2>

                  <form onSubmit={handleFormSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        color: '#8B5E3C', 
                        marginBottom: '0.5rem' 
                      }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: errors.name ? '1px solid #ef4444' : '1px solid #E5DDD5',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          background: 'white'
                        }}
                        placeholder="John Doe"
                      />
                      {errors.name && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>{errors.name}</p>}
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        color: '#8B5E3C', 
                        marginBottom: '0.5rem' 
                      }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: errors.email ? '1px solid #ef4444' : '1px solid #E5DDD5',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          background: 'white'
                        }}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>{errors.email}</p>}
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        color: '#8B5E3C', 
                        marginBottom: '0.5rem' 
                      }}>
                        Phone Number *
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          value={formData.countryCode}
                          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                          style={{
                            padding: '0.75rem 0.5rem',
                            border: '1px solid #E5DDD5',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            background: 'white',
                            minWidth: '100px'
                          }}
                        >
                          {countries.map((country) => (
                            <option key={`${country.code}-${country.name}`} value={country.code}>
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: errors.phone ? '1px solid #ef4444' : '1px solid #E5DDD5',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            background: 'white'
                          }}
                          placeholder="50-123-4567"
                        />
                      </div>
                      {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>{errors.phone}</p>}
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#8B5E3C',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Continue to Payment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <button
                onClick={() => setStep('form')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#8B5E3C',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginBottom: '2rem'
                }}
              >
                <ArrowLeft size={16} />
                Back to Details
              </button>

              <h1 style={{ 
                fontSize: '2.5rem', 
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
                padding: '2rem', 
                border: '1px solid #E5DDD5',
                marginBottom: '2rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  color: '#8B5E3C', 
                  marginBottom: '1.5rem' 
                }}>
                  Order Summary
                </h3>
                
                <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C' }}>
                    <span><strong>Plan:</strong> {plans[selectedPlan as keyof typeof plans].name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C' }}>
                    <span><strong>Name:</strong> {formData.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C' }}>
                    <span><strong>Email:</strong> {formData.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#8B5E3C' }}>
                    <span><strong>Phone:</strong> {formData.countryCode}{formData.phone}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C' }}>
                    <span>7-day free trial</span>
                    <span style={{ color: '#25d366', fontWeight: '600' }}>$0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8B5E3C' }}>
                    <span>Then ${billingType === 'yearly' ? plans[selectedPlan as keyof typeof plans].yearlyPrice : plans[selectedPlan as keyof typeof plans].monthlyPrice}/{billingType === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.1rem', color: '#8B5E3C' }}>
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
                  padding: '1rem 2rem',
                  background: isLoading ? '#9ca3af' : '#8B5E3C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
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

              <p style={{ fontSize: '0.8rem', color: '#8B5E3C', textAlign: 'center', marginTop: '1rem', opacity: 0.8 }}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
                Your trial starts today and you can cancel anytime before it ends.
              </p>
            </div>
          )}

          {step === 'oauth' && (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ marginBottom: '2rem' }}>
                <CheckCircle size={80} style={{ color: '#25d366', margin: '0 auto' }} />
              </div>

              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '400', 
                color: '#8B5E3C', 
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                🎉 Payment Successful!
              </h1>

              <p style={{ 
                fontSize: '1.2rem', 
                color: '#718096', 
                marginBottom: '3rem'
              }}>
                Now connect your Google account to enable smart calendar features and complete your setup.
              </p>

              <div style={{ 
                background: '#F5F1EB', 
                borderRadius: '20px', 
                padding: '2rem', 
                border: '1px solid #E5DDD5',
                marginBottom: '2rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  color: '#8B5E3C', 
                  marginBottom: '1.5rem' 
                }}>
                  Order Summary
                </h3>
                
                <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C' }}>
                    <span><strong>Plan:</strong> {plans[selectedPlan as keyof typeof plans].name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C' }}>
                    <span><strong>Name:</strong> {formData.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C' }}>
                    <span><strong>Email:</strong> {formData.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#8B5E3C' }}>
                    <span><strong>Phone:</strong> {formData.countryCode}{formData.phone}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C' }}>
                    <span>7-day free trial</span>
                    <span style={{ color: '#25d366', fontWeight: '600' }}>$0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8B5E3C' }}>
                    <span>Then ${billingType === 'yearly' ? plans[selectedPlan as keyof typeof plans].yearlyPrice : plans[selectedPlan as keyof typeof plans].monthlyPrice}/{billingType === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.1rem', color: '#8B5E3C' }}>
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
                  padding: '1rem 2rem',
                  background: isLoading ? '#9ca3af' : '#8B5E3C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
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

              <p style={{ fontSize: '0.8rem', color: '#8B5E3C', textAlign: 'center', marginTop: '1rem', opacity: 0.8 }}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
                Your trial starts today and you can cancel anytime before it ends.
              </p>
            </div>
          )}

          {step === 'oauth' && (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ marginBottom: '2rem' }}>
                <CheckCircle size={80} style={{ color: '#25d366', margin: '0 auto' }} />
              </div>

              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '400', 
                color: '#8B5E3C', 
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                🎉 Payment Successful!
              </h1>

              <p style={{ 
                fontSize: '1.2rem', 
                color: '#718096', 
                marginBottom: '3rem'
              }}>
                Now connect your Google account to enable smart calendar features and complete your setup.
              </p>

              <div style={{ 
                background: '#F5F1EB', 
                borderRadius: '20px', 
                padding: '2rem', 
                border: '1px solid #E5DDD5',
                marginBottom: '2rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  color: '#8B5E3C', 
                  marginBottom: '1rem' 
                }}>
                  Why Connect Google?
                </h3>
                <div style={{ textAlign: 'left', color: '#8B5E3C' }}>
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
                  padding: '1rem 2rem',
                  background: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#3367d6'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#4285f4'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Connect Google Account
              </button>

              <p style={{ fontSize: '0.8rem', color: '#718096', textAlign: 'center' }}>
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
                  fontSize: '0.9rem',
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
