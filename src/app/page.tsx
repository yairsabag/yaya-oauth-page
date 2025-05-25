'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, Phone, MessageCircle } from 'lucide-react'

export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ee751a' }}>
            Yaya
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="https://wa.me/972559943649" style={{ background: 'linear-gradient(135deg, #ee751a 0%, #f19340 100%)', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' }}>
              Get Started
            </a>
            <a href="http://app.textcoco.com" style={{ color: '#6b7280', textDecoration: 'none' }}>
              Login
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #ee751a 0%, #f19340 100%)', color: 'white', padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', lineHeight: '1.1' }}>
            Save your time, text your
          </h1>
          <p style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem' }}>
            todo list.
          </p>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
            Your executive assistant in WhatsApp
          </p>
          
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '2rem 0' }}>
            +972 55-994-3649
          </div>
          
          <div style={{ fontSize: '1rem', marginBottom: '2rem' }}>
            Add a 7pm dinner this week with Eva<br/>
            Put amazon return on my ToDo<br/>
            Remind me about bills every thursday night
          </div>
          
          <a href="https://wa.me/972559943649" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '1.1rem', border: '2px solid rgba(255,255,255,0.3)' }}>
            Get Started
          </a>
          
          {/* iPhone Mockup */}
          <div style={{ maxWidth: '300px', margin: '3rem auto' }}>
            <div style={{ background: '#000', borderRadius: '2rem', padding: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ background: '#1f2937', borderRadius: '1.5rem', padding: '2rem 1rem', minHeight: '500px', position: 'relative' }}>
                <div style={{ textAlign: 'left', fontSize: '0.9rem' }}>
                  <div style={{ background: '#25d366', color: 'white', padding: '8px 12px', borderRadius: '12px', marginBottom: '8px', maxWidth: '80%', marginLeft: 'auto' }}>
                    Add a 7pm dinner this week with Eva
                  </div>
                  <div style={{ background: '#374151', color: 'white', padding: '8px 12px', borderRadius: '12px', marginBottom: '8px', maxWidth: '80%' }}>
                    I've created an event on your calendar.
                  </div>
                  <div style={{ background: '#25d366', color: 'white', padding: '8px 12px', borderRadius: '12px', marginBottom: '8px', maxWidth: '80%', marginLeft: 'auto' }}>
                    Remind me to call mom every Sunday
                  </div>
                  <div style={{ background: '#374151', color: 'white', padding: '8px 12px', borderRadius: '12px', marginBottom: '8px', maxWidth: '80%' }}>
                    I'll remind you every Sunday at 6pm!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>
            Save 3 hours a week with Yaya
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginTop: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                Create hundreds of events, in seconds
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Modify an event with a voice message. Search multiple calendars, instantly. Yaya knows when you're busy or free and organizes your weekly schedule.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                Stop forgetting your small tasks
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Create single or repeating reminders in your own language! Yaya can even send reminders to your friends.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                Your ToDo list in WhatsApp
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                No app download required. Your ToDo list, gift ideas list, or grocery list are easily accessible with Yaya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '4rem 0', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>
            Simple Pricing
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {/* Free Plan */}
            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#6b7280', textTransform: 'uppercase' }}>
                Basic Plan
              </h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1f2937', marginBottom: '1rem' }}>
                FREE
              </div>
              <ul style={{ listStyle: 'none', textAlign: 'left', margin: '2rem 0' }}>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>• Unlimited messages</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>• Unlimited one-time reminders</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>• 100+ languages supported</li>
                <li style={{ padding: '0.5rem 0' }}>• 5 Voice Notes / Month</li>
              </ul>
            </div>

            {/* Executive Plan */}
            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '2px solid #ee751a', transform: 'scale(1.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#6b7280', textTransform: 'uppercase' }}>
                Executive Plan
              </h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1f2937', marginBottom: '1rem' }}>
                $5<span style={{ fontSize: '1rem', fontWeight: '400', color: '#6b7280' }}>/MONTH</span>
              </div>
              <ul style={{ listStyle: 'none', textAlign: 'left', margin: '2rem 0' }}>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>• Unlimited messages</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>• Repeat reminders</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>• Google / Outlook Calendar</li>
                <li style={{ padding: '0.5rem 0' }}>• 100 Voice Notes / Month</li>
              </ul>
            </div>

            {/* Ultimate Plan */}
            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#6b7280', textTransform: 'uppercase' }}>
                Ultimate Plan
              </h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1f2937', marginBottom: '1rem' }}>
                $14<span style={{ fontSize: '1rem', fontWeight: '400', color: '#6b7280' }}>/MONTH</span>
              </div>
              <ul style={{ listStyle: 'none', textAlign: 'left', margin: '2rem 0' }}>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>• Unlimited messages</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>• Google / Outlook Calendar</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>• 500 Voice Notes / Month</li>
                <li style={{ padding: '0.5rem 0' }}>• 100 Internet Searches</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1f2937', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Yaya</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="/privacy-policy" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/terms-of-service" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms of Service</a>
            <a href="mailto:info@textcoco.com" style={{ color: '#9ca3af', textDecoration: 'none' }}>info@textcoco.com</a>
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
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', 
          zIndex: 1000 
        }}
      >
        <MessageCircle size={24} />
      </a>
    </div>
  )
}
