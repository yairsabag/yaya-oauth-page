'use client'

import React from 'react'
import Link from 'next/link'
import { XCircle, RefreshCw, MessageCircle, Mail } from 'lucide-react'

export default function FailedPage() {
  return (
    <div style={{ fontFamily: "Lato, system-ui, -apple-system, sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' }}>
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
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          {/* Error Icon */}
          <div style={{ marginBottom: '2rem' }}>
            <XCircle size={80} style={{ color: '#ef4444', margin: '0 auto' }} />
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1f2937', marginBottom: '1rem', fontFamily: "Montserrat, sans-serif" }}>
            Payment Failed
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem', lineHeight: '1.6' }}>
            We couldn't process your payment. Don't worry - this happens sometimes and no charge was made to your account.
          </p>

          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #fecaca', marginBottom: '3rem', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>
              🔧 Common Solutions
            </h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '0.5rem', border: '1px solid #fde047' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#854d0e', marginBottom: '0.5rem' }}>
                  💳 Check Your Card Details
                </h3>
                <p style={{ color: '#a16207', fontSize: '0.9rem' }}>
                  Make sure your card number, expiry date, and CVV are correct
                </p>
              </div>

              <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '0.5rem', border: '1px solid #fde047' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#854d0e', marginBottom: '0.5rem' }}>
                  💰 Verify Available Balance
                </h3>
                <p style={{ color: '#a16207', fontSize: '0.9rem' }}>
                  Ensure your card has sufficient funds and isn't blocked
                </p>
              </div>

              <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '0.5rem', border: '1px solid #fde047' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#854d0e', marginBottom: '0.5rem' }}>
                  🌍 International Payments
                </h3>
                <p style={{ color: '#a16207', fontSize: '0.9rem' }}>
                  Some banks block international transactions - contact your bank if needed
                </p>
              </div>

              <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '0.5rem', border: '1px solid #fde047' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#854d0e', marginBottom: '0.5rem' }}>
                  🔄 Try a Different Card
                </h3>
                <p style={{ color: '#a16207', fontSize: '0.9rem' }}>
                  Use another payment method if available
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link 
              href="/payment"
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
              <RefreshCw size={20} />
              Try Again
            </Link>
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

          <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
              Still Having Issues?
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
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
                  gap: '0.5rem'
                }}
              >
                <MessageCircle size={18} />
                WhatsApp Support
              </a>
              <a 
                href="mailto:info@textcoco.com?subject=Payment Issue - Yaya Subscription" 
                style={{ 
                  background: 'transparent', 
                  color: '#a67c5a', 
                  padding: '10px 20px', 
                  borderRadius: '6px', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  border: '1px solid #a67c5a',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Mail size={18} />
                Email Us
              </a>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
            <p style={{ fontSize: '0.8rem', color: '#991b1b' }}>
              <strong>No charges were made.</strong> Your card was not charged for this failed transaction.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
