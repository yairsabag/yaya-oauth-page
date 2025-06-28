'use client'

import React, { useState, useEffect } from 'react'
import { Check, MessageCircle } from 'lucide-react'

export default function PaymentPage() {
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly')
  const [registrationCode, setRegistrationCode] = useState<string | null>(null)

  // Get registration code from URL when component mounts
  useEffect(() => {
    // תקן URL אם יש שני סימני שאלה
    let searchParams = window.location.search
    if (searchParams.includes('?code=') && searchParams.indexOf('?') !== searchParams.lastIndexOf('?')) {
      // יש שני סימני שאלה - תקן את זה
      searchParams = searchParams.replace('?code=', '&code=')
      console.log('Fixed malformed URL params:', searchParams) // Debug log
    }
    
    const params = new URLSearchParams(searchParams)
    const code = params.get('code')
    console.log('Original URL params:', window.location.search) // Debug log
    console.log('Parsed params:', searchParams) // Debug log
    console.log('Code from URL:', code) // Debug log
    
    if (code) {
      setRegistrationCode(code)
      console.log('Registration code set to:', code) // Debug log
    }
  }, [])

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

  const handlePlanSelection = (planId: string) => {
    console.log('Plan selection started for:', planId) // Debug log
    
    const plan = plans.find(p => p.id === planId)
    if (!plan) {
      console.error('Plan not found:', planId) // Debug log
      return
    }

    // קרא את הקוד ישירות מה-URL (לא מה-state כדי להימנע מ-race conditions)
    const params = new URLSearchParams(window.location.search)
    const urlCode = params.get('code')
    
    console.log('URL search:', window.location.search) // Debug log
    console.log('Code from URL:', urlCode) // Debug log
    console.log('Registration code from state:', registrationCode) // Debug log

    if (planId === 'basic') {
      console.log('Handling basic plan - opening WhatsApp') // Debug log
      const message = urlCode ? `My code: ${urlCode}` : ''
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=972559943649&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`
      window.open(whatsappUrl, '_blank')
      return
    }

    console.log('Handling paid plan - navigating to checkout') // Debug log
    const price = billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
    
    // השתמש בקוד הקיים מה-URL או מה-state, ורק אם אין - צור חדש
    let codeToUse = urlCode || registrationCode
    if (!codeToUse) {
      codeToUse = Math.random().toString(36).substring(2, 8).toUpperCase()
      console.log('No existing code found, generated new code:', codeToUse) // Debug log
    } else {
      console.log('Using existing code:', codeToUse) // Debug log
    }

    // בנה את ה-URL של הדף checkout
    const checkoutUrl = `/payment/checkout?plan=${planId}&price=${price}&billing=${billingType}&code=${codeToUse}&planName=${encodeURIComponent(plan.name)}`

    console.log('Final checkout URL:', checkoutUrl) // Debug log
    console.log('Current location:', window.location.href) // Debug log
    console.log('Navigating to checkout...') // Debug log
    
    // נווט לדף החדש
    try {
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Navigation error:', error) // Debug log
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016' }}>Yaya</span>
          </a>
          <a href="/" style={{ color: '#4a5568', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
            ← Back to Home
          </a>
        </div>
      </header>

      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '400', color: '#2d5016', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Choose Your Plan
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#718096', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Get started with Yaya Assistant. Start your 7-day free trial today.
            </p>

            {registrationCode && (
              <div style={{ background: 'rgba(37, 211, 102, 0.1)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(37, 211, 102, 0.3)', display: 'inline-block', marginBottom: '2rem' }}>
                <p style={{ color: '#25d366', fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                  ✅ Registration Code: {registrationCode}
                </p>
              </div>
            )}

            {/* Billing Toggle */}
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '4rem', background: '#f7fafc', borderRadius: '8px', padding: '4px', width: 'fit-content', margin: '0 auto 4rem', cursor: 'pointer' }}>
              <span onClick={() => setBillingType('yearly')} style={{
                background: billingType === 'yearly' ? 'white' : 'transparent',
                color: billingType === 'yearly' ? '#2d5016' : '#999',
                padding: '8px 20px',
                borderRadius: '6px',
                fontSize: '1.1rem',
                fontWeight: '500',
                boxShadow: billingType === 'yearly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                Yearly Billing
              </span>
              <span onClick={() => setBillingType('monthly')} style={{
                background: billingType === 'monthly' ? 'white' : 'transparent',
                color: billingType === 'monthly' ? '#2d5016' : '#999',
                padding: '8px 20px',
                borderRadius: '6px',
                fontSize: '1.1rem',
                fontWeight: '500',
                boxShadow: billingType === 'monthly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                Monthly Billing
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {plans.map((plan) => (
              <div key={plan.id} onClick={() => handlePlanSelection(plan.id)} style={{
                background: '#F5F1EB',
                borderRadius: '20px',
                padding: '2.5rem 2rem',
                textAlign: 'left',
                position: 'relative',
                border: plan.popular ? '2px solid #2d5016' : '1px solid #c3d9c6',
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
                    e.currentTarget.style.border = plan.popular ? '2px solid #2d5016' : '1px solid #c3d9c6'
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
                  {plan.displayPrice ? plan.displayPrice : `$${billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}`}
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

                <div style={{
                  background: plan.id === 'basic' ? 'rgba(37, 211, 102, 0.1)' : '#2d5016',
                  color: plan.id === 'basic' ? '#25d366' : 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: plan.id === 'basic' ? '1px solid rgba(37, 211, 102, 0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}>
                  {plan.id === 'basic' ? '💬 Start with WhatsApp' : '🚀 Start Free Trial'}
                </div>

                {plan.id === 'basic' && (
                  <div style={{
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: '#25d366',
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    No Credit Card Required
                  </div>
                )}

                {plan.id !== 'basic' && (
                  <div style={{
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: '#2d5016',
                    marginTop: '0.5rem',
                    opacity: 0.8
                  }}>
                    No commitment • Cancel anytime
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ fontSize: '1.1rem', color: '#2d5016', marginTop: '3rem', textAlign: 'center' }}>
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
