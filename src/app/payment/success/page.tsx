'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, MessageCircle, Calendar, Bell } from 'lucide-react'

export default function SuccessPage() {
  const [urlParams, setUrlParams] = useState({
    plan: '',
    email: '',
    price: '',
    code: ''
  })

  useEffect(() => {
    // Get URL parameters from window.location
    const params = new URLSearchParams(window.location.search)
    setUrlParams({
      plan: params.get('plan') || '',
      email: params.get('email') || '',
      price: params.get('price') || '',
      code: params.get('code') || ''
    })
  }, [])

  const planNames = {
    executive: 'Executive Plan',
    ultimate: 'Ultimate Plan'
  }

  // Google OAuth URL with registration code
  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=https://yairsabag.app.n8n.cloud/webhook/google-oauth-callback&response_type=code&scope=https://www.googleapis.com/auth/calendar&state=${urlParams.code}`

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
            🎉 You're Almost Done!
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#718096', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            To activate smart features like calendar & reminders, connect your Google account:
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
                    Send a message to +972 55-994-3649 to activate your account
                  </p>
                  <a 
                    href="https://wa.me/972559943649?text=Hi! I just subscribed to the Executive plan" 
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
                    2. Connect Your Calendar
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                    Link your Google or Outlook calendar for seamless scheduling
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
              📧 Important Details
            </h3>
            <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {urlParams.email}
              </p>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Plan:</strong> {planNames[urlParams.plan as keyof typeof planNames]} - ${urlParams.price}/month
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
              href="https://wa.me/972559943649?text=Hi! I just subscribed to Yaya and want to get started" 
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
