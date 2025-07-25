'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, MessageCircle, Calendar, Bell } from 'lucide-react'

export default function SuccessPage() {
  const [urlParams, setUrlParams] = useState({
    plan: '',
    email: '',
    price: '',
    code: '',
    billing: ''
  })
  const [planUpdateStatus, setPlanUpdateStatus] = useState<'loading' | 'success' | 'error'>('loading')

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
    updateUserPlan(planData)
  }, [])

  const updateUserPlan = async (planData: typeof urlParams) => {
    if (!planData.code || !planData.plan) {
      setPlanUpdateStatus('error')
      return
    }

    try {
      // Calculate expiration date (1 month or 1 year from now)
      const expirationDate = new Date()
      if (planData.billing === 'yearly') {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1)
      } else {
        expirationDate.setMonth(expirationDate.getMonth() + 1)
      }

      const response = await fetch('https://n8n-TD2y.sliplane.app/webhook/update-user-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registration_code: planData.code,
          plan: planData.plan,
          email: planData.email,
          expires_at: expirationDate.toISOString(),
          billing_type: planData.billing,
          status: 'active'
        })
      })

      if (response.ok) {
        setPlanUpdateStatus('success')
        console.log('User plan updated successfully')
      } else {
        throw new Error('Failed to update plan')
      }
    } catch (error) {
      console.error('Error updating user plan:', error)
      setPlanUpdateStatus('error')
    }
  }

  const planNames = {
    executive: 'Executive Plan',
    ultimate: 'Ultimate Plan'
  }

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
          <div style={{ marginBottom: '2rem' }}>
            <CheckCircle size={80} style={{ color: '#25d366', margin: '0 auto' }} />
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: '400', color: '#8B5E3C', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            🎉 Payment Successful!
          </h1>

          {planUpdateStatus === 'loading' && (
            <div style={{ background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '2rem' }}>
              <p style={{ color: '#f59e0b', fontSize: '0.9rem', margin: 0 }}>
                ⏳ Setting up your account...
              </p>
            </div>
          )}

          {planUpdateStatus === 'success' && (
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '2rem' }}>
              <p style={{ color: '#22c55e', fontSize: '0.9rem', margin: 0 }}>
                ✅ Your account is ready! Connect Google to unlock all features.
              </p>
            </div>
          )}

          {planUpdateStatus === 'error' && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '2rem' }}>
              <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0 }}>
                ⚠️ There was an issue setting up your account. Don't worry - your payment went through. Contact support if needed.
              </p>
            </div>
          )}

          <p style={{ fontSize: '1.2rem', color: '#718096', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Your 7-day free trial has started! Connect your Google account to activate calendar & reminders:
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
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#3367d6'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#4285f4'}
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
            Your data is encrypted and only used to help you manage your day via WhatsApp.
          </p>

          <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: '2rem', border: '1px solid #E5DDD5', marginBottom: '3rem', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1.5rem', textAlign: 'center' }}>
              🚀 Get Started in 3 Steps
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(139, 94, 60, 0.1)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageCircle size={24} style={{ color: '#8B5E3C' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    1. Message Yaya on WhatsApp
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                    Send: "My code: {urlParams.code}" to activate your {planNames[urlParams.plan as keyof typeof planNames]}
                  </p>
                  <a 
                    href={`https://wa.me/972559943649?text=My code: ${urlParams.code}`}
                    style={{ 
                      display: 'inline-block',
                      marginTop: '0.5rem',
                      background: '#25d366', 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '6px', 
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#22c55e'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#25d366'}
                  >
                    Open WhatsApp
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(139, 94, 60, 0.1)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={24} style={{ color: '#8B5E3C' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    2. Connect Your Calendar (Above)
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                    Link your Google Calendar for seamless scheduling
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(139, 94, 60, 0.1)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bell size={24} style={{ color: '#8B5E3C' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    3. Set Your First Reminder
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                    Try: "Remind me to call mom tomorrow at 3pm"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5DDD5', marginBottom: '2rem', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1rem' }}>
              📧 Subscription Details
            </h3>
            <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {urlParams.email}
              </p>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Plan:</strong> {planNames[urlParams.plan as keyof typeof planNames]} - ${urlParams.price}/{urlParams.billing === 'yearly' ? 'year' : 'month'}
              </p>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Registration Code:</strong> {urlParams.code || 'N/A'}
              </p>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Trial Period:</strong> 7 days (ends {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()})
              </p>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Cancel Anytime:</strong> No commitment during trial
              </p>
            </div>
          </div>

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
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#7c4a32'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#8B5E3C'}
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
                (e.target as HTMLElement).style.background = '#8B5E3C'
                ;(e.target as HTMLElement).style.color = 'white'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'transparent'
                ;(e.target as HTMLElement).style.color = '#8B5E3C'
              }}
            >
              Back to Home
            </a>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '2rem' }}>
            Need help? Contact us at <a href="mailto:info@textcoco.com" style={{ color: '#8B5E3C' }}>info@textcoco.com</a>
          </p>
        </div>
      </main>
    </div>
  )
}
