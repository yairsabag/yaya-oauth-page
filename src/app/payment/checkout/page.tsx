'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Shield, CreditCard, Lock } from 'lucide-react'

declare global {
  interface Window {
    TzlaHostedFields: any;
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

  // Initialize Tranzila Hosted Fields
  useEffect(() => {
    // Add custom styles for hosted fields
    const style = document.createElement('style');
    style.textContent = `
      #card-number, #expiry, #cvv {
        padding: 12px !important;
      }
      #card-number iframe, #expiry iframe, #cvv iframe {
        width: 100% !important;
        height: 44px !important;
        vertical-align: middle !important;
      }
      .hosted-field-focus {
        border-color: #8B5E3C !important;
        box-shadow: 0 0 0 3px rgba(139, 94, 60, 0.1) !important;
      }
    `;
    document.head.appendChild(style);

    // Load Tranzila Hosted Fields script
    const script = document.createElement('script')
    script.src = 'https://hf.tranzila.com/assets/js/thostedf.js'
    script.async = true
    script.onload = () => {
      if (window.TzlaHostedFields) {
        fieldsRef.current = window.TzlaHostedFields.create({
          sandbox: false,
          fields: {
            credit_card_number: {
              selector: '#card-number',
              placeholder: '4580 4580 4580 4580'
            },
            cvv: {
              selector: '#cvv',
              placeholder: '123'
            },
            expiry: {
              selector: '#expiry',
              placeholder: 'MM/YY',
              version: '1'
            }
          },
          styles: {
            'input': {
              'font-family': 'system-ui, -apple-system, sans-serif',
              'font-size': '14px',
              'color': '#000',
              'line-height': '1.5',
              'letter-spacing': '0.5px'
            },
            ':focus': {
              'outline': 'none'
            },
            '.hosted-fields-invalid': {
              'color': '#ef4444'
            },
            '.hosted-fields-valid': {
              'color': '#10b981'
            }
          }
        })
        
        // Listen for ready event
        fieldsRef.current?.onEvent('ready', () => {
          setFieldsReady(true)
        })
        
        // Listen for focus events
        fieldsRef.current?.onEvent('focus', (event: any) => {
          const element = document.getElementById(event.field);
          if (element) {
            element.classList.add('hosted-field-focus');
          }
        })
        
        fieldsRef.current?.onEvent('blur', (event: any) => {
          const element = document.getElementById(event.field);
          if (element) {
            element.classList.remove('hosted-field-focus');
          }
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  const planNames = {
    executive: 'Executive Plan',
    ultimate: 'Ultimate Plan'
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

    // Use Tranzila Hosted Fields to charge
    fieldsRef.current.charge({
      terminal_name: process.env.NEXT_PUBLIC_TRANZILA_TERMINAL || 'fxpyairsabagtok',
      amount: parseFloat(urlParams.price),
      contact: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      credit_card_holder_id: cardData.idNumber,
      // Additional fields
      custom1: urlParams.code,
      custom2: urlParams.plan,
      custom3: urlParams.billing,
      pdesc: `Yaya ${urlParams.plan} - ${urlParams.billing}`,
      // 7 days trial
      tranmode: 'VK', // Verify with token creation
      currency: '2', // USD
    }, async (err: any, response: any) => {
      if (err) {
        console.error('Payment error:', err)
        handleErrors(err)
        setIsLoading(false)
        return
      }
      
      if (response && response.transaction_response) {
        if (response.transaction_response.success) {
          // Update user plan in the database
          try {
            await fetch('https://n8n-TD2y.sliplane.app/webhook/update-user-plan', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                registration_code: urlParams.code,
                plan: urlParams.plan,
                email: formData.email,
                expires_at: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
                billing_type: urlParams.billing,
                status: 'active',
                transaction_id: response.transaction_response.transaction_id,
                token: response.transaction_response.token
              })
            });
          } catch (error) {
            console.error('Failed to update plan:', error)
          }
          
          // Redirect to success page
          const successUrl = new URL(window.location.origin + '/payment/success')
          successUrl.searchParams.set('plan', urlParams.plan)
          successUrl.searchParams.set('email', formData.email)
          successUrl.searchParams.set('price', urlParams.price)
          successUrl.searchParams.set('billing', urlParams.billing)
          successUrl.searchParams.set('code', urlParams.code)
          successUrl.searchParams.set('transactionId', response.transaction_response.transaction_id)
          
          window.location.href = successUrl.toString()
        } else {
          alert(response.transaction_response.error || 'Payment failed. Please check your details and try again.')
          setIsLoading(false)
        }
      }
    })
  }

  const handleErrors = (error: any) => {
    if (error.messages) {
      error.messages.forEach((message: any) => {
        if (message.param === 'number') {
          setErrors(prev => ({ ...prev, cardNumber: message.message }))
        } else if (message.param === 'cvv') {
          setErrors(prev => ({ ...prev, cvv: message.message }))
        } else if (message.param === 'expiry') {
          setErrors(prev => ({ ...prev, expiry: message.message }))
        }
      })
    } else {
      alert('Payment error. Please try again.')
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
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                      Card Number *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div 
                        id="card-number" 
                        style={{
                          width: '100%',
                          paddingLeft: '3rem',
                          border: errors.cardNumber ? '1px solid #ef4444' : '1px solid #E5DDD5',
                          borderRadius: '8px',
                          background: 'white',
                          minHeight: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          position: 'relative'
                        }}
                      />
                      <CreditCard size={20} style={{ position: 'absolute', left: '1rem', top: '12px', color: '#8B5E3C', pointerEvents: 'none' }} />
                    </div>
                    {errors.cardNumber && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.cardNumber}</p>}
                  </div>

                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1rem', 
                    marginBottom: '1rem' 
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                        Expiry Date *
                      </label>
                      <div 
                        id="expiry" 
                        style={{
                          width: '100%',
                          border: errors.expiry ? '1px solid #ef4444' : '1px solid #E5DDD5',
                          borderRadius: '8px',
                          background: 'white',
                          minHeight: '44px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      />
                      {errors.expiry && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.expiry}</p>}
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: isMobile ? '0.875rem' : '0.9rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                        CVV *
                      </label>
                      <div 
                        id="cvv" 
                        style={{
                          width: '100%',
                          border: errors.cvv ? '1px solid #ef4444' : '1px solid #E5DDD5',
                          borderRadius: '8px',
                          background: 'white',
                          minHeight: '44px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      />
                      {errors.cvv && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.cvv}</p>}
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
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 9) {
                          setCardData({ ...cardData, idNumber: value });
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
                    background: isLoading || !fieldsReady ? '#9ca3af' : '#8B5E3C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.95rem' : '1rem',
                    fontWeight: '600',
                    cursor: isLoading || !fieldsReady ? 'not-allowed' : 'pointer',
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
                  {!fieldsReady ? 'Loading...' : isLoading ? 'Processing...' : 'Start Free Trial - $0.00'}
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
