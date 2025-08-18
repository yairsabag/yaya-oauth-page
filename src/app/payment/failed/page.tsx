'use client'

import React from 'react'
import { XCircle, RefreshCw, MessageCircle, Mail } from 'lucide-react'

export const metadata = {
  robots: { index: false, follow: false },
}

export default function FailedPage() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', textDecoration: 'none' }}>
            <img src="/yaya-logo.png" alt="Yaya" style={{ width: 72, height: 72, objectFit: 'contain' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2d5016' }}>Yaya</span>
          </a>
        </div>
      </header>

      <main style={{ padding: '3.5rem 0' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <XCircle size={84} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '2.25rem', fontWeight: 500, color: '#8B5E3C', marginBottom: '.75rem' }}>
            Payment Failed
          </h1>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>
            We couldn’t process your payment. No charge was made. You can try again or contact us.
          </p>

          <div style={{ background: '#F5F1EB', border: '1px solid #E5DDD5', borderRadius: 16, padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#8B5E3C', lineHeight: 1.55 }}>
              <li>Check card number, expiry and CVV</li>
              <li>Ensure sufficient balance and that the card isn’t blocked</li>
              <li>International payments may be blocked by some banks</li>
              <li>Try a different card</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <a
              href="/payment"
              style={{ background: '#8B5E3C', color: 'white', padding: '12px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <RefreshCw size={18} /> Try Again
            </a>
            <a
              href="/"
              style={{ border: '1px solid #8B5E3C', color: '#8B5E3C', padding: '12px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              Back to Home
            </a>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/972559943649?text=Hi! I'm having trouble with payment for Yaya subscription"
              style={{ background: '#25d366', color: 'white', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <MessageCircle size={18} /> WhatsApp Support
            </a>
            <a
              href="mailto:info@textcoco.com?subject=Payment Issue - Yaya Subscription"
              style={{ border: '1px solid #8B5E3C', color: '#8B5E3C', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Mail size={18} /> Email Us
            </a>
          </div>

          <p style={{ marginTop: '1.25rem', color: '#ef4444', fontSize: '.9rem' }}>
            <strong>No charges were made.</strong> Your card was not charged for this failed transaction.
          </p>
        </div>
      </main>
    </div>
  )
}
