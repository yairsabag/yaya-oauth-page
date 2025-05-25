// yaya-oauth-page/src/app/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

function ChatBubbles({ messages }: { messages: Array<{ text: string; sender: 'user' | 'yaya' }> }) {
  const [visibleMessages, setVisibleMessages] = useState(0)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const interval = setInterval(() => {
      setVisibleMessages(prev => {
        if (prev < messages.length) return prev + 1
        clearInterval(interval)
        timeout = setTimeout(() => setVisibleMessages(0), 3000)
        return prev
      })
    }, 1500)

    return () => {
      clearInterval(interval)
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

  const heroTexts = ['calendar.', 'todo list.', 'reminders.']

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
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' })

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
        top: 0, left: 0, right: 0, zIndex: 100
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
              alt="Yaya - WhatsApp Assistant Logo"
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '500',
              color: '#2d3748',
              letterSpacing: '-0.02em'
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
              Multi-Calendar Support 📊
            </span>
            <Link href="/payment" style={{
              background: '#2d5016',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}>
              Start Free Trial
            </Link>
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

          <Link href="/payment" className="animate-on-scroll" style={{
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
          </Link>
        </div>
      </section>

      {/* WhatsApp Button */}
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
      >
        <MessageCircle size={24} />
      </a>
    </div>
  )
}
