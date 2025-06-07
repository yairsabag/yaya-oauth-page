'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, MessageCircle, Copy, ExternalLink } from 'lucide-react'

export default function OAuthSuccessPage() {
  const [registrationCode, setRegistrationCode] = useState('')
  const [codeCopied, setCodeCopied] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // Get registration code from URL
    const params = new URLSearchParams(window.location.search)
    const code = params.get('state') || ''
    setRegistrationCode(code)
    
    // Optional: Get email from URL if available
    const email = params.get('email') || ''
    setUserEmail(email)
  }, [])

  const copyCode = () => {
    navigator.clipboard.writeText(registrationCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const openWhatsAppWithCode = () => {
    const message = `My code: ${registrationCode}`
    const whatsappUrl = `https://wa.me/972559943649?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div style={{ 
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)'
    }}>
      {/* Header */}
      <header style={{ 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid rgba(0,0,0,0.05)', 
        padding: '1rem 0' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <a href="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            textDecoration: 'none' 
          }}>
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
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '0 2rem', 
          textAlign: 'center' 
        }}>
          {/* Success Animation */}
          <div style={{ marginBottom: '2rem' }}>
            <CheckCircle size={80} style={{ color: '#25d366', margin: '0 auto' }} />
          </div>

          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '400', 
            color: '#8B5E3C', 
            marginBottom: '1rem', 
            letterSpacing: '-0.02em' 
          }}>
            🎉 Google Account Connected!
          </h1>

          <p style={{ 
            fontSize: '1.3rem', 
            color: '#718096', 
            marginBottom: '3rem', 
            maxWidth: '600px', 
            margin: '0 auto 3rem',
            lineHeight: '1.6'
          }}>
            Your Google account is now connected successfully! Send this code to our WhatsApp bot to activate all premium features.
          </p>

          {/* Code Section - Main Focus */}
          <div style={{ 
            background: '#F5F1EB', 
            borderRadius: '20px', 
            padding: '3rem 2rem', 
            border: '3px solid #25d366', 
            marginBottom: '3rem', 
            boxShadow: '0 15px 35px rgba(37, 211, 102, 0.25)' 
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '600', 
              color: '#25d366', 
              marginBottom: '1.5rem' 
            }}>
              📱 Send this code to WhatsApp
            </h2>
            
            {/* Big Code Display */}
            <div style={{ 
              background: '#fff', 
              border: '4px solid #25d366', 
              borderRadius: '16px', 
              padding: '2.5rem', 
              marginBottom: '2rem',
              boxShadow: '0 8px 25px rgba(37, 211, 102, 0.15)'
            }}>
              <div style={{ 
                fontSize: '4rem', 
                fontWeight: '700', 
                color: '#25d366', 
                marginBottom: '1.5rem', 
                letterSpacing: '0.15em',
                fontFamily: 'monospace'
              }}>
                {registrationCode || 'LOADING...'}
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center', 
                flexWrap: 'wrap' 
              }}>
                <button
                  onClick={copyCode}
                  style={{
                    background: '#25d366',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#22c55e'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#25d366'}
                >
                  <Copy size={20} />
                  {codeCopied ? '✅ Copied!' : 'Copy Code'}
                </button>
                
                <button
                  onClick={openWhatsAppWithCode}
                  style={{
                    background: '#8B5E3C',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 15px rgba(139, 94, 60, 0.3)'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#7c4a32'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#8B5E3C'}
                >
                  <ExternalLink size={20} />
                  Send via WhatsApp
                </button>
              </div>
            </div>

            <div style={{ 
              background: 'rgba(37, 211, 102, 0.1)', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              border: '2px solid rgba(37, 211, 102, 0.3)',
              marginBottom: '1rem'
            }}>
              <p style={{ 
                color: '#25d366', 
                fontSize: '1.2rem', 
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                📞 Bot Number: +972 55-994-3649
              </p>
              <p style={{ 
                color: '#8B5E3C', 
                fontSize: '1rem',
                margin: '0'
              }}>
                Just send the code (or write "My code: {registrationCode}") and your account will be activated!
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ 
            background: 'rgba(255,255,255,0.8)', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            border: '1px solid #E5DDD5', 
            marginBottom: '3rem'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#8B5E3C', 
              marginBottom: '1.5rem' 
            }}>
              📋 What's Next?
            </h3>
            <div style={{ 
              maxWidth: '500px', 
              margin: '0 auto'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  background: '#25d366', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  1
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ 
                    color: '#8B5E3C', 
                    fontSize: '1.1rem', 
                    margin: '0',
                    fontWeight: '600'
                  }}>
                    Copy the code above
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  background: '#4285f4', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  2
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ 
                    color: '#8B5E3C', 
                    fontSize: '1.1rem', 
                    margin: '0',
                    fontWeight: '600'
                  }}>
                    Send it to our WhatsApp bot
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem'
              }}>
                <div style={{ 
                  background: '#8B5E3C', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  3
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ 
                    color: '#8B5E3C', 
                    fontSize: '1.1rem', 
                    margin: '0',
                    fontWeight: '600'
                  }}>
                    Start using Yaya!
                  </p>
                  <p style={{ 
                    color: '#8B5E3C', 
                    fontSize: '0.9rem', 
                    margin: '0.25rem 0 0 0',
                    opacity: 0.8
                  }}>
                    Try: "Schedule a meeting with John tomorrow at 2pm"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            <a 
              href="https://wa.me/972559943649" 
              style={{ 
                background: '#25d366', 
                color: 'white', 
                padding: '14px 28px', 
                borderRadius: '10px', 
                textDecoration: 'none', 
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#22c55e'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#25d366'}
            >
              <MessageCircle size={20} />
              Open WhatsApp
            </a>
            <a 
              href="/" 
              style={{ 
                background: 'transparent', 
                color: '#8B5E3C', 
                padding: '14px 28px', 
                borderRadius: '10px', 
                textDecoration: 'none', 
                fontWeight: '600',
                border: '2px solid #8B5E3C',
                transition: 'all 0.2s ease',
                fontSize: '1rem'
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

          <p style={{ 
            fontSize: '0.9rem', 
            color: '#718096', 
            textAlign: 'center'
          }}>
            Need help? Contact us: <a href="mailto:info@textcoco.com" style={{ color: '#8B5E3C' }}>info@textcoco.com</a>
          </p>
        </div>
      </main>
    </div>
  )
}
