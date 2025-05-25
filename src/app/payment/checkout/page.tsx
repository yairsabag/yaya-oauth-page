'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, CreditCard } from 'lucide-react'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const price = searchParams.get('price')

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const planNames = {
    executive: 'Executive Plan',
    ultimate: 'Ultimate Plan'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validate form
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
      // Here you would integrate with Tranzila
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to success page
      window.location.href = `/payment/success?plan=${plan}&email=${formData.email}`
    } catch (error) {
      window.location.href = '/payment/failed'
    }
  }

  return (
    <div style={{ fontFamily: "Lato, system-ui, -apple-system, sans-serif", minHeight: '100vh', background: '#f9f9f9' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img 
              src="/yaya-logo.png" 
              alt="Yaya Logo" 
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            />
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a67c5a' }}>
              Yaya
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
            <Shield size={16} />
            <span style={{ fontSize: '0.9rem' }}>Secure Checkout</span>
          </div>
        </div>
      </header>

      <main style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <Link 
            href="/payment" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: '#a67c5a', 
              textDecoration: 'none', 
              marginBottom: '2rem',
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={16} />
            Back to Plans
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            {/* Order Summary */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                Order Summary
              </h2>
              
              <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                    {planNames[plan as keyof typeof planNames] || 'Selected Plan'}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Monthly subscription</p>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>7-day free trial</span>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>$0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Then monthly</span>
                    <span>${price}/month</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.1rem' }}>
                    <span>Total today</span>
                    <span style={{ color: '#10b981' }}>$0.00</span>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #e0f2fe' }}>
                  <p style={{ fontSize: '0.85rem', color: '#075985', textAlign: 'center' }}>
                    🎉 Free for 7 days, then ${price}/month. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                Contact Information
              </h2>

              <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.email}</p>}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: errors.fullName ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.fullName}</p>}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: errors.phone ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="+972-50-123-4567"
                  />
                  {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #a67c5a 0%, #8b5a3c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <CreditCard size={20} />
                  {isLoading ? 'Processing...' : 'Start Free Trial'}
                </button>

                <p style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', marginTop: '1rem' }}>
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                  Your trial starts today and you can cancel anytime before it ends.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
