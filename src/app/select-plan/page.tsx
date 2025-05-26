'use client'

import React, { useState } from 'react'
import { Check, MessageCircle } from 'lucide-react'

export default function SelectPlanPage() {
  const [billingType, setBillingType] = useState('monthly')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  const handlePlanSelection = async (plan: typeof plans[0]) => {
    if (plan.buttonAction === 'whatsapp') {
      // For free plan, redirect to WhatsApp directly
      window.open('https://api.whatsapp.com/send/?phone=972559943649&text&type=phone_number&app_absent=0', '_blank')
      return
    }

    // For paid plans, we need phone number first
    setSelectedPlan(plan.id)
  }

  const handleProceedToPayment = async () => {
    if (!phoneNumber || !selectedPlan) return

    setIsLoading(true)
    try {
      // Generate a registration code (in real implementation, this would be done server-side)
      const registrationCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      
      // Store phone number with registration code (this would be API call in real implementation)
      // For now, just proceed to checkout
      
      const plan = plans.find(p => p.id === selectedPlan)
      const price = billingType === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice
      
      // Redirect to checkout with registration code
      window.location.href = `/payment/checkout?plan=${selectedPlan}&price=${price}&billing=${billingType}&code=${registrationCode}`
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
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
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '400', 
              color: '#8B5E3C', 
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              Choose Your Plan
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#718096', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Get started with Yaya Assistant. Start your 7-day free trial today.
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

          {/* Phone Number Input (only show if paid plan selected) */}
          {selectedPlan && selectedPlan !== 'basic' && (
            <div style={{ maxWidth: '500px', margin: '0 auto 3rem', background: '#F5F1EB', borderRadius: '20px', padding: '2rem', border: '1px solid #E5DDD5' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1rem', textAlign: 'center' }}>
                📱 Enter Your WhatsApp Number
              </h3>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center', opacity: 0.8 }}>
                We'll connect your subscription to your WhatsApp account
              </p>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+972-50-123-4567"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #E5DDD5',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              />
              <button
                onClick={handleProceedToPayment}
                disabled={!phoneNumber || isLoading}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: !phoneNumber || isLoading ? '#9ca3af' : '#8B5E3C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: !phoneNumber || isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handlePlanSelection(plan)}
                style={{
                  background: selectedPlan === plan.id ? 'rgba(139, 94, 60, 0.1)' : '#F5F1EB',
                  borderRadius: '20px',
                  padding: '2.5rem 2rem',
                  textAlign: 'left',
                  position: 'relative',
                  border: plan.popular ? '2px solid #8B5E3C' : selectedPlan === plan.id ? '2px solid #8B5E3C' : '1px solid #E5DDD5',
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
                  e.currentTarget.style.border = plan.popular ? '2px solid #8B5E3C' : selectedPlan === plan.id ? '2px solid #8B5E3C' : '1px solid #E5DDD5'
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

                {selectedPlan === plan.id && (
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
        </div>
      </main>
    </div>
  )
}
