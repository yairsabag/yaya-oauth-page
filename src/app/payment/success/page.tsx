'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, MessageCircle, Calendar, Bell, Copy } from 'lucide-react'

export default function SuccessPage() {
  const [urlParams, setUrlParams] = useState({
    plan: '',
    email: '',
    price: '',
    code: '',
    phone: ''
  })
  const [codeCopied, setCodeCopied] = useState(false)

  useEffect(() => {
    // Get URL parameters from window.location
    const params = new URLSearchParams(window.location.search)
    setUrlParams({
      plan: params.get('plan') || '',
      email: params.get('email') || '',
      price: params.get('price') || '',
      code: params.get('code') || '',
      phone: params.get('phone') || ''
    })

    // Send WhatsApp message with code automatically
    const code = params.get('code')
    const phone = params.get('phone')
    if (code && phone) {
      sendWhatsAppCode(phone, code)
    }
  }, [])

  const sendWhatsAppCode = async (phone: string, code: string) => {
    try {
      // Send WhatsApp message via your WhatsApp API
      const response = await fetch('https://yairsabag.app.n8n.cloud/webhook/send-whatsapp-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          code: code,
          message: `Welcome to Yaya! 🎉

Your verification code: ${code}

Click below to connect your Google account:
${googleOAuthUrl}

Or copy the code and connect manually.
Expires in 20 minutes.`
        })
      })
    } catch (error) {
      console.log('WhatsApp send failed, but that\'s okay')
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(urlParams.code)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const planNames = {
    executive: 'Executive Plan',
    ultimate: 'Ultimate Plan'
  }

  // Fixed Google OAuth URL with correct redirect to n8n
  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=314964896562-o93h71h2cpiqgcikaqeg2a34ht2ipl2j.apps.googleusercontent.com&redirect_uri=https://yairsabag.app.n8n.cloud/webhook/google-oauth-callback&response_type=code&scope=openid%20email%20https://www.googleapis.com/auth/calendar&state=${urlParams.code}`

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
            🎉 Registration Complete!
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#718096', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            We've sent a verification code to your WhatsApp. Follow the steps below to activate your account:
          </p>

          {/* WhatsApp Code Section */}
          <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: '2rem', border: '2px solid #25d366', marginBottom: '3rem', boxShadow: '0 10px 30px rgba(37, 211, 102, 0.2)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#25d366', marginBottom: '1rem' }}>
              📱 Check Your WhatsApp
            </h2>
            <p style={{ color: '#8B5E3C', fontSize: '1rem', marginBottom: '1.5rem' }}>
              We sent a message to <strong>{urlParams.phone}</strong> with your verification code:
            </p>
            
            <div style={{ 
              background: '#fff', 
              border: '2px dashed #25d366', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              marginBottom: '1.5rem',
              display: 'inline-block'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '600', color: '#25d366', marginBottom: '0.5rem' }}>
                {urlParams.code}
              </div>
              <button
                onClick={copyCode}
                style={{
                  background: '#25d366',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto'
                }}
              >
                <Copy size={16} />
                {codeCopied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
              Code expires in 20 minutes
            </p>
          </div>

          {/* Next Steps */}
          <div style={{ background: '#F5F1EB', borderRadius: '20px', padding: '2rem', border: '1px solid #E5DDD5', marginBottom: '3rem', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1.5rem', textAlign: 'center' }}>
              🚀 Next Steps
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#25d366', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 'bold' }}>
                  1
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    Open WhatsApp & Find Our Message
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                    Look for a message from +972 55-994-3649 with your verification code
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#4285f4', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 'bold' }}>
                  2
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    Connect Your Google Account
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8', marginBottom: '1rem' }}>
                    Click the link in WhatsApp or use the button below
                  </p>
                  <a 
                    href={googleOAuthUrl}
                    style={{ 
                      background: '#4285f4', 
                      color: 'white', 
                      padding: '12px 24px', 
                      borderRadius: '8px', 
                      textDecoration: 'none', 
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🔗 Connect Google Account
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#8B5E3C', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 'bold' }}>
                  3
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '0.5rem' }}>
                    Start Using Yaya!
                  </h3>
                  <p style={{ color: '#8B5E3C', fontSize: '0.9rem', opacity: 0.8 }}>
                    Try: "Schedule a meeting with John tomorrow at 2pm"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5DDD5', marginBottom: '2rem', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#8B5E3C', marginBottom: '1rem' }}>
              📧 Order Details
            </h3>
            <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {urlParams.email}
              </p>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Phone:</strong> {urlParams.phone}
              </p>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Plan:</strong> {planNames[urlParams.plan as keyof typeof planNames]} - ${urlParams.price}/month
              </p>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Verification Code:</strong> {urlParams.code}
              </p>
              <p style={{ color: '#8B5E3C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Trial Period:</strong> 7 days (ends {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="https://wa.me/972559943649" 
              style={{ 
                background: '#25d366', 
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
            >
              <MessageCircle size={20} />
              Open WhatsApp
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
