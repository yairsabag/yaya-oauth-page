'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'

interface Plan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  displayPrice?: string | null
  popular: boolean
  features: string[]
  buttonText: string
  buttonAction: string
  usersCount?: string
}

export default function PaymentPage() {
  const [billingType, setBillingType] = useState('monthly')

  const plans: Plan[] = [
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
      buttonAction: 'payment',
      usersCount: '4,100+ users loving this plan'
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

  const handlePlanAction = (plan: Plan) => {
    if (plan.buttonAction === 'whatsapp') {
      // Redirect to WhatsApp
      window.open('https://wa.me/972559943649?text=Hi! I want to start with the Basic (FREE) plan', '_blank')
    } else {
      // Redirect to checkout page
      const price = billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
      window.location.href = `/payment/checkout?plan=${plan.id}&price=${price}&billing=${billingType}`
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

      {/* Main Content */}
      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '400', 
              color: '#8B5E3C', 
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              Simple Pricing
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#718096', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Start your 7-day free trial. No commitment, cancel anytime.
            </p>

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
                  color: billingType === 'yearly' ? '#8B5E3C' : '#999',
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
                  color: billingType === 'monthly' ? '#8B5E3C' : '#999',
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: '#F5F1EB',
                  borderRadius: '20px',
                  padding: '2.5rem 2rem',
                  textAlign: 'left',
                  position: 'relative',
                  border: plan.popular ? '2px solid #8B5E3C' : '1px solid #E5DDD5',
                  transform: plan.popular ? 'scale(1.02)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = plan.popular ? 'scale(1.05)' : 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 20px 25px rgba(139, 94, 60, 0.15)'
                  e.currentTarget.style.border = '2px solid #8B5E3C'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = plan.popular ? 'scale(1.02)' : 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)'
                  e.currentTarget.style.border = plan.popular ? '2px solid #8B5E3C' : '1px solid #E5DDD5'
                }}
              >
                {(plan.popular || (plan.id !== 'basic' && plan.monthlyPrice > 0)) && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: '#8B5E3C',
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
                  color: '#8B5E3C', 
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
                  color: '#8B5E3C', 
                  marginBottom: plan.id === 'basic' ? '2rem' : '0.5rem',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px'
                }}>
                  {plan.displayPrice ? 
                    plan.displayPrice : 
                    `$${billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}`
                  }
                  {!plan.displayPrice && (
                    <span style={{ fontSize: '1rem', fontWeight: '400' }}>/MONTH</span>
                  )}
                </div>
                
                <div style={{ marginBottom: '2rem' }}>
                  {plan.features.map((feature, index) => (
                    <div key={index} style={{ 
                      color: '#8B5E3C', 
                      marginBottom: '0.75rem', 
                      fontSize: '0.95rem', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '8px' 
                    }}>
                      <span style={{ color: '#8B5E3C', fontSize: '1rem' }}>•</span>
                      {feature}
                    </div>
                  ))}
                </div>

                {plan.usersCount && (
                  <div style={{
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: '#8B5E3C',
                    fontWeight: '400',
                    marginBottom: '1.5rem'
                  }}>
                    {plan.usersCount}
                  </div>
                )}

                <button
                  onClick={() => handlePlanAction(plan)}
                  style={{
                    width: '100%',
                    background: plan.popular ? '#8B5E3C' : (plan.id === 'basic' ? '#25d366' : '#f7fafc'),
                    color: plan.popular ? 'white' : (plan.id === 'basic' ? 'white' : '#8B5E3C'),
                    border: plan.popular || plan.id === 'basic' ? 'none' : '1px solid #8B5E3C',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement
                    if (plan.id === 'basic') {
                      target.style.background = '#22c55e'
                    } else if (plan.popular) {
                      target.style.background = '#7c4a32'
                    } else {
                      target.style.background = '#8B5E3C'
                      target.style.color = 'white'
                    }
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement
                    if (plan.id === 'basic') {
                      target.style.background = '#25d366'
                    } else if (plan.popular) {
                      target.style.background = '#8B5E3C'
                    } else {
                      target.style.background = '#f7fafc'
                      target.style.color = '#8B5E3C'
                    }
                  }}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Need Yaya for your Team */}
          <div style={{
            fontSize: '1.1rem',
            color: '#8B5E3C',
            marginTop: '3rem',
            textAlign: 'center'
          }}>
            Need Yaya for your Team?{' '}
            <a href="mailto:info@textcoco.com" style={{ color: '#8B5E3C', textDecoration: 'underline' }}>
              Contact us
            </a>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>
              Questions? <a href="mailto:info@textcoco.com" style={{ color: '#8B5E3C', textDecoration: 'none' }}>Contact us</a> or message us on{' '}
              <a href="https://wa.me/972559943649" style={{ color: '#8B5E3C', textDecoration: 'none' }}>WhatsApp</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
