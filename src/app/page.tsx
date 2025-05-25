'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  
  const heroTexts = [
    "calendar.",
    "todo list.", 
    "reminders."
  ]

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)

    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    animatedElements.forEach((el) => observer.observe(el))

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
        
        .text-animate {
          transition: all 0.5s ease-in-out;
          opacity: 1;
        }
      `}</style>

      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1rem 0', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="/yaya-logo.png" 
              alt="Yaya Logo" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
            <div style={{ fontSize: '1.5rem', fontWeight: '500', color: '#2d3748', letterSpacing: '-0.02em' }}>
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
              Introducing Multi-Calendar Support 📊
            </span>
            <Link 
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
              }}
            >
              Get Started
            </Link>
            <a 
              href="http://app.textcoco.com" 
              style={{ 
                color: '#4a5568', 
                textDecoration: 'none', 
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '8px 16px'
              }}
            >
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
            fontSize: '4.5rem', 
            fontWeight: '300', 
            marginBottom: '0.5rem', 
            lineHeight: '1.1', 
            color: '#1a202c',
            letterSpacing: '-0.04em'
          }}>
            Save your time, text your
          </h1>
          <h1 className="text-animate" style={{ 
            fontSize: '4.5rem', 
            fontWeight: '300', 
            marginBottom: '2rem', 
            lineHeight: '1.1', 
            minHeight: '5rem', 
            color: '#1a202c',
            letterSpacing: '-0.04em'
          }}>
            {isClient ? heroTexts[currentTextIndex] : "calendar."}
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
          
          <div className="animate-on-scroll" style={{
            background: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(0,0,0,0.05)',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.95rem',
            color: '#4a5568',
            marginBottom: '3rem',
            maxWidth: '400px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <span style={{ 
              background: '#4285f4', 
              color: 'white', 
              borderRadius: '4px', 
              padding: '4px 8px', 
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>31</span>
            Add a 7pm dinner this week with Eva
            <span style={{ marginLeft: 'auto', color: '#a0aec0' }}>↑</span>
          </div>
          
          <Link 
            href="/payment" 
            className="animate-on-scroll"
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
            Get Started
          </Link>
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
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Executive Plan */}
            <div className="animate-on-scroll slide-in-left" style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem', 
              border: '2px solid #e2e8f0',
              position: 'relative'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem', 
                color: '#4a5568', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                fontSize: '0.75rem'
              }}>
                Executive Plan
              </h3>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '300', 
                color: '#1a202c', 
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                $5<span style={{ fontSize: '1rem', fontWeight: '400', color: '#718096' }}>/month</span>
              </div>
              <p style={{ color: '#2d5016', fontWeight: '500', fontSize: '0.875rem', marginBottom: '2rem' }}>
                7 DAY FREE TRIAL
              </p>
              <Link
                href="/payment/checkout?plan=executive&price=5"
                style={{
                  display: 'block',
                  background: '#2d5016',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Start Free Trial
              </Link>
            </div>

            {/* Ultimate Plan */}
            <div className="animate-on-scroll slide-in-right" style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem', 
              border: '2px solid #e2e8f0'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem', 
                color: '#4a5568', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                fontSize: '0.75rem'
              }}>
                Ultimate Plan
              </h3>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '300', 
                color: '#1a202c', 
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                $14<span style={{ fontSize: '1rem', fontWeight: '400', color: '#718096' }}>/month</span>
              </div>
              <p style={{ color: '#2d5016', fontWeight: '500', fontSize: '0.875rem', marginBottom: '2rem' }}>
                7 DAY FREE TRIAL
              </p>
              <Link
                href="/payment/checkout?plan=ultimate&price=14"
                style={{
                  display: 'block',
                  background: 'transparent',
                  color: '#2d5016',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  border: '1px solid #2d5016',
                  transition: 'all 0.2s ease'
                }}
              >
                Start Free Trial
              </Link>
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
            <a href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/terms-of-service" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="/posts" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</a>
            <a href="https://discord.gg/BRxAAq47xv" style={{ color: 'inherit', textDecoration: 'none' }}>Discord</a>
            <a href="https://x.com/textcoco" style={{ color: 'inherit', textDecoration: 'none' }}>X/Twitter</a>
            <a href="mailto:info@textcoco.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@textcoco.com</a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a 
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
      >
        <MessageCircle size={24} />
      </a>
    </div>
  )
}
