'use client'

import React, { useState, useEffect } from 'react'
import { Check, MessageCircle } from 'lucide-react'
import { useRegistration } from '../../contexts/RegistrationContext'
import { useSearchParams } from 'next/navigation'

export default function PaymentPage() {
  const { registrationCode, setRegistrationCode, navigateWithCode, buildUrlWithCode } = useRegistration()
  const searchParams = useSearchParams()
  const [billingType, setBillingType] = useState('monthly')
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    plan: '',
    countryCode: '+972'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showContactForm, setShowContactForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')

  const countries = [
    { code: '+972', name: 'Israel', flag: '🇮🇱' },
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+1', name: 'Canada', flag: '🇨🇦' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
    { code: '+32', name: 'Belgium', flag: '🇧🇪' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
    { code: '+43', name: 'Austria', flag: '🇦🇹' },
    { code: '+46', name: 'Sweden', flag: '🇸🇪' },
    { code: '+47', name: 'Norway', flag: '🇳🇴' },
    { code: '+45', name: 'Denmark', flag: '🇩🇰' },
    { code: '+358', name: 'Finland', flag: '🇫🇮' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+30', name: 'Greece', flag: '🇬🇷' },
    { code: '+48', name: 'Poland', flag: '🇵🇱' },
    { code: '+420', name: 'Czech Republic', flag: '🇨🇿' },
    { code: '+36', name: 'Hungary', flag: '🇭🇺' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+56', name: 'Chile', flag: '🇨🇱' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+90', name: 'Turkey', flag: '🇹🇷' }
  ]

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      monthlyPrice: 0,
      yearlyPrice: 0,
      displayPrice: 'FREE',
      popular: false,
      features: [
        'Unlimited messages',
        'Unlimited one-time reminders',
        '100+ languages supported',
        'ChatGPT',
        '5 Voice Notes / Month',
        '5 Image Analysis / Month',
        'Receive reminders from friends'
      ],
      buttonText: 'Start with WhatsApp',
      buttonAction: 'whatsapp'
    },
    {
      id: 'executive',
      name: 'Executive Plan',
      monthlyPrice: 5,
      yearlyPrice: 4,
      displayPrice: null,
      popular: true,
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
      ],
      buttonText: 'Start Free Trial',
      buttonAction: 'payment'
    },
    {
      id: 'ultimate',
      name: 'Ultimate Plan',
      monthlyPrice: 14,
      yearlyPrice: 13,
      displayPrice: null,
      popular: false,
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
      ],
      buttonText: 'Start Free Trial',
      buttonAction: 'payment'
    }
  ]

  // useEffect לקבלת פרמטרים מה-URL
  useEffect(() => {
    const planFromUrl = searchParams.get('plan')
    const billingFromUrl = searchParams.get('billing')
    const codeFromUrl = searchParams.get('code')
    const oauthSuccess = searchParams.get('oauth')
    
    if (planFromUrl) {
      setSelectedPlan(planFromUrl)
      setFormData(prev => ({ ...prev, plan: planFromUrl }))
      setShowContactForm(true)
    }
    if (billingFromUrl) {
      setBillingType(billingFromUrl)
    }
    if (codeFromUrl && !registrationCode) {
      setRegistrationCode(codeFromUrl)
    }
    if (oauthSuccess === 'success') {
      // הצגת הודעת הצלחה לOAuth
      alert('Google Calendar connected successfully! ✅')
    }
  }, [searchParams, registrationCode, setRegistrationCode])

  const handlePlanSelection = (planId: string) => {
    if (planId === 'basic') {
      // For free plan, redirect to WhatsApp directly
      window.open('https://api.whatsapp.com/send/?phone=972559943649&text&type=phone_number&app_absent=0', '_blank')
    } else {
      setSelectedPlan(planId)
      setFormData({ ...formData, plan: planId })
      setShowContactForm(true)
      // Scroll to contact form
      setTimeout(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleGoogleOAuth = () => {
    // שימוש בקוד רישום ב-state parameter
    const currentCode = registrationCode || Math.random().toString(36).substring(2, 8).toUpperCase()
    
    if (!registrationCode) {
      setRegistrationCode(currentCode)
    }
    
    // בניית URL לGoogle OAuth עם הקוד ב-state
    const redirectUri = `${window.location.origin}/auth/callback`
    const googleAuthUrl = 
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=openid email profile https://www.googleapis.com/auth/calendar&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${currentCode}` // הקוד עובר כ-state
    
    window.location.href = googleAuthUrl
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setErrors({})

    // Validate form
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.plan) newErrors.plan = 'Please select a plan'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // שימוש בקוד הקיים או יצירת חדש
      const currentCode = registrationCode || Math.random().toString(36).substring(2, 8).toUpperCase()
      
      if (!registrationCode) {
        setRegistrationCode(currentCode)
      }
      
      console.log('Sending webhook data:', {
        phone: formData.phone,
        email: formData.email,
        plan: formData.plan,
        registration_code: currentCode
      })
      
      // Send data to n8n webhook
      const response = await fetch('https://yairsabag.app.n8n.cloud/webhook-test/whatsapp-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formData.countryCode + formData.phone,
          email: formData.email,
          plan: formData.plan,
          registration_code: currentCode
        })
      })
      
      console.log('Webhook response status:', response.status)
      console.log('Webhook response:', await response.text())
      
      // Get plan details for checkout
      const plan = plans.find(p => p.id === formData.plan)
      const price = billingType === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice
      
      // שימוש בפונקציה החדשה לניווט
      navigateWithCode(`/payment/checkout?plan=${formData.plan}&price=${price}&billing=${billingType}&email=${formData.email}`)
      
    } catch (error) {
      console.error('Webhook error:', error)
      // Still proceed to checkout even if webhook fails
      const plan = plans.find(p => p.id === formData.plan)
      const price = billingType === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice
      const currentCode = registrationCode || Math.random().toString(36).substring(2, 8).toUpperCase()
      
      navigateWithCode(`/payment/checkout?plan=${formData.plan}&price=${price}&billing=${billingType}&email=${formData.email}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href={buildUrlWithCode('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016' }}>Yaya</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* הצגת קוד הרישום */}
            {registrationCode && (
              <div style={{ 
                background: 'rgba(45, 80, 22, 0.1)', 
                color: '#2d5016', 
                padding: '4px 12px', 
                borderRadius: '12px', 
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                קוד: {registrationCode}
              </div>
            )}
            <a href={buildUrlWithCode('/')} style={{ color: '#4a5568', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '400', 
              color: '#2d5016', 
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              Choose Your Plan
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#718096', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Get started with Yaya Assistant. Start your 7-day free trial today.
            </p>
            
            {/* הצגת מידע על הקוד אם קיים */}
            {registrationCode && (
              <div style={{
                background: 'rgba(45, 80, 22, 0.1)',
                border: '1px solid rgba(45, 80, 22, 0.2)',
                borderRadius: '12px',
                padding: '1rem',
                margin: '0 auto 2rem',
                maxWidth: '600px'
              }}>
                <p style={{ color: '#2d5016', margin: 0, fontSize: '1rem' }}>
                  🎯 <strong>Registration Code: {registrationCode}</strong><br/>
                  Your account will be linked to WhatsApp when you complete the signup.
                </p>
              </div>
            )}

            {/* Billing Toggle */}
            <div style={{
              display: 'flex',
              gap: '4px',
              justifyContent: 'center',
              marginBottom: '4rem',
              background: '#f7fafc',
              borderRadius: '8px',
              padding: '4px',
              width: 'fit-content',
              margin: '0 auto 4rem',
              cursor: 'pointer'
            }}>
              <span 
                onClick={() => setBillingType('yearly')}
                style={{
                  background: billingType === 'yearly' ? 'white' : 'transparent',
                  color: billingType === 'yearly' ? '#2d5016' : '#999',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  boxShadow: billingType === 'yearly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Yearly Billing
              </span>
              <span 
                onClick={() => setBillingType('monthly')}
                style={{
                  background: billingType === 'monthly' ? 'white' : 'transparent',
                  color: billingType === 'monthly' ? '#2d5016' : '#999',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  boxShadow: billingType === 'monthly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Monthly Billing
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handlePlanSelection(plan.id)}
                style={{
                  background: selectedPlan === plan.id ? 'rgba(45, 80, 22, 0.1)' : '#F5F1EB',
                  borderRadius: '20px',
                  padding: '2.5rem 2rem',
                  textAlign: 'left',
                  position: 'relative',
                  border: plan.popular ? '2px solid #2d5016' : selectedPlan === plan.id ? '2px solid #2d5016' : '1px solid #c3d9c6',
                  transform: plan.popular ? 'scale(1.02)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  opacity: plan.id === 'basic' ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (plan.id !== 'basic') {
                    e.currentTarget.style.transform = plan.popular ? 'scale(1.05)' : 'scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 20px 25px rgba(45, 80, 22, 0.15)'
                    e.currentTarget.style.border = '2px solid #2d5016'
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.id !== 'basic') {
                    e.currentTarget.style.transform = plan.popular ? 'scale(1.02)' : 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)'
                    e.currentTarget.style.border = plan.popular ? '2px solid #2d5016' : selectedPlan === plan.id ? '2px solid #2d5016' : '1px solid #c3d9c6'
                  }
                }}
              >
                {(plan.popular || (plan.id !== 'basic' && plan.monthlyPrice > 0)) && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: '#2d5016',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {plan.popular ? 'MOST POPULAR' : '7 DAY TRIAL'}
                  </div>
                )}

                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#2d5016', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {plan.name.toUpperCase()}
                </div>

                <div style={{ 
                  fontSize: '4rem', 
                  fontWeight: '300', 
                  color: '#2d5016', 
                  marginBottom: plan.id === 'basic' ? '2rem' : '0.5rem',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px'
                }}>
                  {plan.displayPrice ? 
                    plan.displayPrice : 
                    `${billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}`
                  }
                  {!plan.displayPrice && (
                    <span style={{ fontSize: '1rem', fontWeight: '400' }}>/MONTH</span>
                  )}
                </div>
                
                <div style={{ marginBottom: '2rem' }}>
                  {plan.features.map((feature, index) => (
                    <div key={index} style={{ 
                      color: '#2d5016', 
                      marginBottom: '0.75rem', 
                      fontSize: '0.95rem', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '8px' 
                    }}>
                      <span style={{ color: '#2d5016', fontSize: '1rem' }}>•</span>
                      {feature}
                    </div>
                  ))}
                </div>

                {selectedPlan === plan.id && plan.id !== 'basic' && (
                  <div style={{
                    background: '#2d5016',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    marginBottom: '1rem'
                  }}>
                    ✓ Selected - Fill contact form below
                  </div>
                )}

                {plan.id === 'basic' && (
                  <div style={{
                    background: 'rgba(37, 211, 102, 0.1)',
                    color: '#25d366',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    marginBottom: '1rem',
                    border: '1px solid rgba(37, 211, 102, 0.2)'
                  }}>
                    💬 Available on WhatsApp Only
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form - Only shows when a paid plan is selected */}
          {showContactForm && selectedPlan && (
            <div id="contact-form" style={{ maxWidth: '600px', margin: '0 auto 3rem', background: '#F5F1EB', borderRadius: '20px', padding: '2.5rem', border: '2px solid #2d5016', boxShadow: '0 10px 30px rgba(45, 80, 22, 0.2)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2d5016', marginBottom: '1rem', textAlign: 'center' }}>
                📞 Complete Your Registration
              </h3>
              <p style={{ color: '#2d5016', fontSize: '1rem', marginBottom: '1.5rem', textAlign: 'center', opacity: 0.8 }}>
                Enter your contact details to start your 7-day free trial
              </p>
              
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '1rem', fontWeight: '600', color: '#2d5016', marginBottom: '0.5rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: errors.email ? '2px solid #ef4444' : '1px solid #c3d9c6',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    marginBottom: '0.5rem',
                    boxSizing: 'border-box',
                    background: 'white',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5016'}
                  onBlur={(e) => e.target.style.borderColor = errors.email ? '#ef4444' : '#c3d9c6'}
                />
                {errors.email && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{errors.email}</p>}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '1rem', fontWeight: '600', color: '#2d5016', marginBottom: '0.5rem' }}>
                  Phone Number *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    style={{
                      padding: '14px 10px',
                      border: '1px solid #c3d9c6',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      background: 'white',
                      minWidth: '120px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2d5016'}
                    onBlur={(e) => e.target.style.borderColor = '#c3d9c6'}
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
                    placeholder="50-123-4567"
                    style={{
                      flex: 1,
                      padding: '14px',
                      border: errors.phone ? '2px solid #ef4444' : '1px solid #c3d9c6',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: 'white',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2d5016'}
                    onBlur={(e) => e.target.style.borderColor = errors.phone ? '#ef4444' : '#c3d9c6'}
                  />
                </div>
                {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>{errors.phone}</p>}
              </div>

              {/* Google Calendar Integration Button */}
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  onClick={handleGoogleOAuth}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: '#4285f4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement
                    target.style.backgroundColor = '#3367d6'
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement
                    target.style.backgroundColor = '#4285f4'
                  }}
                >
                  📅 Connect Google Calendar (Optional)
                </button>
                <p style={{ fontSize: '0.85rem', color: '#666', textAlign: 'center', margin: 0 }}>
                  Link your Google Calendar to create events directly from WhatsApp
                </p>
              </div>

              <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(45, 80, 22, 0.1)', borderRadius: '10px', border: '1px solid rgba(45, 80, 22, 0.2)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d5016', marginBottom: '0.5rem' }}>
                  Selected Plan: {plans.find(p => p.id === selectedPlan)?.name}
                </h4>
                <p style={{ color: '#2d5016', fontSize: '0.9rem', opacity: 0.8 }}>
                  ${billingType === 'yearly' ? plans.find(p => p.id === selectedPlan)?.yearlyPrice : plans.find(p => p.id === selectedPlan)?.monthlyPrice}/{billingType === 'yearly' ? 'year' : 'month'} • 7-day free trial
                </p>
                {registrationCode && (
                  <p style={{ color: '#2d5016', fontSize: '0.85rem', fontWeight: '500', margin: '0.5rem 0 0 0' }}>
                    Registration Code: {registrationCode}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: isLoading ? '#9ca3af' : '#2d5016',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(45, 80, 22, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    const target = e.target as HTMLButtonElement
                    target.style.backgroundColor = '#1e3a0f'
                    target.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    const target = e.target as HTMLButtonElement
                    target.style.backgroundColor = '#2d5016'
                    target.style.transform = 'translateY(0)'
                  }
                }}
              >
                {isLoading ? 'Processing...' : 'Continue to Payment'}
              </button>

              <p style={{ fontSize: '0.8rem', color: '#2d5016', textAlign: 'center', marginTop: '1rem', opacity: 0.8 }}>
                By continuing, you agree to our Terms of Service and Privacy Policy. Cancel anytime during your free trial.
              </p>
            </div>
          )}

          <div style={{
            fontSize: '1.1rem',
            color: '#2d5016',
            marginTop: '3rem',
            textAlign: 'center'
          }}>
            Need Yaya for your Team?{' '}
            <a href="mailto:info@textcoco.com" style={{ color: '#2d5016', textDecoration: 'underline' }}>
              Contact us
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
