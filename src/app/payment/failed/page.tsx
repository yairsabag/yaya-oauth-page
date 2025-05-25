'use client'

import React from 'react'
import { XCircle, RefreshCw, MessageCircle, Mail } from 'lucide-react'

export default function FailedPage() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' }}>
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
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          {/* Error Icon */}
          <div style={{ marginBottom: '2rem' }}>
            <XCircle size={80} style={{ color: '#ef4444', margin: '0 auto' }} />
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '400', color: '#8B5E3C', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Payment Failed
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#718096', marginBottom: '2rem', lineHeight: '1.6' }}>
            We couldn't process your payment. Don't worry - this happens sometimes and no charge was made to your account.
          </p>

          <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: '2rem', border: '1px solid #E5DDD5', marginBottom: '3rem', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1.5rem', textAlign: 'center' }}>
              🔧 Common Solutions
            </h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(139, 94, 60, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 94, 60, 0.2)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                  💳 Check Your Card Details
                </h3>
                <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                  Make sure your card number, expiry date, and CVV are correct
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(139, 94, 60, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 94, 60, 0.2)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                  💰 Verify Available Balance
                </h3>
                <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                  Ensure your card has sufficient funds and isn't blocked
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(139, 94, 60, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 94, 60, 0.2)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                  🌍 International Payments
                </h3>
                <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                  Some banks block international transactions - contact your bank if needed
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(139, 94, 60, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 94, 60, 0.2)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                  🔄 Try a Different Card
                </h3>
                <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                  Use another payment method if available
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <a 
              href="/payment"
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
              <RefreshCw size={20} />
              Try Again
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

          <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5DDD5' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1rem' }}>
              Still Having Issues?
            </h3>
            <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.8 }}>
              Our team is here to help! Contact us and we'll resolve this quickly.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a 
                href="https://wa.me/972559943649?text=Hi! I'm having trouble with payment for Yaya subscription" 
                style={{ 
                  background: '#25d366', 
                  color: 'white', 
                  padding: '10px 20px', 
                  borderRadius: '6px', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#22c55e'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#25d366'}
              >
                <MessageCircle size={18} />
                WhatsApp Support
              </a>
              <a 
                href="mailto:info@textcoco.com?subject=Payment Issue - Yaya Subscription" 
                style={{ 
                  background: 'transparent', 
                  color: '#8B5E3C', 
                  padding: '10px 20px', 
                  borderRadius: '6px', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  border: '1px solid #8B5E3C',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
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
                <Mail size={18} />
                Email Us
              </a>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <p style={{ fontSize: '0.8rem', color: '#ef4444' }}>
              <strong>No charges were made.</strong> Your card was not charged for this failed transaction.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
