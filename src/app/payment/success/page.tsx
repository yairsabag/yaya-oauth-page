'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, MessageCircle, Calendar, Bell, AlertCircle, Loader2 } from 'lucide-react'

interface UrlParams {
  plan: string
  email: string
  price: string
  code: string
  billing: string
}

interface UpdateResponse {
  success: boolean
  message?: string
  error?: string
  user?: {
    wa_id: string
    name: string
    email: string
    plan: string
    expires_at: string
  }
}

export default function PaymentSuccessPage() {
  const [urlParams, setUrlParams] = useState<UrlParams>({
    plan: '',
    email: '',
    price: '',
    code: '',
    billing: ''
  })
  const [planUpdateStatus, setPlanUpdateStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [updateMessage, setUpdateMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Get URL parameters from window.location
    const params = new URLSearchParams(window.location.search)
    const planData = {
      plan: params.get('plan') || '',
      email: params.get('email') || '',
      price: params.get('price') || '',
      code: params.get('code') || '',
      billing: params.get('billing') || 'monthly'
    }
    setUrlParams(planData)

    // Update user plan in database after successful payment
    if (planData.code && planData.plan) {
      updateUserPlan(planData)
    } else {
      console.error('Missing required parameters:', planData)
      setPlanUpdateStatus('error')
      setUpdateMessage('Missing registration code or plan information')
    }
  }, [])

  const updateUserPlan = async (planData: UrlParams, isRetry = false) => {
  try {
    console.log('Updating user plan with:', planData)
    
    // קבל את הטוקן והתאריכים מה-URL
    const params = new URLSearchParams(window.location.search)
    const paymentToken = params.get('payment_token') || ''
    const trialStart = params.get('trial_start') || new Date().toISOString()
    const trialEnd = params.get('trial_end') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    
    // Calculate expiration date (1 month or 1 year from now)
    const expirationDate = new Date()
    if (planData.billing === 'yearly') {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1)
    } else {
      expirationDate.setMonth(expirationDate.getMonth() + 1)
    }

    // Calculate trial end date (7 days from now) - כבר יש לנו מה-URL
    const trialEndDate = new Date(trialEnd)

    const requestBody = {
      // פרטים בסיסיים
      registration_code: planData.code,
      plan: planData.plan.toLowerCase(), // Make sure plan is lowercase
      email: planData.email,
      expires_at: expirationDate.toISOString(),
      billing_type: planData.billing,
      status: 'active',
      price: planData.price,
      payment_date: new Date().toISOString(),
      trial_end_date: trialEndDate.toISOString(),
      
      // פרטי טוקן וטריאל חדשים
      payment_token: paymentToken,
      trial_start: trialStart,
      trial_end: trialEnd,
      subscription_status: 'trial_active'
    }

    console.log('Request body with token:', requestBody)

    const response = await fetch('https://n8n-TD2y.sliplane.app/webhook/update-user-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add API key if you have one:
        // 'X-API-Key': process.env.NEXT_PUBLIC_N8N_API_KEY || ''
      },
      body: JSON.stringify(requestBody)
    })

    console.log('Response status:', response.status)
    
    const responseText = await response.text()
    console.log('Response text:', responseText)
    
    // Try to parse as JSON if possible
    let result: UpdateResponse
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      // If response is empty or not JSON, treat as success if status is 200
      if (response.ok) {
        result = { success: true, message: 'Plan updated successfully' }
      } else {
        throw new Error('Invalid response from server')
      }
    }

    if (response.ok && (result.success || response.status === 200)) {
      setPlanUpdateStatus('success')
      setUpdateMessage(result.message || 'Your plan has been activated successfully!')
      
      // Save to localStorage for future reference
      localStorage.setItem('userPlan', planData.plan)
      localStorage.setItem('planExpiresAt', expirationDate.toISOString())
      localStorage.setItem('userEmail', planData.email)
      localStorage.setItem('paymentToken', paymentToken) // שמור גם את הטוקן
      
      // Track successful conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'purchase', {
          value: parseFloat(planData.price),
          currency: 'USD',
          items: [{
            item_name: planData.plan,
            price: parseFloat(planData.price),
            quantity: 1
          }]
        })
      }
    } else {
      throw new Error(result.error || result.message || 'Failed to update plan')
    }
  } catch (error) {
    console.error('Error updating user plan:', error)
    setPlanUpdateStatus('error')
    setUpdateMessage(error instanceof Error ? error.message : 'Failed to activate your plan. Please contact support.')
    
    // Save to localStorage for manual processing if needed
    localStorage.setItem('pendingPlanUpdate', JSON.stringify({
      ...planData,
      attemptedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }))

    // Retry logic
    if (!isRetry && retryCount < 3) {
      setRetryCount(prev => prev + 1)
      setTimeout(() => {
        updateUserPlan(planData, true)
      }, 2000) // Retry after 2 seconds
    }
  }
}

  const planDetails = {
    executive: {
      name: 'Executive Plan',
      features: [
        'Google Calendar integration',
        'Expense tracking',
        'Contact management',
        'Recurring reminders',
        'Web search',
        '100 voice messages/month'
      ]
    },
    ultimate: {
      name: 'Ultimate Plan',
      features: [
        'All Executive features',
        'Food & calorie tracking',
        'Advanced analytics',
        '500 voice messages/month',
        '100 image analyses/month',
        'Priority support'
      ]
    }
  }

  const currentPlan = planDetails[urlParams.plan as keyof typeof planDetails] || planDetails.executive

  // Fixed Google OAuth URL with correct redirect to n8n
  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=314964896562-o93h71h2cpiqgcikaqeg2a34ht2ipl2j.apps.googleusercontent.com&redirect_uri=https://n8n-td2y.sliplane.app/webhook/google-oauth-callback&response_type=code&scope=openid%20email%20https://www.googleapis.com/auth/calendar&state=${urlParams.code}&access_type=offline&prompt=consent`

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
        </div>
      </header>

      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          {/* Success Animation */}
          <div style={{ marginBottom: '2rem', position: 'relative' }}>
            {planUpdateStatus === 'loading' ? (
              <Loader2 size={80} style={{ color: '#8B5E3C', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            ) : planUpdateStatus === 'success' ? (
              <CheckCircle size={80} style={{ color: '#25d366', margin: '0 auto', animation: 'scale-in 0.5s ease-out' }} />
            ) : (
              <AlertCircle size={80} style={{ color: '#ef4444', margin: '0 auto' }} />
            )}
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: '400', color: '#8B5E3C', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            {planUpdateStatus === 'loading' ? '⏳ Setting up your account...' : '🎉 Payment Successful!'}
          </h1>

          {/* Status Messages */}
          {planUpdateStatus === 'loading' && (
            <div style={{ background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', borderRadius: '8px', padding: '16px', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              <p style={{ color: '#f59e0b', fontSize: '1rem', margin: 0 }}>
                <Loader2 size={16} style={{ display: 'inline', marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                Activating your {currentPlan.name}... This may take a few seconds.
              </p>
            </div>
          )}

          {planUpdateStatus === 'success' && (
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', padding: '16px', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              <p style={{ color: '#22c55e', fontSize: '1rem', margin: 0 }}>
                ✅ {updateMessage}
              </p>
            </div>
          )}

          {planUpdateStatus === 'error' && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '16px', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              <p style={{ color: '#ef4444', fontSize: '1rem', margin: 0, marginBottom: '8px' }}>
                ⚠️ {updateMessage}
              </p>
              <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0, opacity: 0.8 }}>
                Don't worry - your payment went through! Our team will activate your account shortly.
              </p>
            </div>
          )}

          <p style={{ fontSize: '1.2rem', color: '#718096', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Your 7-day free trial has started! Connect your Google account to activate calendar integration:
          </p>

          {/* Google OAuth Button */}
          <div style={{ marginBottom: '3rem' }}>
            <a 
              href={googleOAuthUrl}
              style={{ 
                background: '#4285f4', 
                color: 'white', 
                padding: '16px 32px', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                const el = e.target as HTMLElement
                el.style.background = '#3367d6'
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = '0 6px 16px rgba(66, 133, 244, 0.4)'
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLElement
                el.style.background = '#4285f4'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Connect Google Account
            </a>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '3rem', fontStyle: 'italic' }}>
            Optional: Connect Google for calendar features. You can skip this and do it later.
          </p>

          {/* Getting Started Steps */}
          <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: '2rem', border: '1px solid #E5DDD5', marginBottom: '3rem', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1.5rem', textAlign: 'center' }}>
              🚀 Get Started in 3 Steps
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ background: 'rgba(139, 94, 60, 0.1)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageCircle size={24} style={{ color: '#8B5E3C' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    1. Message Yaya on WhatsApp
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                    Send: "My code: <strong>{urlParams.code}</strong>" to activate
                  </p>
                  <a 
                    href={`https://wa.me/972559943649?text=My code: ${urlParams.code}`}
                    style={{ 
                      display: 'inline-block',
                      background: '#25d366', 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '6px', 
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      const el = e.target as HTMLElement
                      el.style.background = '#22c55e'
                      el.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.target as HTMLElement
                      el.style.background = '#25d366'
                      el.style.transform = 'scale(1)'
                    }}
                  >
                    Open WhatsApp
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ background: 'rgba(139, 94, 60, 0.1)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={24} style={{ color: '#8B5E3C' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    2. Connect Your Calendar (Optional)
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                    Link Google Calendar for meeting scheduling and calendar reminders
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ background: 'rgba(139, 94, 60, 0.1)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bell size={24} style={{ color: '#8B5E3C' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    3. Try Your First Command
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                    "Remind me to call mom tomorrow at 3pm" or "Add milk to my shopping list"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5DDD5', marginBottom: '2rem', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1rem' }}>
              📧 Your Subscription
            </h3>
            <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>Email:</span>
                  <span style={{ color: '#8B5E3C', fontSize: '0.9rem', fontWeight: '500' }}>{urlParams.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>Plan:</span>
                  <span style={{ color: '#8B5E3C', fontSize: '0.9rem', fontWeight: '500' }}>
                    {currentPlan.name} - ${urlParams.price}/{urlParams.billing === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>Registration Code:</span>
                  <span style={{ color: '#8B5E3C', fontSize: '0.9rem', fontWeight: '500', fontFamily: 'monospace' }}>{urlParams.code || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>Trial Period:</span>
                  <span style={{ color: '#8B5E3C', fontSize: '0.9rem', fontWeight: '500' }}>
                    7 days (ends {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()})
                  </span>
                </div>
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(139, 94, 60, 0.2)' }}>
                  <p style={{ color: '#8B5E3C', fontSize: '0.85rem', margin: 0, opacity: 0.8 }}>
                    💡 Cancel anytime during trial - no charges
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Included */}
          <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: '16px', padding: '1.5rem', marginBottom: '3rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1rem' }}>
              ✨ What's Included in Your {currentPlan.name}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', textAlign: 'left' }}>
              {currentPlan.features.map((feature, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} style={{ color: '#25d366', flexShrink: 0 }} />
                  <span style={{ color: '#8B5E3C', fontSize: '0.9rem' }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href={`https://wa.me/972559943649?text=My code: ${urlParams.code}`}
              style={{ 
                background: '#8B5E3C', 
                color: 'white', 
                padding: '12px 24px', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(139, 94, 60, 0.3)'
              }}
              onMouseEnter={(e) => {
                const el = e.target as HTMLElement
                el.style.background = '#7c4a32'
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = '0 4px 12px rgba(139, 94, 60, 0.4)'
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLElement
                el.style.background = '#8B5E3C'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = '0 2px 8px rgba(139, 94, 60, 0.3)'
              }}
            >
              <MessageCircle size={20} />
              Start Using Yaya
            </a>
            <a 
              href="/" 
              style={{ 
                background: 'transparent', 
                color: '#8B5E3C', 
                padding: '12px 24px', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: '600',
                border: '1px solid #8B5E3C',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const el = e.target as HTMLElement
                el.style.background = '#8B5E3C'
                el.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLElement
                el.style.background = 'transparent'
                el.style.color = '#8B5E3C'
              }}
            >
              Back to Home
            </a>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '2rem' }}>
            Need help? Contact us at <a href="mailto:info@textcoco.com" style={{ color: '#8B5E3C', textDecoration: 'underline' }}>info@textcoco.com</a>
          </p>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes scale-in {
          from { 
            transform: scale(0);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
