'use client'
import React, { useState, useEffect } from 'react'
import { useRegistration } from '../contexts/RegistrationContext'
import { MessageCircle } from 'lucide-react'

export default function Home() {
  const { navigateWithCode, buildUrlWithCode, registrationCode } = useRegistration()
  
  // 🔍 Debug logs
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
    
    // 🔧 שימוש בפרטים שלך מה-.env.local
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID // מה-.env.local
    const redirectUri = encodeURIComponent('https://yayagent.com/auth/callback') // הURL שלך
    const scope = encodeURIComponent('openid email profile https://www.googleapis.com/auth/calendar')
    const state = encodeURIComponent(registrationCode) // הקוד שלך
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent&state=${state}`
    
    console.log('🚀 Redirecting to Google OAuth:', authUrl)
    window.location.href = authUrl
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1rem', background: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5016' }}>
            Yaya
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href={buildUrlWithCode('/payment')} style={{ 
              background: '#2d5016', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              textDecoration: 'none' 
            }}>
              Get Started
            </a>
            <a href="https://app.textcoco.com" style={{ 
              color: '#666', 
              textDecoration: 'none',
              padding: '8px 16px'
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

      <main style={{ textAlign: 'center', marginTop: '100px', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Save your time, text your{' '}
          <span style={{ color: '#2d5016' }}>
            {isClient ? heroTexts[currentTextIndex] : heroTexts[0]}
          </span>
        </h1>
        
        <div style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
          Your executive assistant in WhatsApp <MessageCircle style={{ display: 'inline' }} />
        </div>
        
        <div style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          <a href="https://wa.me/972559943649" style={{ color: '#25d366', textDecoration: 'none' }}>
            +972 55-994-3649
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <a 
            href={buildUrlWithCode('/payment')} 
            style={{
              background: '#2d5016',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '500'
            }}
          >
            Start Free Trial
          </a>

          {/* כפתור Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            disabled={!registrationCode}
            style={{
              background: registrationCode ? '#4285F4' : '#ccc',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              cursor: registrationCode ? 'pointer' : 'not-allowed',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            🔗 Connect Google Calendar
          </button>

          {/* הצגת קוד רישום */}
          {registrationCode ? (
            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem',
              background: '#e8f5e8',
              borderRadius: '8px',
              border: '1px solid #2d5016'
            }}>
              <div style={{ color: '#2d5016', fontWeight: 'bold' }}>
                ✅ Registration Code Active: {registrationCode}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Your WhatsApp account will be linked when you complete signup
              </div>
            </div>
          ) : (
            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem',
              background: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7'
            }}>
              <div style={{ color: '#856404', fontWeight: 'bold' }}>
                ⚠️ No Registration Code
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Please start from the WhatsApp bot to get your registration link
              </div>
            </div>
          )}
        </div>
      </main>

      <footer style={{ marginTop: '100px', textAlign: 'center', padding: '2rem', borderTop: '1px solid #ddd' }}>
        <p style={{ color: '#666' }}>© 2025 Yaya Assistant</p>
      </footer>
    </div>
  )
}
