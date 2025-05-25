'use client'

import React, { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  
  const heroTexts = [
    "todo list.",
    "calendar.", 
    "reminders."
  ]

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ fontFamily: "Lato, system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src="/yaya-logo.png" 
              alt="Yaya Logo" 
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a67c5a' }}>
              Yaya
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)', color: 'white', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: '500' }}>
              Introducing Multi-Calendar Support📊
            </span>
            <Link href="/payment" style={{ background: 'linear-gradient(135deg, #faf0e6 0%, #f5e6d3 100%)', color: '#6b4e3d', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', border: '1px solid #e6d3c1' }}>
              Get Started
            </Link>
            <a href="http://app.textcoco.com" style={{ color: '#6b7280', textDecoration: 'none' }}>
              Login
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #faf0e6 0%, #f5e6d3 100%)', color: '#4a3429', padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '0.5rem', lineHeight: '1.1', fontFamily: "Montserrat, sans-serif", color: '#3d2817' }}>
            Save your time, text your
          </h1>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1rem', lineHeight: '1.1', fontFamily: "Montserrat, sans-serif", minHeight: '4.5rem', color: '#3d2817' }}>
            {isClient ? heroTexts[currentTextIndex] : "todo list."}
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', opacity: 0.85, fontWeight: '500', color: '#5a4136' }}>
            Your executive assistant in WhatsApp
          </p>
          
          <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '2rem 0', fontFamily: "Montserrat, sans-serif" }}>
            <a href="https://wa.me/972559943649" style={{ color: '#3d2817', textDecoration: 'none' }}>
              +972 55-994-3649
            </a>
          </div>
          
          <div style={{ fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6', opacity: 0.8, color: '#5a4136' }}>
            Add a 7pm dinner this week with Eva<br/>
            Put amazon return on my ToDo<br/>
            Remind me about bills every thursday night
          </div>
          
          <Link href="/payment" style={{ background: 'rgba(61,40,23,0.1)', color: '#3d2817', padding: '16px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '1.2rem', border: '2px solid rgba(61,40,23,0.2)', fontWeight: '600', display: 'inline-block', transition: 'all 0.3s ease' }}>
            Get Started
          </Link>
          
          {/* iPhone Mockup */}
          <div style={{ maxWidth: '320px', margin: '4rem auto 0' }}>
            <div style={{ background: 'linear-gradient(145deg, #1f2937, #374151)', borderRadius: '2.5rem', padding: '1.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
              <div style={{ background: '#111827', borderRadius: '2rem', padding: '2rem 1rem', minHeight: '600px', position: 'relative' }}>
                <div style={{ textAlign: 'left', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: '#25d366', color: 'white', padding: '10px 14px', borderRadius: '18px 18px 6px 18px', maxWidth: '85%', marginLeft: 'auto', fontSize: '0.85rem' }}>
                    Add a 7pm dinner this week with Eva
                  </div>
                  <div style={{ background: '#374151', color: 'white', padding: '10px 14px', borderRadius: '18px 18px 18px 6px', maxWidth: '85%', fontSize: '0.85rem' }}>
                    I've created an event on your calendar.
                  </div>
                  <div style={{ background: '#25d366', color: 'white', padding: '10px 14px', borderRadius: '18px 18px 6px 18px', maxWidth: '85%', marginLeft: 'auto', fontSize: '0.85rem' }}>
                    Remind me to call mom every Sunday
                  </div>
                  <div style={{ background: '#374151', color: 'white', padding: '10px 14px', borderRadius: '18px 18px 18px 6px', maxWidth: '85%', fontSize: '0.85rem' }}>
                    I'll remind you every Sunday at 6pm!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937', fontFamily: "Montserrat, sans-serif" }}>
            Save 3 hours a week with Yaya
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', marginTop: '4rem' }}>
            {/* Feature 1 */}
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937', fontFamily: "Montserrat, sans-serif" }}>
                Create hundreds of events, in seconds
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                Modify an event with a voice message. Search multiple calendars, instantly. Yaya knows when you're busy or free and organizes your weekly schedule. We support:
              </p>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ color: '#a67c5a', fontWeight: '600' }}>Outlook Calendar</span><br/>
                <span style={{ color: '#a67c5a', fontWeight: '600' }}>Google Calendar</span>
              </div>
              <a href="/calendar" style={{ color: '#a67c5a', textDecoration: 'none', fontWeight: '600' }}>Learn More →</a>
              
              {/* Chat Example */}
              <div style={{ marginTop: '2rem', background: '#faf9f7', borderRadius: '12px', padding: '1.5rem', border: '1px solid #f0ebe5' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: '#25d366', color: 'white', padding: '8px 12px', borderRadius: '12px 12px 4px 12px', maxWidth: '80%', fontSize: '0.85rem', marginLeft: 'auto' }}>
                    Add lunch with Sarah tomorrow at 1pm
                  </div>
                  <div style={{ background: '#f5e6d3', color: '#6b4e3d', padding: '8px 12px', borderRadius: '12px 12px 12px 4px', maxWidth: '80%', fontSize: '0.85rem' }}>
                    I've created an event on your calendar.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937', fontFamily: "Montserrat, sans-serif" }}>
                Stop forgetting your small tasks
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                Create single or repeating reminders in your own language! Yaya can even send reminders to your friends, so you don't have to.
              </p>
              <a href="/reminders" style={{ color: '#a67c5a', textDecoration: 'none', fontWeight: '600' }}>Learn More →</a>
              
              {/* Chat Example */}
              <div style={{ marginTop: '2rem', background: '#faf9f7', borderRadius: '12px', padding: '1.5rem', border: '1px solid #f0ebe5' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: '#25d366', color: 'white', padding: '8px 12px', borderRadius: '12px 12px 4px 12px', maxWidth: '80%', fontSize: '0.85rem', marginLeft: 'auto' }}>
                    Remind me to call mom every Sunday
                  </div>
                  <div style={{ background: '#f5e6d3', color: '#6b4e3d', padding: '8px 12px', borderRadius: '12px 12px 12px 4px', maxWidth: '80%', fontSize: '0.85rem' }}>
                    I'll remind you every Sunday at 6pm!
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937', fontFamily: "Montserrat, sans-serif" }}>
                Your ToDo list in WhatsApp
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                No app download required. Your ToDo list, gift ideas list, or grocery list are easily accessible with Yaya. Ask Yaya to create and check your lists. You can even check your lists on the Dashboard.
              </p>
              
              {/* Chat Example */}
              <div style={{ marginTop: '2rem', background: '#faf9f7', borderRadius: '12px', padding: '1.5rem', border: '1px solid #f0ebe5' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: '#25d366', color: 'white', padding: '8px 12px', borderRadius: '12px 12px 4px 12px', maxWidth: '80%', fontSize: '0.85rem', marginLeft: 'auto' }}>
                    Add milk, eggs, and bread to my shopping list
                  </div>
                  <div style={{ background: '#f5e6d3', color: '#6b4e3d', padding: '8px 12px', borderRadius: '12px 12px 12px 4px', maxWidth: '80%', fontSize: '0.85rem' }}>
                    Added to your Shopping List!
                  </div>
                  <div style={{ background: '#25d366', color: 'white', padding: '8px 12px', borderRadius: '12px 12px 4px 12px', maxWidth: '80%', fontSize: '0.85rem', marginLeft: 'auto' }}>
                    Be more casual in your responses
                  </div>
                  <div style={{ background: '#f5e6d3', color: '#6b4e3d', padding: '8px 12px', borderRadius: '12px 12px 12px 4px', maxWidth: '80%', fontSize: '0.85rem' }}>
                    Got it! I'll keep things more relaxed 😊
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Section */}
      <section style={{ padding: '5rem 0', background: '#faf9f7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937', fontFamily: "Montserrat, sans-serif" }}>
            Yaya learns from you and gets smarter over time
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Send in a voice note and Yaya will understand you, across 100 languages. You can even send in an image and Yaya will understand. Tell Yaya what you prefer, and Yaya will listen to you!
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937', fontFamily: "Montserrat, sans-serif" }}>
            Simple Pricing
          </h2>
          
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '3rem' }}>
            <span style={{ background: '#f3f4f6', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', color: '#6b7280' }}>Yearly Billing</span>
            <span style={{ background: '#faf0e6', color: '#6b4e3d', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', border: '1px solid #e6d3c1' }}>Monthly Billing</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {/* Free Plan */}
            <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Basic Plan
              </h3>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.5rem', fontFamily: "Montserrat, sans-serif" }}>
                FREE
              </div>
              <ul style={{ listStyle: 'none', textAlign: 'left', margin: '2rem 0', padding: 0 }}>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• Unlimited messages</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• Unlimited one-time reminders</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• 100+ languages supported</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• ChatGPT</li>
                <li style={{ padding: '8px 0', fontSize: '0.95rem' }}>• 5 Voice Notes / Month</li>
              </ul>
              <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#a67c5a', fontWeight: '600', fontSize: '0.9rem' }}>
                7 DAY TRIAL
              </div>
            </div>

            {/* Executive Plan */}
            <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 20px 40px rgba(250, 240, 230, 0.4)', border: '2px solid #faf0e6', transform: 'scale(1.05)', position: 'relative' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Executive Plan
              </h3>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.5rem', fontFamily: "Montserrat, sans-serif" }}>
                $5<span style={{ fontSize: '1.2rem', fontWeight: '400', color: '#6b7280' }}>/MONTH</span>
              </div>
              <ul style={{ listStyle: 'none', textAlign: 'left', margin: '2rem 0', padding: 0 }}>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• Unlimited messages</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• Repeat reminders</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• Google / Outlook Calendar</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• 100 Voice Notes / Month</li>
                <li style={{ padding: '8px 0', fontSize: '0.95rem' }}>• AI Memory of You</li>
              </ul>
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>4,100+ users loving this plan</div>
                <div style={{ color: '#a67c5a', fontWeight: '600', fontSize: '0.9rem' }}>7 DAY TRIAL</div>
              </div>
            </div>

            {/* Ultimate Plan */}
            <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ultimate Plan
              </h3>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: '#1f2937', marginBottom: '0.5rem', fontFamily: "Montserrat, sans-serif" }}>
                $14<span style={{ fontSize: '1.2rem', fontWeight: '400', color: '#6b7280' }}>/MONTH</span>
              </div>
              <ul style={{ listStyle: 'none', textAlign: 'left', margin: '2rem 0', padding: 0 }}>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• Unlimited messages</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• Google / Outlook Calendar</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• 500 Voice Notes / Month</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.95rem' }}>• 100 Internet Searches</li>
                <li style={{ padding: '8px 0', fontSize: '0.95rem' }}>• Create Lists</li>
              </ul>
              <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#a67c5a', fontWeight: '600', fontSize: '0.9rem' }}>
                7 DAY TRIAL
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '1rem' }}>Need Yaya for your Team?</p>
            <a href="mailto:info@textcoco.com?subject=Yaya%20AI%20for%20my%20Team" style={{ color: '#a67c5a', textDecoration: 'none', fontWeight: '600' }}>Email Us</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1f2937', color: 'white', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#faf0e6' }}>Yaya</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="/privacy-policy" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</a>
            <a href="/terms-of-service" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</a>
            <a href="/posts" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Blog</a>
            <a href="https://discord.gg/BRxAAq47xv" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Discord</a>
            <a href="https://x.com/textcoco" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>X/Twitter</a>
            <a href="mailto:info@textcoco.com" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>info@textcoco.com</a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/972559943649" 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          background: '#25d366', 
          color: 'white', 
          borderRadius: '50%', 
          width: '60px', 
          height: '60px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textDecoration: 'none', 
          boxShadow: '0 8px 20px rgba(37, 211, 102, 0.4)', 
          zIndex: 1000,
          transition: 'transform 0.3s ease'
        }}
      >
        <MessageCircle size={24} />
      </a>
    </div>
  )
}
