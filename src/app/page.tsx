'use client'
import React, { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'

// Chat Bubbles Component
function ChatBubbles({ messages }) {
  const [visibleMessages, setVisibleMessages] = useState(0)
  
  useEffect(() => {
    let timeout
    const timer = setInterval(() => {
      setVisibleMessages(prev => {
        if (prev < messages.length) return prev + 1
        clearInterval(timer)
        timeout = setTimeout(() => setVisibleMessages(0), 2000)
        return prev
      })
    }, 1500)
    
    return () => {
      clearInterval(timer)
      clearTimeout(timeout)
    }
  }, [messages.length])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.5rem' }}>
      {messages.slice(0, visibleMessages).map((message, index) => (
        <div
          key={index}
          style={{
            background: message.sender === 'user' ? '#25d366' : '#f1f5f9',
            color: message.sender === 'user' ? 'white' : '#334155',
            padding: '8px 12px',
            borderRadius: message.sender === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
            maxWidth: '80%',
            fontSize: '0.85rem',
            marginLeft: message.sender === 'user' ? 'auto' : '0',
            opacity: 0,
            animation: 'fadeInUp 0.5s ease-out forwards',
            animationDelay: `${index * 0.2}s`
          }}
        >
          {message.text}
        </div>
      ))}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          div {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  )
}

export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)

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
            <div style={{
              width: '80px',
              height: '40px',
              background: '#2d5016',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              Yaya
            </div>
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

          {/* Hero Continued */}
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

          <a href="/payment" className="animate-on-scroll" style={{
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

      {/* Features Section */}
      <section style={{ padding: '6rem 0', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 className="animate-on-scroll" style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            marginBottom: '4rem',
            color: '#1a202c',
            textAlign: 'center',
            letterSpacing: '-0.02em'
          }}>
            Save 3 hours a week with Yaya
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
            {/* Feature 1 */}
            <div className="animate-on-scroll slide-in-left" style={{ textAlign: 'left' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '400',
                marginBottom: '1rem',
                color: '#2d3748',
                letterSpacing: '-0.01em'
              }}>
                Create hundreds of events, in seconds
              </h3>
              <p style={{
                color: '#718096',
                marginBottom: '2rem',
                fontSize: '1rem',
                lineHeight: '1.7',
                fontWeight: '400'
              }}>
                Modify an event with a voice message. Search multiple calendars, instantly.
                Yaya knows when you're busy or free and organizes your weekly schedule.
              </p>
              <div style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                <div style={{ color: '#4a5568', marginBottom: '0.5rem' }}>We support:</div>
                <div style={{ color: '#2d5016', fontWeight: '500' }}>• Outlook Calendar</div>
                <div style={{ color: '#2d5016', fontWeight: '500' }}>• Google Calendar</div>
              </div>
              <a href="/calendar" style={{
                color: '#2d5016',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Learn More →
              </a>

              <ChatBubbles
                messages={[
                  { text: "Add lunch with Sarah tomorrow at 1pm", sender: "user" },
                  { text: "I've created an event on your calendar.", sender: "yaya" }
                ]}
              />
            </div>

            {/* Feature 2 */}
            <div className="animate-on-scroll" style={{ textAlign: 'left' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '400',
                marginBottom: '1rem',
                color: '#2d3748',
                letterSpacing: '-0.01em'
              }}>
                Stop forgetting your small tasks
              </h3>
              <p style={{
                color: '#718096',
                marginBottom: '2rem',
                fontSize: '1rem',
                lineHeight: '1.7',
                fontWeight: '400'
              }}>
                Create single or repeating reminders in your own language!
                Yaya can even send reminders to your friends, so you don't have to.
              </p>
              <a href="/reminders" style={{
                color: '#2d5016',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Learn More →
              </a>

              <ChatBubbles
                messages={[
                  { text: "Remind me to call mom every Sunday", sender: "user" },
                  { text: "I'll remind you every Sunday at 6pm!", sender: "yaya" }
                ]}
              />
            </div>

            {/* Feature 3 */}
            <div className="animate-on-scroll slide-in-right" style={{ textAlign: 'left' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '400',
                marginBottom: '1rem',
                color: '#2d3748',
                letterSpacing: '-0.01em'
              }}>
                Your ToDo list in WhatsApp
              </h3>
              <p style={{
                color: '#718096',
                marginBottom: '2rem',
                fontSize: '1rem',
                lineHeight: '1.7',
                fontWeight: '400'
              }}>
                No app download required. Your ToDo list, gift ideas list, or grocery list
                are easily accessible with Yaya. Ask Yaya to create and check your lists.
              </p>

              <ChatBubbles
                messages={[
                  { text: "Add milk, eggs, and bread to my shopping list", sender: "user" },
                  { text: "Added to your Shopping List!", sender: "yaya" },
                  { text: "Be more casual in your responses", sender: "user" },
                  { text: "Got it! I'll keep things more relaxed 😊", sender: "yaya" }
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Learning Section */}
      <section style={{ padding: '6rem 0', background: '#fafafa' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <h2 className="animate-on-scroll" style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            marginBottom: '2rem',
            color: '#1a202c',
            letterSpacing: '-0.02em'
          }}>
            Yaya learns from you and gets smarter over time
          </h2>
          <p className="animate-on-scroll" style={{
            fontSize: '1.1rem',
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

      {/* Pricing Section */}
      <section style={{ padding: '6rem 0', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <h2 className="animate-on-scroll" style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            marginBottom: '3rem',
            color: '#1a202c',
            letterSpacing: '-0.02em'
          }}>
            Simple Pricing
          </h2>

          <div className="animate-on-scroll" style={{
            display: 'flex',
            gap: '4px',
            justifyContent: 'center',
            marginBottom: '4rem',
            background: '#f7fafc',
            borderRadius: '8px',
            padding: '4px',
            width: 'fit-content',
            margin: '0 auto 4rem'
          }}>
            <span style={{
              background: 'transparent',
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '0.875rem',
              color: '#4a5568',
              fontWeight: '500'
            }}>
              Yearly Billing
            </span>
            <span style={{
              background: 'white',
              color: '#1a202c',
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Monthly Billing
            </span>
          </div>

          {/* Pricing Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Basic Plan */}
            <div className="animate-on-scroll" style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'left'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1a202c' }}>
                Basic
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', marginBottom: '1rem' }}>
                $9<span style={{ fontSize: '1rem', fontWeight: '400', color: '#718096' }}>/month</span>
              </div>
              <p style={{ color: '#718096', marginBottom: '2rem', fontSize: '0.9rem' }}>
                Perfect for personal use
              </p>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ color: '#4a5568', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✓ Calendar management</div>
                <div style={{ color: '#4a5568', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✓ Task reminders</div>
                <div style={{ color: '#4a5568', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✓ Todo lists</div>
                <div style={{ color: '#4a5568', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✓ Voice messages</div>
              </div>
              <a href="/payment" style={{
                background: '#2d5016',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'block',
                textAlign: 'center'
              }}>
                Get Started
              </a>
            </div>

            {/* Pro Plan */}
            <div className="animate-on-scroll" style={{
              background: 'white',
              border: '2px solid #2d5016',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'left',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#2d5016',
                color: 'white',
                padding: '4px 16px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Most Popular
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1a202c' }}>
                Pro
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', marginBottom: '1rem' }}>
                $19<span style={{ fontSize: '1rem', fontWeight: '400', color: '#718096' }}>/month</span>
              </div>
              <p style={{ color: '#718096', marginBottom: '2rem', fontSize: '0.9rem' }}>
                For power users and teams
              </p>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ color: '#4a5568', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✓ Everything in Basic</div>
                <div style={{ color: '#4a5568', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✓ Multiple calendars</div>
                <div style={{ color: '#4a5568', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✓ Team reminders</div>
                <div style={{ color: '#4a5568', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✓ Priority support</div>
              </div>
              <a href="/payment" style={{
                background: '#2d5016',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'block',
                textAlign: 'center'
              }}>
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a202c', color: '#a0aec0', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '500', color: 'white' }}>Yaya</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            fontSize: '0.875rem'
          }}>
            <a href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/terms-of-service" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="/posts" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</a>
            <a href="https://discord.gg/BRxAAq47xv" style={{ color: 'inherit', textDecoration: 'none' }}>Discord</a>
            <a href="https://x.com/textcoco" style={{ color: 'inherit', textDecoration: 'none' }}>X/Twitter</a>
            <a href="mailto:info@textcoco.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@textcoco.com</a>
          </div>
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
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        <MessageCircle size={24} />
      </a>
    </div>
  )
}
