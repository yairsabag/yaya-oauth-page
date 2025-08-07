'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Shield, CreditCard, Lock } from 'lucide-react'

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState({
    plan: '',
    price: '',
    billing: '',
    code: '',
    planName: ''
  })

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const extractedParams = {
      plan: params.get('plan') || '',
      price: params.get('price') || '',
      billing: params.get('billing') || '',
      code: params.get('code') || '',
      planName: params.get('planName') || ''
    }
    setUrlParams(extractedParams)
  }, [])

  const planNames = {
    executive: 'Executive Plan',
    ultimate: 'Ultimate Plan'
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setErrors({})

    // Validate form - רק את הפרטים האישיים
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // צור payment request עם Tranzila
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan: urlParams.plan,
          billing: urlParams.billing,
          registrationCode: urlParams.code,
          email: formData.email,
          fullName: formData.fullName
        })
      });

      const result = await response.json();

      if (result.success && result.paymentUrl) {
        // שמור נתונים לפני המעבר
        sessionStorage.setItem('checkoutData', JSON.stringify({
          ...formData,
          ...urlParams,
          paymentRequestId: result.paymentRequestId
        }));
        
        // הפנה לדף התשלום המאובטח של Tranzila
        window.location.href = result.paymentUrl;
      } else {
        alert(result.error || 'Failed to create payment. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const getCurrentPlanName = () => {
    return urlParams.planName || planNames[urlParams.plan as keyof typeof planNames] || 'Selected Plan'
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ width: isMobile ? '60px' : '80px', height: isMobile ? '60px' : '80px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: '600', color: '#2d5016' }}>Yaya</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a5568' }}>
            <Shield size={16} />
            {!isMobile && <span style={{ fontSize: '0.9rem' }}>Secure Checkout</span>}
          </div>
        </div>
      </header>

      <main style={{ padding: isMobile ? '1.5rem 0' : '2rem 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem' }}>
          <a 
            href={`/payment${urlParams.code ? `?code=${urlParams.code}` : ''}`}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: '#8B5E3C', 
              textDecoration: 'none', 
              marginBottom: isMobile ? '1.5rem' : '2rem',
              fontSize: isMobile ? '0.875rem' : '0.9rem'
            }}
          >
            <ArrowLeft size={16} />
            Back to Plans
          </a>

          <div style={{ 
            display: isMobile ? 'flex' : 'grid', 
            flexDirection: isMobile ? 'column' : undefined,
            gridTemplateColumns: isMobile ? undefined : '1fr 1fr', 
            gap: isMobile ? '2rem' : '3rem' 
          }}>
            {/* Order Summary */}
            <div style={{ order: isMobile ? 2 : 1 }}>
              <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '400', marginBottom: '1.5rem', color: '#8B5E3C', letterSpacing: '-0.02em' }}>
                Order Summary
              </h2>
              
              <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: isMobile ? '1.5rem' : '2rem', border: '1px solid #E5DDD5' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: isMobile ? '1.1rem' : '1.2rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    {getCurrentPlanName()}
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: isMobile ? '0.875rem' : '0.9rem', opacity: 0.8 }}>
                    {urlParams.billing === 'yearly' ? 'Annual' : 'Monthly'} subscription
                  </p>
                </div>

                {urlParams.code && (
                  <div style={{ 
                    background: 'rgba(37, 211, 102, 0.1)', 
                    borderRadius: '12px', 
                    padding: isMobile ? '0.75rem' : '1rem', 
                    border: '1px solid rgba(37, 211, 102, 0.3)',
                    marginBottom: '1.5rem'
                  }}>
                    <p style={{ color: '#25d366', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: '600', margin: 0 }}>
                      ✅ Registration Code: {urlParams.code}
                    </p>
                  </div>
                )}

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                    <span>7-day free trial</span>
                    <span style={{ color: '#25d366', fontWeight: '600' }}>$0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8B5E3C', fontSize: isMobile ? '0.875rem' : '1rem' }}>
                    <span>Then {urlParams.billing === 'yearly' ? 'annually' : 'monthly'}</span>
                    <span>${urlParams.price}/{urlParams.billing === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: isMobile ? '1rem' : '1.1rem', color: '#8B5E3C' }}>
                    <span>Total today</span>
                    <span style={{ color: '#25d366' }}>$0.00</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: isMobile ? '0.75rem' : '1rem', background: 'rgba(37, 211, 102, 0.1)', borderRadius: '12px', border: '1px solid rgba(37, 211, 102, 0.2)' }}>
                  <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', color: '#8B5E3C', textAlign: 'center' }}>
                    🎉 Free for 7 days, then ${urlParams.price}/{urlParams.billing === 'yearly' ? 'year' : 'month'}. Cancel anytime.
                  </p>
                </div>
                
                {/* Security badges */}
                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8B5E3C', fontSize: isMobile ? '0.8rem' : '0.85rem' }}>
                    <Lock size={14} />
                    <span>SSL Secured</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8B5E3C', fontSize: isMobile ? '0.8rem' : '0.85rem' }}>
                    <Shield size={14} />
                    <span>PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Only */}
            <div style={{ order: isMobile ? 1 : 2 }}>
              <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '400', marginBottom: '1.5rem', color: '#8B5E3C', letterSpacing: '-0.02em' }}>
                Contact Information
              </h2>

              <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: isMobile ? '1.5rem' : '2rem', border: '1px solid #E5DDD5' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
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
                      fontSize: isMobile ? '0.875rem' : '0.9rem',
                      boxSizing: 'border-box',
                      background: 'white'
                    }}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.email}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: errors.fullName ? '1px solid #ef4444' : '1px solid #E5DDD5',
                      borderRadius: '8px',
                      fontSize: isMobile ? '0.875rem' : '0.9rem',
                      boxSizing: 'border-box',
                      background: 'white'
                    }}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.fullName}</p>}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: errors.phone ? '1px solid #ef4444' : '1px solid #E5DDD5',
                      borderRadius: '8px',
                      fontSize: isMobile ? '0.875rem' : '0.9rem',
                      boxSizing: 'border-box',
                      background: 'white'
                    }}
                    placeholder="+972-50-123-4567"
                  />
                  {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
                </div>

                {/* Notice about secure payment */}
                <div style={{ 
                  background: 'rgba(139, 94, 60, 0.1)', 
                  borderRadius: '12px', 
                  padding: isMobile ? '0.75rem' : '1rem', 
                  border: '1px solid rgba(139, 94, 60, 0.2)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <CreditCard size={20} style={{ color: '#8B5E3C', flexShrink: 0 }} />
                  <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', color: '#8B5E3C', margin: 0 }}>
                    You'll be redirected to our secure payment page to complete your purchase
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: isMobile ? '0.875rem' : '1rem',
                    background: isLoading ? '#9ca3af' : '#8B5E3C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.95rem' : '1rem',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && !isMobile) {
                      (e.target as HTMLButtonElement).style.background = '#7c4a32'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && !isMobile) {
                      (e.target as HTMLButtonElement).style.background = '#8B5E3C'
                    }
                  }}
                >
                  <Lock size={isMobile ? 18 : 20} />
                  {isLoading ? 'Processing...' : 'Continue to Secure Payment'}
                </button>

                <p style={{ fontSize: isMobile ? '0.75rem' : '0.8rem', color: '#8B5E3C', textAlign: 'center', marginTop: '1rem', opacity: 0.8 }}>
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                  Your payment information is encrypted and secure.
                </p>

                {/* Payment methods accepted */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E5DDD5' }}>
                  <p style={{ fontSize: isMobile ? '0.75rem' : '0.8rem', color: '#8B5E3C', textAlign: 'center', marginBottom: '0.75rem' }}>
                    We accept all major payment methods
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', opacity: 0.6 }}>
                    <span style={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}>💳 Visa</span>
                    <span style={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}>💳 Mastercard</span>
                    <span style={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}>💳 Amex</span>
                    <span style={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}>🍎 Apple Pay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
