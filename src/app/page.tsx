'use client'
import React, { useState, useEffect } from 'react'
import { useRegistration } from '../contexts/RegistrationContext'
import { MessageCircle } from 'lucide-react'

export default function Home() {
  const { navigateWithCode, buildUrlWithCode, registrationCode } = useRegistration()
  
  // Debug logs (אפשר להסיר אחר כך)
  console.log('🏠 HomePage: registrationCode =', registrationCode)
  console.log('🏠 HomePage: window.location.search =', window?.location?.search)
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const heroTexts = ['calendar.', 'todo list.', 'reminders.']

  useEffect(() => {
    console.log('🏠 HomePage useEffect: registrationCode changed to:', registrationCode)
  }, [registrationCode])

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleGoogleLogin = () => {
  if (!registrationCode) {
    alert('No registration code found! Please start from WhatsApp bot.')
    return
  }
  
  // השתמש בClient ID הישיר שלך
  const clientId = '314964896562-o93h71h2cpiqgcikageq2a34ht2ipl2j.apps.googleusercontent.com'
  const redirectUri = encodeURIComponent('https://yayagent.com/auth/callback')
  const scope = encodeURIComponent('openid email profile https://www.googleapis.com/auth/calendar')
  const state = encodeURIComponent(registrationCode)
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent&state=${state}`
  
  console.log('🚀 Redirecting to Google OAuth:', authUrl)
  window.location.href = authUrl
}

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ 
        padding: '1rem 2rem', 
        background: 'rgba(255,255,255,0.95)', 
        borderBottom: '1px solid #ddd',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
      }}>
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem'
          }}>
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5016' }}>
              Yaya
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href={buildUrlWithCode('/payment')} style={{ 
              background: '#2d5016', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Get Started
            </a>
            <a href="https://app.textcoco.com" style={{ 
              color: '#666', 
              textDecoration: 'none',
              padding: '8px 16px',
              fontSize: '0.9rem'
            }}>
              Login
            </a>
            
            {/* הצגת קוד הרישום */}
            {registrationCode && (
              <div style={{ 
                background: 'rgba(45, 80, 22, 0.1)', 
                color: '#2d5016', 
                padding: '4px 12px', 
                borderRadius: '12px', 
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                קוד: {registrationCode}
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ 
        textAlign: 'center', 
        marginTop: '120px', 
        padding: '2rem',
        background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
        minHeight: 'calc(100vh - 120px)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            marginBottom: '1rem',
            fontWeight: '300',
            color: '#1a202c',
            lineHeight: '1.2'
          }}>
            Save your time, text your{' '}
            <span style={{ 
              color: '#2d5016',
              background: '#e6f4ea',
              padding: '4px 8px',
              borderRadius: '8px'
            }}>
              {isClient ? heroTexts[currentTextIndex] : heroTexts[0]}
            </span>
          </h1>
          
          <div style={{ 
            fontSize: '1.2rem', 
            marginBottom: '2rem', 
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            Your executive assistant in WhatsApp 
            <MessageCircle size={20} style={{ color: '#25d366' }} />
          </div>
          
          <div style={{ 
            fontSize: '1.5rem', 
            marginBottom: '3rem',
            color: '#25d366',
            fontWeight: '500'
          }}>
            <a href="https://wa.me/972559943649" style={{ 
              color: 'inherit', 
              textDecoration: 'none' 
            }}>
              +972 55-994-3649
            </a>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <a 
              href={buildUrlWithCode('/payment')} 
              style={{
                background: '#2d5016',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '500',
                display: 'inline-block',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(45, 80, 22, 0.3)'
              }}
            >
              Start Free Trial
            </a>

            {/* Google Calendar Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={!registrationCode}
              style={{
                background: registrationCode ? '#4285F4' : '#ccc',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: registrationCode ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              🔗 Connect Google Calendar
            </button>
          </div>

          {/* Registration Code Status */}
          {registrationCode ? (
            <div style={{ 
              padding: '1.5rem',
              background: '#e8f5e8',
              borderRadius: '12px',
              border: '2px solid #2d5016',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ 
                color: '#2d5016', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                marginBottom: '0.5rem'
              }}>
                ✅ Registration Code Active: {registrationCode}
              </div>
              <div style={{ 
                color: '#666', 
                fontSize: '1rem',
                lineHeight: '1.5'
              }}>
                Your WhatsApp account will be linked when you complete signup.
                You can now access premium features!
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: '1.5rem',
              background: '#fff3cd',
              borderRadius: '12px',
              border: '2px solid #ffeaa7',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ 
                color: '#856404', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                marginBottom: '0.5rem'
              }}>
                ⚠️ No Registration Code
              </div>
              <div style={{ 
                color: '#666', 
                fontSize: '1rem',
                lineHeight: '1.5'
              }}>
                Please start from the WhatsApp bot to get your registration link.
                <br />
                <a href="https://wa.me/972559943649" style={{ color: '#25d366' }}>
                  Chat with Yaya Bot →
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer style={{ 
        background: '#1a202c', 
        color: '#a0aec0', 
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: '500', color: 'white' }}>
            Yaya
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem', 
          flexWrap: 'wrap',
          fontSize: '0.9rem'
        }}>
          <a href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>
            Privacy Policy
          </a>
          <a href="/terms-of-service" style={{ color: 'inherit', textDecoration: 'none' }}>
            Terms of Service
          </a>
          <a href="mailto:info@textcoco.com" style={{ color: 'inherit', textDecoration: 'none' }}>
            Contact
          </a>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
          © 2025 Yaya Assistant
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        title="Chat with Yaya on WhatsApp"
        href="https://wa.me/972559943649"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#25d366',
          color: 'white',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
          zIndex: 1000,
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}
      >
        <MessageCircle size={24} />
      </a>
    </div>
  )
}
