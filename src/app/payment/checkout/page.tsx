'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Shield, CreditCard, Lock } from 'lucide-react'

declare global {
  interface Window {
    TranzillaHostedFields: any
  }
}

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
  
  const [cardData, setCardData] = useState({
    idNumber: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isMobile, setIsMobile] = useState(false)
  
  // Hosted Fields states
  const [fieldsReady, setFieldsReady] = useState(false)
  const fieldsRef = useRef<any>(null)

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

  // Initialize Hosted Fields
  useEffect(() => {
    // Load Tranzila Hosted Fields script
    const script = document.createElement('script')
    script.src = 'https://hf.tranzila.com/assets/js/trnzl_hf.js'
    script.async = true
    script.onload = () => {
      // Initialize Hosted Fields
      if (window.TranzillaHostedFields) {
        try {
          fieldsRef.current = new window.TranzillaHostedFields({
            sandbox: false, // Set to true for testing
            styles: {
              input: {
                'font-size': '16px',
                'font-family': 'system-ui, -apple-system, sans-serif',
                'color': '#2d5016',
                'padding': '12px',
                'line-height': '1.5'
              },
              ':focus': {
                'outline': '2px solid #8B5E3C',
                'outline-offset': '2px'
              },
              '.invalid': {
                'color': '#ef4444'
              }
            }
          })
          
          fieldsRef.current.render({
            creditCard: '#card-field',
            cvv: '#cvv-field',
            expiry: '#expiry-field'
          }, () => {
            console.log('Hosted Fields ready')
            setFieldsReady(true)
          })
        } catch (error) {
          console.error('Failed to initialize Hosted Fields:', error)
        }
      }
    }
    script.onerror = () => {
      console.error('Failed to load Tranzila Hosted Fields script')
    }
    document.body.appendChild(script)
    
    return () => {
      // Cleanup
      if (fieldsRef.current && typeof fieldsRef.current.destroy === 'function') {
        fieldsRef.current.destroy()
      }
      // Remove script
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const planNames = {
    executive: 'Executive Plan',
    ultimate: 'Ultimate Plan'
  }

  const handleErrors = (err: any) => {
    console.error('Payment error:', err)
    if (err.message) {
      alert(err.message)
    } else {
      alert('An error occurred during payment processing. Please try again.')
    }
  }

  const handleSubmit = async () => {
    if (!fieldsReady || !fieldsRef.current) {
      alert('Payment fields are not ready. Please refresh the page.')
      return
    }

    setIsLoading(true)
    setErrors({})

    // Validate form
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!cardData.idNumber || cardData.idNumber.length < 9) {
      newErrors.idNumber = 'ID number is required (9 digits)'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    // 🔥 שימוש ב-Hosted Fields עם Verify mode + Tokenization
    fieldsRef.current.charge({
      terminal_name: 'fxpyairsabag', // מסוף רגיל
      amount: parseFloat(urlParams.price), // הסכום המלא
      tran_mode: 'V', // 🔥 Verify - רק אישור כרטיס, ללא חיוב!
      tokenize: true, // 🔥 יוצר טוקן לחיוב עתידי
      currency: '2', // USD
      
      // פרטי לקוח
      contact: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      credit_card_holder_id: cardData.idNumber,
      
      // מטה-דאטה
      custom1: urlParams.code,
      custom2: urlParams.plan,
      custom3: urlParams.billing,
      custom4: urlParams.price,
      pdesc: `Yaya ${urlParams.plan} - 7 Day Trial Authorization`
      
    }, async (err: any, response: any) => {
      if (err) {
        console.error('Authorization error:', err)
        handleErrors(err)
        setIsLoading(false)
        return
      }
      
      if (response && response.transaction_response && response.transaction_response.success) {
        const token = response.transaction_response.token
        const transactionId = response.transaction_response.transaction_id
        
        if (!token) {
          alert('Failed to create payment token. Please try again.')
          setIsLoading(false)
          return
        }
        
        // 🔥 שלח את הטוקן לשרת לשמירה + הפעלת טריאל
        try {
          const trialResponse = await fetch('/api/start-trial', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              registration_code: urlParams.code,
              email: formData.email,
              full_name: formData.fullName,
              phone: formData.phone,
              id_number: cardData.idNumber,
              plan: urlParams.plan,
              billing: urlParams.billing,
              price: parseFloat(urlParams.price),
              payment_token: token,
              auth_transaction_id: transactionId,
              trial_start: new Date().toISOString(),
              trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              charge_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              tranzila_response: response.transaction_response
            })
          })

          const trialData = await trialResponse.json()
          
          if (trialData.success) {
            // 🎉 הצלחה! הפנה לדף success
            const successUrl = new URL(window.location.origin + '/payment/success')
            successUrl.searchParams.set('plan', urlParams.plan)
            successUrl.searchParams.set('email', formData.email)
            successUrl.searchParams.set('price', urlParams.price)
            successUrl.searchParams.set('billing', urlParams.billing)
            successUrl.searchParams.set('code', urlParams.code)
            successUrl.searchParams.set('trial', 'true')
            successUrl.searchParams.set('transactionId', transactionId)
            
            window.location.href = successUrl.toString()
          } else {
            throw new Error(trialData.error || 'Failed to start trial')
          }
        } catch (apiError) {
          console.error('Trial start error:', apiError)
          alert('Failed to start trial. Please contact support.')
          setIsLoading(false)
        }
      } else {
        alert('Failed to authorize payment method. Please check your details and try again.')
        setIsLoading(false)
      }
    })
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

            {/* Payment Form */}
            <div style={{ order: isMobile ? 1 : 2 }}>
              <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '400', marginBottom: '1.5rem', color: '#8B5E3C', letterSpacing: '-0.02em' }}>
                Payment Details
              </h2>

              <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: isMobile ? '1.5rem' : '2rem', border: '1px solid #E5DDD5' }}>
                {/* Contact Information */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1rem' }}>
                    Contact Information
                  </h3>
                  
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

                  <div style={{ 
                    display: isMobile ? 'flex' : 'grid', 
                    flexDirection: isMobile ? 'column' : undefined,
                    gridTemplateColumns: isMobile ? undefined : '1fr 1fr', 
                    gap: '1rem' 
                  }}>
                    <div>
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

                    <div>
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
                  </div>
                </div>

                {/* Payment Information */}
                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '2rem' }}>
                  <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1rem' }}>
                    Payment Information
                  </h3>
                  
                  {/* Hosted Fields Loading State */}
                  {!fieldsReady && (
                    <div style={{ 
                      background: 'rgba(139, 94, 60, 0.1)', 
                      borderRadius: '8px', 
                      padding: '1rem', 
                      marginBottom: '1rem',
                      textAlign: 'center',
                      color: '#8B5E3C'
                    }}>
                      Loading secure payment fields...
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                      Card Number *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div 
                        id="card-field" 
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          paddingLeft: '3rem',
                          border: '1px solid #E5DDD5',
                          borderRadius: '8px',
                          background: 'white',
                          minHeight: '44px'
                        }}
                      />
                      <CreditCard size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#8B5E3C' }} />
                    </div>
                  </div>

                  <div style={{ 
                    display: isMobile ? 'flex' : 'grid', 
                    flexDirection: isMobile ? 'column' : undefined,
                    gridTemplateColumns: isMobile ? undefined : '1fr 1fr', 
                    gap: '1rem', 
                    marginBottom: '1rem' 
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                        Expiry Date *
                      </label>
                      <div 
                        id="expiry-field" 
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #E5DDD5',
                          borderRadius: '8px',
                          background: 'white',
                          minHeight: '44px'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                        CVV *
                      </label>
                      <div 
                        id="cvv-field" 
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #E5DDD5',
                          borderRadius: '8px',
                          background: 'white',
                          minHeight: '44px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                      ID Number *
                    </label>
                    <input
                      type="text"
                      value={cardData.idNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        if (value.length <= 9) {
                          setCardData({ ...cardData, idNumber: value })
                        }
                      }}
                      maxLength={9}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: errors.idNumber ? '1px solid #ef4444' : '1px solid #E5DDD5',
                        borderRadius: '8px',
                        fontSize: isMobile ? '0.875rem' : '0.9rem',
                        boxSizing: 'border-box',
                        background: 'white'
                      }}
                      placeholder="123456789"
                    />
                    {errors.idNumber && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.idNumber}</p>}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !fieldsReady}
                  style={{
                    width: '100%',
                    padding: isMobile ? '0.875rem' : '1rem',
                    background: (isLoading || !fieldsReady) ? '#9ca3af' : '#8B5E3C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.95rem' : '1rem',
                    fontWeight: '600',
                    cursor: (isLoading || !fieldsReady) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && fieldsReady && !isMobile) {
                      (e.target as HTMLButtonElement).style.background = '#7c4a32'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && fieldsReady && !isMobile) {
                      (e.target as HTMLButtonElement).style.background = '#8B5E3C'
                    }
                  }}
                >
                  <Lock size={isMobile ? 18 : 20} />
                  {isLoading ? 'Processing...' : !fieldsReady ? 'Loading...' : 'Start Free Trial - $0.00'}
                </button>

                <p style={{ fontSize: isMobile ? '0.75rem' : '0.8rem', color: '#8B5E3C', textAlign: 'center', marginTop: '1rem', opacity: 0.8 }}>
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                  Your payment information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
