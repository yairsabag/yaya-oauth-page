'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, MessageCircle, Calendar, Bell } from 'lucide-react'

export default function SuccessPage() {
  const [urlParams, setUrlParams] = useState({
    plan: '',
    email: '',
    price: ''
  })

  useEffect(() => {
    // Get URL parameters from window.location
    const params = new URLSearchParams(window.location.search)
    setUrlParams({
      plan: params.get('plan') || '',
      email: params.get('email') || '',
      price: params.get('price') || ''
    })
  }, [])

  const planNames = {
    executive: 'Executive Plan',
    ultimate: 'Ultimate Plan'
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
        </div>
      </header>

      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          {/* Success Animation */}
          <div style={{ marginBottom: '2rem' }}>
            <CheckCircle size={80} style={{ color: '#25d366', margin: '0 auto' }} />
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: '400', color: '#8B5E3C', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Welcome to Yaya! 🎉
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#718096', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Your {planNames[urlParams.plan as keyof typeof planNames] || 'subscription'} trial has started! 
            You have 7 days to explore all features completely free.
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
