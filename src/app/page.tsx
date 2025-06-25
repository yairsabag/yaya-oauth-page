'use client'
import React, { useState, useEffect } from 'react'
import { MessageCircle, Check, Menu, X } from 'lucide-react'

// Phone Mockup Component - מותאם מובייל
function PhoneMockup({ messages }: { messages: Array<{ text: string; sender: 'user' | 'yaya'; time?: string }> }) {
  const [visibleMessages, setVisibleMessages] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleMessages(prev => {
        if (prev < messages.length) {
          return prev + 1
        } else {
          setTimeout(() => setVisibleMessages(0), 3000)
          return prev
        }
      })
    }, 1500)
    
    return () => clearInterval(timer)
  }, [messages.length, visibleMessages])

  return (
    <div style={{
      width: '100%',
      maxWidth: '280px',
      height: '420px',
      background: '#000',
      borderRadius: '30px',
      padding: '8px',
      margin: '2rem auto',
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [registrationCode, setRegistrationCode] = useState('')

  // פונקציה לבניית URL עם קוד רישום
  const getUrlWithCode = (path: string, params?: Record<string, string>) => {
    const url = new URL(path, window.location.origin)
    if (registrationCode) {
      url.searchParams.set('code', registrationCode)
    }
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }
    return url.toString()
  }

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
      rootMargin: '0px 0px -50px 0px'
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
      // עבור תוכניות בתשלום - הפניה לדף תשלום
      const paymentUrl = `/payment?plan=${planId}&billing=${billingType}${registrationCode ? `&code=${registrationCode}` : ''}`
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

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 100;
            display: flex;
            align-items: flex-start;
            justify-content: flex-end;
            padding-top: 80px;
          }
          
          .mobile-menu-content {
            background: white;
            width: 100%;
            max-width: 300px;
            height: fit-content;
            padding: 2rem;
            border-radius: 20px 0 0 20px;
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
          }
        }

        /* Touch-friendly buttons */
        .touch-button {
          min-height: 48px;
          min-width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .touch-button:active {
          transform: scale(0.95);
        }
      `}</style>

      {/* Header - מותאם מובייל */}
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
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ 
                width: 'clamp(48px, 8vw, 80px)', 
                height: 'clamp(48px, 8vw, 80px)', 
                objectFit: 'contain' 
              }}
            />
            <span style={{ 
              fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', 
              fontWeight: '600', 
              color: '#2d5016' 
            }}>
              Yaya
            </span>
          </div>

          {/* Desktop Navigation */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            alignItems: 'center',
            '@media (max-width: 768px)': { display: 'none' }
          }} className="hidden md:flex">
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
            <a
              href="/payment"
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
            <a
              href="http://yayagent.com"
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

          {/* Mobile Menu Button */}
          <button 
            className="touch-button md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#2d5016',
              borderRadius: '8px',
              padding: '8px'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  📅 Multi-Calendar Support
                </span>
                <a
                  href="/payment"
                  style={{
                    background: '#2d5016',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  Get Started
                </a>
                <a
                  href="http://yayagent.com"
                  style={{
                    color: '#4a5568',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '16px',
                    textAlign: 'center',
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  Login
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - מותאם מובייל */}
      <section style={{
        background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
        color: '#2d3748',
        padding: 'clamp(6rem, 15vw, 8rem) 0 clamp(4rem, 10vw, 6rem)',
        textAlign: 'center',
        marginTop: '80px',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', width: '100%' }}>
          <h1 className="animate-on-scroll" style={{
            fontSize: 'clamp(2rem, 8vw, 4.5rem)',
            fontWeight: '300',
            marginBottom: '0.5rem',
            lineHeight: '1.1',
            color: '#1a202c',
            letterSpacing: '-0.04em'
          }}>
            Save your time, text your
          </h1>
          <h1 className="text-animate" style={{
            fontSize: 'clamp(2rem, 8vw, 4.5rem)',
            fontWeight: '300',
            marginBottom: '2rem',
            lineHeight: '1.1',
            minHeight: 'clamp(3rem, 8vw, 5rem)',
            color: '#1a202c',
            letterSpacing: '-0.04em'
          }}>
            <span style={{
              background: '#e6f4ea',
              padding: 'clamp(6px, 2vw, 12px) clamp(8px, 3vw, 16px)',
              borderRadius: '12px',
              color: '#2d5016',
              display: 'inline-block'
            }}>
              {isClient ? heroTexts[currentTextIndex] : heroTexts[0]}
            </span>
          </h1>

          <div className="animate-on-scroll" style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '50px',
            padding: 'clamp(8px, 3vw, 12px) clamp(16px, 5vw, 24px)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: 'clamp(0.875rem, 4vw, 1rem)',
            color: '#4a5568',
            marginBottom: '2rem',
            fontWeight: '400',
            maxWidth: '90%'
          }}>
            Your executive assistant in <strong>WhatsApp</strong>
            <MessageCircle size={18} style={{ color: '#25d366' }} />
          </div>

          <div className="animate-on-scroll" style={{
            fontSize: 'clamp(1.25rem, 6vw, 1.5rem)',
            fontWeight: '400',
            margin: '2rem 0',
            color: '#1a202c',
            letterSpacing: '-0.01em'
          }}>
            <a href="https://wa.me/972559943649" style={{ color: 'inherit', textDecoration: 'none' }}>
              +972 55-994-3649
            </a>
          </div>

          <a 
            href="/payment" 
            className="animate-on-scroll touch-button" 
            style={{
              background: '#2d5016',
              color: 'white',
              padding: 'clamp(12px, 4vw, 16px) clamp(24px, 8vw, 32px)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: 'clamp(1rem, 4vw, 1.1rem)',
              fontWeight: '500',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(45, 80, 22, 0.3)',
              minHeight: '48px'
            }}>
            Start Free Trial
          </a>
        </div>
      </section>

      {/* Features Section - מותאם מובייל */}
      <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 0', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 className="animate-on-scroll" style={{
            fontSize: 'clamp(2rem, 6vw, 2.5rem)',
            fontWeight: '300',
            marginBottom: 'clamp(3rem, 8vw, 4rem)',
            color: '#1a202c',
            textAlign: 'center',
            letterSpacing: '-0.02em'
          }}>
            Save 3 hours a week with Yaya
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', 
            gap: 'clamp(2rem, 6vw, 4rem)' 
          }}>
            {/* Feature 1 */}
            <div className="animate-on-scroll slide-in-left" style={{ textAlign: 'center' }}>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 5vw, 1.5rem)',
                fontWeight: '400',
                marginBottom: '1rem',
                color: '#2d3748',
                letterSpacing: '-0.01em',
                lineHeight: '1.3'
              }}>
                Create hundreds of events, in seconds
              </h3>
              <p style={{
                color: '#718096',
                marginBottom: '2rem',
                fontSize: 'clamp(0.875rem, 4vw, 1rem)',
                lineHeight: '1.7',
                fontWeight: '400'
              }}>
                Modify an event with a voice message. Search multiple calendars, instantly.
                Yaya knows when you're busy or free and organizes your weekly schedule.
              </p>
              <div style={{ marginBottom: '1.5rem', fontSize: 'clamp(0.875rem, 4vw, 0.95rem)' }}>
                <div style={{ color: '#4a5568', marginBottom: '0.5rem' }}>We support:</div>
                <div style={{ color: '#2d5016', fontWeight: '500' }}>• Outlook Calendar</div>
                <div style={{ color: '#2d5016', fontWeight: '500' }}>• Google Calendar</div>
              </div>

              <PhoneMockup
                messages={[
                  { text: "Add lunch with Sarah tomorrow at 1pm", sender: "user" },
                  { text: "I've created an event on your calendar for tomorrow at 1:00 PM - Lunch with Sarah ✅", sender: "yaya" }
                ]}
              />
            </div>

            {/* Feature 2 */}
            <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 5vw, 1.5rem)',
                fontWeight: '400',
                marginBottom: '1rem',
                color: '#2d3748',
                letterSpacing: '-0.01em',
                lineHeight: '1.3'
              }}>
                Stop forgetting your small tasks
              </h3>
              <p style={{
                color: '#718096',
                marginBottom: '2rem',
                fontSize: 'clamp(0.875rem, 4vw, 1rem)',
                lineHeight: '1.7',
                fontWeight: '400'
              }}>
                Create single or repeating reminders in your own language!
                Yaya can even send reminders to your friends, so you don't have to.
              </p>

              <PhoneMockup
                messages={[
                  { text: "Remind me to call mom every Sunday at 6pm", sender: "user" },
                  { text: "Perfect! I'll remind you to call mom every Sunday at 6:00 PM 📞", sender: "yaya" },
                  { text: "🔔 Reminder: Call mom", sender: "yaya" }
                ]}
              />
            </div>

            {/* Feature 3 */}
            <div className="animate-on-scroll slide-in-right" style={{ textAlign: 'center' }}>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 5vw, 1.5rem)',
                fontWeight: '400',
                marginBottom: '1rem',
                color: '#2d3748',
                letterSpacing: '-0.01em',
                lineHeight: '1.3'
              }}>
                Your ToDo list in WhatsApp
              </h3>
              <p style={{
                color: '#718096',
                marginBottom: '2rem',
                fontSize: 'clamp(0.875rem, 4vw, 1rem)',
                lineHeight: '1.7',
                fontWeight: '400'
              }}>
                No app download required. Your ToDo list, gift ideas list, or grocery list
                are easily accessible with Yaya. Ask Yaya to create and check your lists.
              </p>

              <PhoneMockup
                messages={[
                  { text: "Add milk, eggs, and bread to my shopping list", sender: "user" },
                  { text: "Added to your Shopping List! 🛒\n\n✓ Milk\n✓ Eggs\n✓ Bread", sender: "yaya" }
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Learning Section */}
      <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 0', background: '#fafafa' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h2 className="animate-on-scroll" style={{
            fontSize: 'clamp(2rem, 6vw, 2.5rem)',
            fontWeight: '300',
            marginBottom: '2rem',
            color: '#1a202c',
            letterSpacing: '-0.02em'
          }}>
            Yaya learns from you and gets smarter over time
          </h2>
          <p className="animate-on-scroll" style={{
            fontSize: 'clamp(1rem, 4vw, 1.1rem)',
            color: '#718096',
            lineHeight: '1.7',
            fontWeight: '400'
          }}>
            Send in a voice note and Yaya will understand you, across 100 languages.
            You can even send in an image and Yaya will understand. Tell Yaya what you prefer,
            and Yaya will listen to you!
          </p>
        </div>
      </section>

      {/* Pricing Section - מותאם מובייל */}
      <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h2 className="animate-on-scroll" style={{
            fontSize: 'clamp(2.5rem, 6vw, 3rem)',
            fontWeight: '400',
            marginBottom: '1.5rem',
            color: '#8B5E3C',
            letterSpacing: '-0.02em'
          }}>
            Simple Pricing
          </h2>

          {/* Billing Toggle - מותאם מובייל */}
          <div className="animate-on-scroll" style={{
            display: 'flex',
            gap: '4px',
            justifyContent: 'center',
            marginBottom: 'clamp(3rem, 8vw, 4rem)',
            background: '#f7fafc',
            borderRadius: '8px',
            padding: '4px',
            width: 'fit-content',
            margin: '0 auto clamp(3rem, 8vw, 4rem)',
            cursor: 'pointer',
            maxWidth: '90%'
          }}>
            <span 
              onClick={() => setBillingType('yearly')}
              className="touch-button"
              style={{
                background: billingType === 'yearly' ? 'white' : 'transparent',
                color: billingType === 'yearly' ? '#8B5E3C' : '#999',
                padding: 'clamp(6px, 2vw, 8px) clamp(12px, 4vw, 20px)',
                borderRadius: '6px',
                fontSize: 'clamp(0.875rem, 4vw, 1.1rem)',
                fontWeight: '500',
                boxShadow: billingType === 'yearly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                flex: 1
              }}
            >
              Yearly Billing
            </span>
            <span 
              onClick={() => setBillingType('monthly')}
              className="touch-button"
              style={{
                background: billingType === 'monthly' ? 'white' : 'transparent',
                color: billingType === 'monthly' ? '#8B5E3C' : '#999',
                padding: 'clamp(6px, 2vw, 8px) clamp(12px, 4vw, 20px)',
                borderRadius: '6px',
                fontSize: 'clamp(0.875rem, 4vw, 1.1rem)',
                fontWeight: '500',
                boxShadow: billingType === 'monthly' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                flex: 1
              }}
            >
              Monthly Billing
            </span>
          </div>

          {/* Pricing Cards - מותאם מובייל */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(1.5rem, 4vw, 2rem)',
            marginBottom: '3rem'
          }}>
            {/* Basic Plan */}
            <div className="animate-on-scroll touch-button" style={{
              background: '#F5F1EB',
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 5vw, 2.5rem) clamp(1rem, 4vw, 2rem)',
              textAlign: 'left',
              border: '1px solid #E5DDD5',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: 0.7
            }}
            onClick={() => handlePlanAction('basic')}
            >
              <div style={{ 
                fontSize: 'clamp(0.8rem, 3vw, 0.9rem)', 
                color: '#8B5E3C', 
                fontWeight: '500', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                BASIC PLAN
              </div>
              <div style={{ 
                fontSize: 'clamp(3rem, 10vw, 4rem)', 
                fontWeight: '300', 
                color: '#8B5E3C', 
                marginBottom: '2rem',
                lineHeight: '1'
              }}>
                FREE
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                {[
                  'Unlimited messages',
                  'Unlimited one-time reminders',
                  '100+ languages supported',
                  'ChatGPT',
                  '5 Voice Notes / Month',
                  '5 Image Analysis / Month',
                  'Receive reminders from friends'
                ].map((feature, index) => (
                  <div key={index} style={{ 
                    color: '#8B5E3C', 
                    marginBottom: '0.75rem', 
                    fontSize: 'clamp(0.875rem, 4vw, 0.95rem)', 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '8px',
                    lineHeight: '1.4'
                  }}>
                    <span style={{ color: '#8B5E3C', fontSize: '1rem', minWidth: '16px' }}>•</span>
                    {feature}
                  </div>
                ))}
              </div>

              <div style={{
                background: 'rgba(37, 211, 102, 0.1)',
                color: '#25d366',
                padding: '12px 16px',
                borderRadius: '12px',
                textAlign: 'center',
                fontSize: 'clamp(0.875rem, 4vw, 0.9rem)',
                fontWeight: '500',
                border: '1px solid rgba(37, 211, 102, 0.2)'
              }}>
                💬 Available on WhatsApp Only
              </div>
            </div>

            {/* Executive Plan */}
            <div className="animate-on-scroll touch-button" style={{
              background: '#F5F1EB',
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 5vw, 2.5rem) clamp(1rem, 4vw, 2rem)',
              textAlign: 'left',
              position: 'relative',
              border: '2px solid #8B5E3C',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => handlePlanAction('executive')}
            >
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#8B5E3C',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: 'clamp(0.7rem, 3vw, 0.75rem)',
                fontWeight: '500'
              }}>
                7 DAY TRIAL
              </div>
              <div style={{ 
                fontSize: 'clamp(0.8rem, 3vw, 0.9rem)', 
                color: '#8B5E3C', 
                fontWeight: '500', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                EXECUTIVE PLAN
              </div>
              <div style={{ 
                fontSize: 'clamp(3rem, 10vw, 4rem)', 
                fontWeight: '300', 
                color: '#8B5E3C', 
                marginBottom: '0.5rem',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px'
              }}>
                ${billingType === 'yearly' ? '4' : '5'}
                <span style={{ fontSize: 'clamp(0.875rem, 4vw, 1rem)', fontWeight: '400' }}>/MONTH</span>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                {[
                  'Unlimited messages',
                  'Unlimited one-time reminders',
                  '100+ languages supported',
                  'ChatGPT',
                  'Google / Outlook Calendar',
                  '100 Voice Notes / Month',
                  '20 Image Analysis / Month',
                  '20 Internet Searches',
                  'Send/Receive reminders with friends',
                  'AI Memory of You',
                  'Create Lists'
                ].map((feature, index) => (
                  <div key={index} style={{ 
                    color: '#8B5E3C', 
                    marginBottom: '0.75rem', 
                    fontSize: 'clamp(0.875rem, 4vw, 0.95rem)', 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '8px',
                    lineHeight: '1.4'
                  }}>
                    <span style={{ color: '#8B5E3C', fontSize: '1rem', minWidth: '16px' }}>•</span>
                    {feature}
                  </div>
                ))}
              </div>
              
              <div style={{
                textAlign: 'center',
                fontSize: 'clamp(0.875rem, 4vw, 0.9rem)',
                color: '#8B5E3C',
                fontWeight: '400',
                marginTop: '1.5rem'
              }}>
                4,100+ users loving this plan
              </div>
            </div>

            {/* Ultimate Plan */}
            <div className="animate-on-scroll touch-button" style={{
              background: '#F5F1EB',
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 5vw, 2.5rem) clamp(1rem, 4vw, 2rem)',
              textAlign: 'left',
              position: 'relative',
              border: '1px solid #E5DDD5',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => handlePlanAction('ultimate')}
            >
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#8B5E3C',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: 'clamp(0.7rem, 3vw, 0.75rem)',
                fontWeight: '500'
              }}>
                7 DAY TRIAL
              </div>
              <div style={{ 
                fontSize: 'clamp(0.8rem, 3vw, 0.9rem)', 
                color: '#8B5E3C', 
                fontWeight: '500', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                ULTIMATE PLAN
              </div>
              <div style={{ 
                fontSize: 'clamp(3rem, 10vw, 4rem)', 
                fontWeight: '300', 
                color: '#8B5E3C', 
                marginBottom: '0.5rem',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px'
              }}>
                ${billingType === 'yearly' ? '13' : '14'}
                <span style={{ fontSize: 'clamp(0.875rem, 4vw, 1rem)', fontWeight: '400' }}>/MONTH</span>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                {[
                  'Unlimited messages',
                  'Unlimited one-time reminders',
                  '100+ languages supported',
                  'ChatGPT',
                  'Repeat reminders',
                  'Google / Outlook Calendar',
                  '500 Voice Notes / Month',
                  '100 Image Analysis / Month',
                  '100 Internet Searches',
                  'Send/Receive reminders with friends',
                  'AI Memory of You',
                  'Create Lists'
                ].map((feature, index) => (
                  <div key={index} style={{ 
                    color: '#8B5E3C', 
                    marginBottom: '0.75rem', 
                    fontSize: 'clamp(0.875rem, 4vw, 0.95rem)', 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '8px',
                    lineHeight: '1.4'
                  }}>
                    <span style={{ color: '#8B5E3C', fontSize: '1rem', minWidth: '16px' }}>•</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Need Yaya for your Team */}
          <div className="animate-on-scroll" style={{
            fontSize: 'clamp(1rem, 4vw, 1.1rem)',
            color: '#8B5E3C',
            marginTop: '3rem',
            textAlign: 'center'
          }}>
            Need Yaya for your Team?{' '}
            <a href="mailto:info@textcoco.com" style={{ textDecoration: 'underline' }}>
              Contact us
            </a>
          </div>
        </div>
      </section>

      {/* Footer - מותאם מובייל */}
      <footer style={{ background: '#1a202c', color: '#a0aec0', padding: 'clamp(2rem, 6vw, 3rem) 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', fontWeight: '500', color: 'white' }}>Yaya</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(1rem, 4vw, 2rem)',
            flexWrap: 'wrap',
            fontSize: 'clamp(0.8rem, 3.5vw, 0.875rem)'
          }}>
            <a href="/privacy-policy" style={{ 
              color: 'inherit', 
              textDecoration: 'none',
              padding: '8px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center'
            }}>
              Privacy Policy
            </a>
            <a href="/terms-of-service" style={{ 
              color: 'inherit', 
              textDecoration: 'none',
              padding: '8px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center'
            }}>
              Terms of Service
            </a>
            <a href="/posts" style={{ 
              color: 'inherit', 
              textDecoration: 'none',
              padding: '8px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center'
            }}>
              Blog
            </a>
            <a href="https://discord.gg/BRxAAq47xv" style={{ 
              color: 'inherit', 
              textDecoration: 'none',
              padding: '8px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center'
            }}>
              Discord
            </a>
            <a href="https://x.com/yayagent" style={{ 
              color: 'inherit', 
              textDecoration: 'none',
              padding: '8px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center'
            }}>
              X/Twitter
            </a>
            <a href="mailto:info@yayagent.com" style={{ 
              color: 'inherit', 
              textDecoration: 'none',
              padding: '8px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center'
            }}>
              info@yayagent.com
            </a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button - מותאם מובייל */}
      <a
        title="Chat with Yaya on WhatsApp"
        href={registrationCode 
          ? `https://wa.me/972559943649?text=My code: ${registrationCode}`
          : "https://wa.me/972559943649"
        }
        className="touch-button"
        style={{
          position: 'fixed',
          bottom: 'clamp(16px, 4vw, 24px)',
          right: 'clamp(16px, 4vw, 24px)',
          background: '#25d366',
          color: 'white',
          borderRadius: '50%',
          width: 'clamp(48px, 12vw, 56px)',
          height: 'clamp(48px, 12vw, 56px)',
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
