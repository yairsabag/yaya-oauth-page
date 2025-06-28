'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, MessageCircle, Copy, ExternalLink, Calendar, Clock, Users } from 'lucide-react'

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
          maxWidth: '900px', 
          margin: '0 auto', 
          padding: '0 2rem', 
          textAlign: 'center' 
        }}>
          {/* Success Icon & Title */}
          <div style={{ 
            background: 'rgba(37, 211, 102, 0.1)', 
            borderRadius: '50%', 
            width: '120px', 
            height: '120px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 2rem',
            border: '3px solid rgba(37, 211, 102, 0.3)',
            animation: 'bounce 0.6s ease-in-out'
          }}>
            <CheckCircle size={80} style={{ color: '#25d366' }} />
          </div>

          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '400', 
            color: '#2d5016', 
            marginBottom: '1rem', 
            letterSpacing: '-0.02em' 
          }}>
            🎉 Google Connected!
          </h1>

          <p style={{ 
            fontSize: '1.4rem', 
            color: '#718096', 
            marginBottom: '4rem', 
            maxWidth: '700px', 
            margin: '0 auto 4rem',
            lineHeight: '1.6'
          }}>
            Your Google Calendar is now connected! Share your activation code with our WhatsApp bot to unlock all premium features.
          </p>

          {/* Features Preview */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem', 
            marginBottom: '4rem' 
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: '16px', 
              padding: '2rem', 
              border: '1px solid #E5DDD5',
              textAlign: 'center'
            }}>
              <Calendar size={48} style={{ color: '#25d366', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d5016', marginBottom: '0.5rem' }}>
                Smart Scheduling
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#718096', lineHeight: '1.5' }}>
                "Schedule a meeting with John tomorrow at 2pm"
              </p>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: '16px', 
              padding: '2rem', 
              border: '1px solid #E5DDD5',
              textAlign: 'center'
            }}>
              <Clock size={48} style={{ color: '#4285f4', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d5016', marginBottom: '0.5rem' }}>
                Smart Reminders
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#718096', lineHeight: '1.5' }}>
                "Remind me about the dentist appointment in 2 hours"
              </p>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              borderRadius: '16px', 
              padding: '2rem', 
              border: '1px solid #E5DDD5',
              textAlign: 'center'
            }}>
              <Users size={48} style={{ color: '#8B5E3C', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d5016', marginBottom: '0.5rem' }}>
                Team Coordination
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#718096', lineHeight: '1.5' }}>
                "Set up a weekly team standup every Monday"
              </p>
            </div>
          </div>

          {/* Code Section - Main Focus */}
          <div style={{ 
            background: '#F5F1EB', 
            borderRadius: '24px', 
            padding: '3.5rem 2.5rem', 
            border: '3px solid #25d366', 
            marginBottom: '3rem', 
            boxShadow: '0 20px 40px rgba(37, 211, 102, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(37, 211, 102, 0.05) 1px, transparent 0)',
              backgroundSize: '20px 20px',
              zIndex: 0
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '600', 
                color: '#25d366', 
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}>
                <MessageCircle size={40} />
                Send Your Activation Code
              </h2>
              
              {/* Big Code Display */}
              <div style={{ 
                background: 'linear-gradient(145deg, #ffffff, #f8f9fa)', 
                border: '4px solid #25d366', 
                borderRadius: '20px', 
                padding: '3rem 2rem', 
                marginBottom: '2.5rem',
                boxShadow: '0 10px 30px rgba(37, 211, 102, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}>
                <div style={{ 
                  fontSize: '5rem', 
                  fontWeight: '800', 
                  color: '#25d366', 
                  marginBottom: '1.5rem', 
                  letterSpacing: '0.1em',
                  fontFamily: 'monospace',
                  textShadow: '0 2px 4px rgba(37, 211, 102, 0.3)'
                }}>
                  {registrationCode || 'LOADING...'}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  justifyContent: 'center', 
                  flexWrap: 'wrap' 
                }}>
                  <button
                    onClick={copyCode}
                    style={{
                      background: codeCopied ? '#22c55e' : '#25d366',
                      color: 'white',
                      border: 'none',
                      padding: '18px 36px',
                      borderRadius: '14px',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
                      transform: codeCopied ? 'scale(0.95)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!codeCopied) {
                        (e.target as HTMLElement).style.background = '#22c55e'
                        ;(e.target as HTMLElement).style.transform = 'scale(1.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!codeCopied) {
                        (e.target as HTMLElement).style.background = '#25d366'
                        ;(e.target as HTMLElement).style.transform = 'scale(1)'
                      }
                    }}
                  >
                    <Copy size={22} />
                    {codeCopied ? '✅ Copied!' : 'Copy Code'}
                  </button>
                  
                  <button
                    onClick={openWhatsAppWithCode}
                    style={{
                      background: '#2d5016',
                      color: 'white',
                      border: 'none',
                      padding: '18px 36px',
                      borderRadius: '14px',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 6px 20px rgba(45, 80, 22, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = '#1f3910'
                      ;(e.target as HTMLElement).style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = '#2d5016'
                      ;(e.target as HTMLElement).style.transform = 'scale(1)'
                    }}
                  >
                    <ExternalLink size={22} />
                    Send via WhatsApp
                  </button>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(37, 211, 102, 0.1)', 
                borderRadius: '16px', 
                padding: '2rem', 
                border: '2px solid rgba(37, 211, 102, 0.3)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <MessageCircle size={28} style={{ color: '#25d366' }} />
                  <span style={{ 
                    color: '#25d366', 
                    fontSize: '1.4rem', 
                    fontWeight: '700'
                  }}>
                    +972 55-994-3649
                  </span>
                </div>
                <p style={{ 
                  color: '#2d5016', 
                  fontSize: '1.1rem',
                  margin: '0',
                  fontWeight: '500'
                }}>
                  Just send: "<strong>My code: {registrationCode}</strong>" and you're all set! 🚀
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <a 
              href="https://wa.me/972559943649" 
              style={{ 
                background: 'linear-gradient(145deg, #25d366, #22c55e)', 
                color: 'white', 
                padding: '16px 32px', 
                borderRadius: '12px', 
                textDecoration: 'none', 
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                fontSize: '1.1rem',
                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.3)'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.3)'
              }}
            >
              <MessageCircle size={22} />
              Open WhatsApp
            </a>
            <a 
              href="/" 
              style={{ 
                background: 'transparent', 
                color: '#2d5016', 
                padding: '16px 32px', 
                borderRadius: '12px', 
                textDecoration: 'none', 
                fontWeight: '600',
                border: '2px solid #2d5016',
                transition: 'all 0.3s ease',
                fontSize: '1.1rem'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = '#2d5016'
                ;(e.target as HTMLElement).style.color = 'white'
                ;(e.target as HTMLElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'transparent'
                ;(e.target as HTMLElement).style.color = '#2d5016'
                ;(e.target as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              Back to Home
            </a>
          </div>

          <p style={{ 
            fontSize: '1rem', 
            color: '#718096', 
            textAlign: 'center'
          }}>
            Need help? Contact us: <a href="mailto:info@textcoco.com" style={{ color: '#2d5016', fontWeight: '600' }}>info@textcoco.com</a>
          </p>
        </div>
      </main>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  )
}
