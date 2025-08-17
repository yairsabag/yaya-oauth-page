// src/app/payment/checkout/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Lock } from 'lucide-react'

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState({
    plan: '',
    price: '',
    billing: '',
    code: '',
    planName: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    setTimeout(() => setIsLoading(false), 600)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Get URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const extractedParams = {
      plan: params.get('plan') || 'executive',
      price: params.get('price') || '5',
      billing: params.get('billing') || 'monthly',
      code: params.get('code') || 'F75CEJ',
      planName: params.get('planName') || 'Executive Plan'
    }
    setUrlParams(extractedParams)
  }, [])

  const planDetails = {
    executive: {
      name: 'Executive Plan',
      features: [
        'Google Calendar integration',
        'Expense tracking',
        'Contact management',
        'Recurring reminders'
      ]
    },
    ultimate: {
      name: 'Ultimate Plan',
      features: [
        'All Executive features',
        'Food & calorie tracking',
        'Advanced analytics',
        'Priority support'
      ]
    }
  }

  const currentPlan =
    planDetails[urlParams.plan as keyof typeof planDetails] || planDetails.executive

  // Build iframe URL with Recurring Payment (7-day trial then monthly USD)
  const buildIframeUrl = () => {
    const baseUrl = 'https://direct.tranzila.com/fxpyairsabag/iframenew.php'

    // Calculate recurring start date (7 days from now)
    const recurStart = new Date()
    recurStart.setDate(recurStart.getDate() + 7)
    const yyyy = recurStart.getFullYear()
    const mm = String(recurStart.getMonth() + 1).padStart(2, '0')
    const dd = String(recurStart.getDate()).padStart(2, '0')
    const recurStartDate = `${yyyy}-${mm}-${dd}` // yyyy-mm-dd format

    const params = new URLSearchParams({
      // Transaction type: A = standard charge (needed for recurring setup)
      tranmode: 'A',
      
      // Trial amount: minimal charge to validate card (cannot be 0)
      sum: '0.01',
      
      // Currency: 2 = USD (ensure your terminal supports USD!)
      // If not supported, use currency: '1' (ILS) and convert prices
      currency: '2',
      
      // RECURRING PAYMENT SETUP
      recur_transaction: '4_approved', // 4 = monthly, _approved = automatic (no customer choice)
      recur_sum: urlParams.price || '5', // Monthly recurring amount in USD
      recur_start_date: recurStartDate, // Start recurring after 7 days
      // Optional: limit number of payments
      // recur_payments: '12', // Uncomment to limit to 12 months
      
      // PRODUCT DESCRIPTION
      pdesc: `Yaya ${urlParams.planName} - 7-Day Trial + Monthly $${urlParams.price}`,
      
      // STYLING
      trBgColor: 'FAF5F0',
      trTextColor: '2D5016',
      trButtonColor: '8B5E3C',
      buttonLabel: 'Start Trial - $0.01 Today',
      
      // REDIRECT URLs
      success_url_address: `${window.location.origin}/api/tranzila/success-bridge`,
      fail_url_address: `${window.location.origin}/api/tranzila/fail-bridge`,
      
      // WEBHOOK for backend notification
      notify_url_address: 'https://n8n-TD2y.sliplane.app/webhook/update-user-plan',
      
      // CUSTOM FIELDS for tracking (will be returned in response)
      u1: urlParams.code,        // Registration code
      u2: urlParams.plan,        // Plan type
      u3: urlParams.billing,     // Billing cycle
      u4: urlParams.price,       // Price
      u5: recurStartDate,        // When recurring starts
      u6: 'trial',               // Payment type identifier
      
      // OPTIONAL: Customer information (if available)
      // contact: 'customer@email.com',
      // company: 'Customer Company Name',
      
      // LANGUAGE
      lang: 'il' // Hebrew interface
    })

    return `${baseUrl}?${params.toString()}`
  }

  // Convert price for display based on currency
  const getDisplayPrice = (price: string, isTrial: boolean = false) => {
    if (isTrial) return '$0.01'
    return `$${price}`
  }

  return (
    <div style={{ 
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)' 
    }}>
      {/* Header */}
      <header style={{ 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid rgba(0,0,0,0.05)', 
        padding: '1rem 0' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: isMobile ? '0 1rem' : '0 2rem', 
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
              style={{ 
                width: isMobile ? '60px' : '80px', 
                height: isMobile ? '60px' : '80px', 
                objectFit: 'contain' 
              }}
            />
            <span style={{ 
              fontSize: isMobile ? '1.25rem' : '1.5rem', 
              fontWeight: '600', 
              color: '#2d5016' 
            }}>
              Yaya
            </span>
          </a>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: '#4a5568' 
          }}>
            <Shield size={16} />
            {!isMobile && <span style={{ fontSize: '0.9rem' }}>Secure Checkout</span>}
          </div>
        </div>
      </header>

      <main style={{ padding: isMobile ? '1.5rem 0' : '3rem 0' }}>
        <div style={{ 
          maxWidth: '1100px', 
          margin: '0 auto', 
          padding: isMobile ? '0 1rem' : '0 2rem' 
        }}>
          {/* Progress Indicator */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              marginBottom: '1rem' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  background: '#8B5E3C', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.875rem', 
                  fontWeight: '600' 
                }}>
                  1
                </div>
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: '#8B5E3C', 
                  fontWeight: '500' 
                }}>
                  Plan Selection
                </span>
              </div>
              <div style={{ width: '50px', height: '2px', background: '#8B5E3C' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  background: '#8B5E3C', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.875rem', 
                  fontWeight: '600' 
                }}>
                  2
                </div>
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: '#8B5E3C', 
                  fontWeight: '500' 
                }}>
                  Payment
                </span>
              </div>
              <div style={{ width: '50px', height: '2px', background: '#E5DDD5' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  background: '#E5DDD5', 
                  color: '#8B5E3C', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.875rem', 
                  fontWeight: '600' 
                }}>
                  3
                </div>
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: '#8B5E3C', 
                  opacity: 0.6 
                }}>
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          <div style={{
            display: isMobile ? 'flex' : 'grid',
            flexDirection: isMobile ? 'column' : undefined,
            gridTemplateColumns: isMobile ? undefined : '1fr 2fr',
            gap: isMobile ? '2rem' : '3rem'
          }}>
            {/* Order Summary */}
            <div style={{ order: 1 }}>
              <h2 style={{ 
                fontSize: isMobile ? '1.3rem' : '1.5rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem', 
                color: '#8B5E3C' 
              }}>
                Order Summary
              </h2>

              <div style={{ 
                background: 'white', 
                borderRadius: '20px', 
                padding: isMobile ? '1.5rem' : '2rem', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
                border: '1px solid rgba(0,0,0,0.05)' 
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: isMobile ? '1.1rem' : '1.2rem', 
                    fontWeight: '600', 
                    color: '#8B5E3C', 
                    marginBottom: '0.5rem' 
                  }}>
                    {currentPlan.name}
                  </h3>
                  <p style={{ 
                    color: '#8B5E3C', 
                    fontSize: isMobile ? '0.875rem' : '0.9rem', 
                    opacity: 0.8 
                  }}>
                    7-day trial, then {urlParams.billing === 'yearly' ? 'annual' : 'monthly'} subscription
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
                    <p style={{ 
                      color: '#25d366', 
                      fontSize: isMobile ? '0.875rem' : '0.9rem', 
                      fontWeight: '600', 
                      margin: 0 
                    }}>
                      Registration Code: {urlParams.code}
                    </p>
                  </div>
                )}

                {/* Features */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    fontSize: '0.9rem', 
                    color: '#8B5E3C', 
                    fontWeight: '600', 
                    marginBottom: '0.75rem', 
                    opacity: 0.8 
                  }}>
                    Included Features:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {currentPlan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} style={{ 
                        fontSize: '0.85rem', 
                        color: '#8B5E3C', 
                        marginBottom: '0.5rem', 
                        opacity: 0.9 
                      }}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ 
                  borderTop: '1px solid #E5DDD5', 
                  paddingTop: '1rem', 
                  marginBottom: '1rem' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '0.5rem', 
                    color: '#8B5E3C', 
                    fontSize: isMobile ? '0.875rem' : '1rem' 
                  }}>
                    <span>7-day trial (today)</span>
                    <span style={{ color: '#25d366', fontWeight: '600' }}>
                      {getDisplayPrice('', true)}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '0.5rem', 
                    color: '#8B5E3C', 
                    fontSize: isMobile ? '0.875rem' : '1rem' 
                  }}>
                    <span>Then {urlParams.billing === 'yearly' ? 'annually' : 'monthly'}</span>
                    <span>
                      {getDisplayPrice(urlParams.price)}/{urlParams.billing === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontWeight: '600', 
                    fontSize: isMobile ? '1rem' : '1.1rem', 
                    color: '#8B5E3C' 
                  }}>
                    <span>Total today</span>
                    <span style={{ color: '#25d366' }}>
                      {getDisplayPrice('', true)}
                    </span>
                  </div>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: '#8B5E3C', 
                    opacity: 0.7, 
                    margin: '0.5rem 0 0 0' 
                  }}>
                    Recurring {getDisplayPrice(urlParams.price)} monthly starting {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Important Notice */}
              <div style={{
                background: 'rgba(255, 193, 7, 0.1)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                marginTop: '1rem'
              }}>
                <p style={{ 
                  color: '#d4701a', 
                  fontSize: '0.85rem', 
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  <strong>Important:</strong> Your card will be charged $0.01 today to validate it. 
                  Your monthly subscription of {getDisplayPrice(urlParams.price)} will automatically 
                  start in 7 days. Cancel anytime before then.
                </p>
              </div>
            </div>

            {/* Payment Iframe */}
            <div style={{ order: 2 }}>
              <h2 style={{ 
                fontSize: isMobile ? '1.3rem' : '1.5rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem', 
                color: '#8B5E3C' 
              }}>
                Complete Your Order
              </h2>

              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '0',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.05)',
                minHeight: isMobile ? '600px' : '650px'
              }}>
                {isLoading ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '600px',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      border: '4px solid #E5DDD5',
                      borderTopColor: '#8B5E3C',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ color: '#8B5E3C', fontSize: '0.9rem' }}>
                      Loading secure payment form...
                    </p>
                  </div>
                ) : (
                  <iframe
                    src={buildIframeUrl()}
                    style={{
                      width: '100%',
                      height: isMobile ? '650px' : '700px',
                      border: 'none',
                      display: 'block'
                    }}
                    title="Secure Payment Form"
                    allow="payment"
                    sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              marginBottom: '0.5rem' 
            }}>
              <Lock size={16} style={{ color: '#718096' }} />
              <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>
                SSL Encrypted & PCI DSS Compliant
              </p>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#718096', margin: 0 }}>
              Your payment information is encrypted and secure. We never store your credit card details.
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
