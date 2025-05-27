'use client'

import React, { useState, useEffect } from 'react'
import { Check, MessageCircle } from 'lucide-react'

export default function PaymentPage() {
  const [billingType, setBillingType] = useState('monthly')
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    plan: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showContactForm, setShowContactForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')

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
      // Generate unique registration code
      const registrationCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      
      console.log('Sending webhook data:', {
        phone: formData.phone,
        email: formData.email,
        plan: formData.plan,
        registration_code: registrationCode
      })
      
      // Send data to n8n webhook
      const response = await fetch('https://yairsabag.app.n8n.cloud/webhook-test/whatsapp-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formData.phone,
          email: formData.email,
          plan: formData.plan,
          registration_code: registrationCode
        })
      })
      
      console.log('Webhook response status:', response.status)
      console.log('Webhook response:', await response.text())
      
      // Get plan details for checkout
      const plan = plans.find(p => p.id === formData.plan)
      const price = billingType === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice
      
      // Redirect to checkout with all parameters including email
      window.location.href = `/payment/checkout?plan=${formData.plan}&price=${price}&billing=${billingType}&code=${registrationCode}&email=${formData.email}`
      
    } catch (error) {
      console.error('Webhook error:', error)
      // Still proceed to checkout even if webhook fails
      const plan = plans.find(p => p.id === formData.plan)
      const price = billingType === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice
      const registrationCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      
      window.location.href = `/payment/checkout?plan=${formData.plan}&price=${price}&billing=${billingType}&code=${registrationCode}&email=${formData.email}`
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
              color: '#2d5016', 
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
                    `$${billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}`
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
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+972-50-123-4567"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: errors.phone ? '2px solid #ef4444' : '1px solid #c3d9c6',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    marginBottom: '0.5rem',
                    boxSizing: 'border-box',
                    background: 'white',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5016'}
                  onBlur={(e) => e.target.style.borderColor = errors.phone ? '#ef4444' : '#c3d9c6'}
                />
                {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{errors.phone}</p>}
              </div>

              <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(45, 80, 22, 0.1)', borderRadius: '10px', border: '1px solid rgba(45, 80, 22, 0.2)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d5016', marginBottom: '0.5rem' }}>
                  Selected Plan: {plans.find(p => p.id === selectedPlan)?.name}
                </h4>
                <p style={{ color: '#2d5016', fontSize: '0.9rem', opacity: 0.8 }}>
                  ${billingType === 'yearly' ? plans.find(p => p.id === selectedPlan)?.yearlyPrice : plans.find(p => p.id === selectedPlan)?.monthlyPrice}/{billingType === 'yearly' ? 'year' : 'month'} • 7-day free trial
                </p>
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
