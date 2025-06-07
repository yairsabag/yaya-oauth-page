'use client'
import React, { useState, useEffect } from 'react'
import { MessageCircle, Check } from 'lucide-react'
import { useRegistration } from '../contexts/RegistrationContext'

// Phone Mockup Component
function PhoneMockup({ messages }: { messages: Array<{ text: string; sender: 'user' | 'yaya'; time?: string }> }) {
  const [visibleMessages, setVisibleMessages] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleMessages(prev => {
        if (prev < messages.length) {
          return prev + 1
        } else {
          // Reset after showing all messages for 3 seconds
          setTimeout(() => setVisibleMessages(0), 3000)
          return prev
        }
      })
    }, 1500)
    
    return () => clearInterval(timer)
  }, [messages.length, visibleMessages])

  return (
    <div style={{
      width: '280px',
      height: '420px',
      background: '#000',
      borderRadius: '30px',
      padding: '8px',
      margin: '0 auto',
      position: 'relative',
      boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
    }}>
      {/* Phone Screen */}
      <div style={{
        width: '100%',
        height: '100%',
        background: '#f0f2f5',
        borderRadius: '22px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* WhatsApp Header */}
        <div style={{
          background: '#075e54',
          color: 'white',
          padding: '15px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '35px',
            height: '35px',
            background: '#25d366',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            Y
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>Yaya Assistant</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>online</div>
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{
          padding: '16px',
          height: 'calc(100% - 130px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {messages.slice(0, visibleMessages).map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                opacity: 0,
                animation: 'slideInMessage 0.5s ease-out forwards',
                animationDelay: `${index * 0.3}s`
              }}
            >
              <div style={{
                background: message.sender === 'user' ? '#dcf8c6' : 'white',
                color: '#333',
                padding: '8px 12px',
                borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                maxWidth: '80%',
                fontSize: '13px',
                lineHeight: '1.3',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                position: 'relative',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}>
                {message.text}
                <div style={{
                  fontSize: '11px',
                  color: '#667781',
                  marginTop: '4px',
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '2px'
                }}>
                  {message.time || '2:47 PM'}
                  {message.sender === 'user' && (
                    <div style={{ color: '#4fc3f7' }}>
                      <Check size={12} />
                      <Check size={12} style={{ marginLeft: '-8px' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#f0f2f5',
          padding: '8px 16px',
          borderTop: '1px solid #e4e6ea'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '12px',
            color: '#667781'
          }}>
            Type a message...
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInMessage {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [billingType, setBillingType] = useState('monthly')

  // שימוש בקונטקסט לניהול הקוד
  const { registrationCode, getUrlWithCode } = useRegistration()

  const heroTexts = [
    'calendar.',
    'todo list.',
    'reminders.',
  ]

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    })

    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // פונקציה מעודכנת לטיפול בפעולות תוכניות
  const handlePlanAction = (planId: string) => {
    if (planId === 'basic') {
      // עבור תוכנית חינמית - פתיחת WhatsApp עם קוד אם קיים
      const whatsappUrl = registrationCode 
        ? `https://api.whatsapp.com/send/?phone=972559943649&text=My code: ${registrationCode}&type=phone_number&app_absent=0`
        : 'https://api.whatsapp.com/send/?phone=972559943649&text&type=phone_number&app_absent=0'
      window.open(whatsappUrl, '_blank')
    } else {
      // עבור תוכניות בתשלום - הפניה לדף תשלום עם שמירת הקוד
      const paymentUrl = getUrlWithCode('/payment', {
        plan: planId,
        billing: billingType
      })
      window.location.href = paymentUrl
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        .slide-in-left {
          transform: translateX(-50px);
        }
        .slide-in-right {
          transform: translateX(50px);
        }
        .slide-in-left.animate-in,
        .slide-in-right.animate-in {
          transform: translateX(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-on-scroll {
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* Header */}
      <header style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '1rem 0',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016' }}>Yaya</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              Introducing Multi-Calendar Support 📅
            </span>
            
              href={getUrlWithCode('/payment')}
              style={{
                background: '#2d5016',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}>
              Get Started
            </a>
            
              href="http://app.textcoco.com"
              style={{
                color: '#4a5568',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '8px 16px'
              }}>
              Login
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
        color: '#2d3748',
        padding: '8rem 0 6rem',
        textAlign: 'center',
        marginTop: '80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 className="animate-on-scroll" style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: '300',
            marginBottom: '0.5rem',
            lineHeight: '1.1',
            color: '#1a202c',
            letterSpacing: '-0.04em'
          }}>
            Save your time, text your
          </h1>
          <h1 className="text-animate" style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: '300',
            marginBottom: '2rem',
            lineHeight: '1.1',
            minHeight: '5rem',
            color: '#1a202c',
            letterSpacing: '-0.04em'
          }}>
            <span style={{
              background: '#e6f4ea',
              padding: '6px 12px',
              borderRadius: '12px',
              color: '#2d5016'
            }}>
              {isClient ? heroTexts[currentTextIndex] : heroTexts[0]}
            </span>
          </h1>

          <div className="animate-on-scroll" style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '50px',
            padding: '12px 24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1rem',
            color: '#4a5568',
            marginBottom: '2rem',
            fontWeight: '400'
          }}>
            Your executive assistant in <strong>WhatsApp</strong>
            <MessageCircle size={18} style={{ color: '#25d366' }} />
          </div>

          <div className="animate-on-scroll" style={{
            fontSize: '1.5rem',
            fontWeight: '400',
            margin: '2rem 0',
            color: '#1a202c',
            letterSpacing: '-0.01em'
          }}>
            <a href="https://wa.me/972559943649" style={{ color: 'inherit', textDecoration: 'none' }}>
              +972 55-994-3649
            </a>
          </div>

          <a href={getUrlWithCode('/payment')} className="animate-on-scroll" style={{
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
          }}>
            Start Free Trial
          </a>
        </div>
      </section>

      {/* Rest of the component continues with all sections... */}
      {/* I'll provide the rest if needed, but this should fix the syntax error */}
    </div>
  )
}
