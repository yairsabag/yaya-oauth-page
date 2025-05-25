'use client'

import React, { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, MessageCircle, Calendar, Bell } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const email = searchParams.get('email')

  const planNames = {
    executive: 'Executive Plan',
    ultimate: 'Ultimate Plan'
  }

  return (
    <div style={{ fontFamily: "Lato, system-ui, -apple-system, sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf0e6 0%, #f5e6d3 100%)' }}>
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
        </div>
      </header>

      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          {/* Success Animation */}
          <div style={{ marginBottom: '2rem' }}>
            <CheckCircle size={80} style={{ color: '#10b981', margin: '0 auto' }} />
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#3d2817', marginBottom: '1rem', fontFamily: "Montserrat, sans-serif" }}>
            Welcome to Yaya! 🎉
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#6b4e3d', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Your {planNames[plan as keyof typeof planNames] || 'subscription'} trial has started! 
            You have 7 days to explore all features completely free.
          </p>

          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e6d3c1', marginBottom: '3rem', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>
              🚀 Get Started in 3 Steps
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#faf0e6', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageCircle size={24} style={{ color: '#a67c5a' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                    1. Message Yaya on WhatsApp
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
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
                      fontWeight: '600'
                    }}
                  >
                    Open WhatsApp
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#faf0e6', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={24} style={{ color: '#a67c5a' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                    2. Connect Your Calendar
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Link your Google or Outlook calendar for seamless scheduling
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#faf0e6', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bell size={24} style={{ color: '#a67c5a' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                    3. Set Your First Reminder
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Try: "Remind me to call mom tomorrow at 3pm"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e6d3c1', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
              📧 Important Details
            </h3>
            <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
              <p style={{ color: '#6b4e3d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {email}
              </p>
              <p style={{ color: '#6b4e3d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Trial Period:</strong> 7 days (ends {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()})
              </p>
              <p style={{ color: '#6b4e3d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Cancel Anytime:</strong> No commitment during trial
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="https://wa.me/972559943649" 
              style={{ 
                background: 'linear-gradient(135deg, #a67c5a 0%, #8b5a3c 100%)', 
                color: 'white', 
                padding: '12px 24px', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <MessageCircle size={20} />
              Start Using Yaya
            </a>
            <Link 
              href="/" 
              style={{ 
                background: 'transparent', 
                color: '#a67c5a', 
                padding: '12px 24px', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: '600',
                border: '1px solid #a67c5a'
              }}
            >
              Back to Home
            </Link>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2rem' }}>
            Need help? Contact us at <a href="mailto:info@textcoco.com" style={{ color: '#a67c5a' }}>info@textcoco.com</a>
          </p>
        </div>
      </main>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
