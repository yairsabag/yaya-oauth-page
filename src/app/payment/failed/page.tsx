import React from 'react'
import { XCircle, RefreshCw, MessageCircle, Mail } from 'lucide-react'

// מותר ב-server component
export const metadata = {
  title: 'Payment Failed – Yaya',
  robots: { index: false, follow: false },
}

export default function FailedPage() {
  return (
    <div style={{
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '0 2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img src="/yaya-logo.png" alt="Yaya Assistant Logo"
                 style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2d5016' }}>Yaya</span>
          </a>
        </div>
      </header>

      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <XCircle size={80} style={{ color: '#ef4444', margin: '0 auto' }} />
          </div>

          <h1 style={{
            fontSize: '2.5rem', fontWeight: 400, color: '#8B5E3C',
            marginBottom: '1rem', letterSpacing: '-0.02em'
          }}>
            Payment Failed
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#718096', marginBottom: '2rem', lineHeight: 1.6 }}>
            We couldn't process your payment. No charge was made to your account.
          </p>

          <div style={{
            background: '#F5F1EB', borderRadius: 20, padding: '2rem',
            border: '1px solid #E5DDD5', marginBottom: '3rem', textAlign: 'left'
          }}>
            <h2 style={{
              fontSize: '1.3rem', fontWeight: 600, color: '#8B5E3C',
              marginBottom: '1.5rem', textAlign: 'center'
            }}>
              🔧 Common Solutions
            </h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                ['💳 Check Your Card Details', 'Make sure your card number, expiry date, and CVV are correct.'],
                ['💰 Verify Available Balance', 'Ensure your card has sufficient funds and isn\'t blocked.'],
                ['🌍 International Payments', 'Some banks block international transactions—contact your bank if needed.'],
                ['🔄 Try a Different Card', 'Use another payment method if available.'],
              ].map(([title, text]) => (
                <div key={title} style={{
                  padding: '1rem',
                  background: 'rgba(139, 94, 60, 0.1)',
                  borderRadius: 12,
                  border: '1px solid rgba(139, 94, 60, 0.2)'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#8B5E3C', marginBottom: '.5rem' }}>
                    {title}
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '.9rem', opacity: .85 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex', gap: '1rem', justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: '3rem'
          }}>
            <a href="/payment"
               style={{
                 background: '#8B5E3C', color: 'white', padding: '12px 24px',
                 borderRadius: 8, textDecoration: 'none', fontWeight: 600,
                 display: 'inline-flex', alignItems: 'center', gap: '.5rem'
               }}>
              <RefreshCw size={20} />
              Try Again
            </a>
            <a href="/"
               style={{
                 background: 'transparent', color: '#8B5E3C', padding: '12px 24px',
                 borderRadius: 8, textDecoration: 'none', fontWeight: 600,
                 border: '1px solid #8B5E3C'
               }}>
              Back to Home
            </a>
          </div>

          <div style={{
            background: '#F5F1EB', borderRadius: 20, padding: '1.5rem',
            border: '1px solid #E5DDD5'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#8B5E3C', marginBottom: '1rem' }}>
              Still Having Issues?
            </h3>
            <p style={{ color: '#8B5E3C', fontSize: '.9rem', marginBottom: '1rem', opacity: .85 }}>
              Our team is here to help. Contact us and we’ll resolve this quickly.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/972559943649?text=Hi! I'm having trouble with payment for Yaya subscription"
                style={{
                  background: '#25d366', color: 'white', padding: '10px 20px',
                  borderRadius: 6, textDecoration: 'none', fontSize: '.9rem', fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: '.5rem'
                }}>
                <MessageCircle size={18} />
                WhatsApp Support
              </a>
              <a
                href="mailto:info@textcoco.com?subject=Payment Issue - Yaya Subscription"
                style={{
                  background: 'transparent', color: '#8B5E3C', padding: '10px 20px',
                  borderRadius: 6, textDecoration: 'none', fontSize: '.9rem', fontWeight: 600,
                  border: '1px solid #8B5E3C', display: 'inline-flex', alignItems: 'center', gap: '.5rem'
                }}>
                <Mail size={18} />
                Email Us
              </a>
            </div>
          </div>

          <div style={{
            marginTop: '2rem', padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 12, border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <p style={{ fontSize: '.8rem', color: '#ef4444', margin: 0 }}>
              <strong>No charges were made.</strong> Your card was not charged for this failed transaction.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
