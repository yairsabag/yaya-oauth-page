'use client'

import React from 'react'
import Link from 'next/link'
import { CheckIcon } from 'lucide-react'

export default function PaymentPage() {
  const plans = [
    {
      id: 'executive',
      name: 'Executive Plan',
      price: 5,
      popular: true,
      features: [
        'Unlimited messages',
        'Repeat reminders', 
        'Google / Outlook Calendar',
        '100 Voice Notes / Month',
        '20 Image Analysis / Month',
        'AI Memory of You',
        'Create Lists'
      ]
    },
    {
      id: 'ultimate',
      name: 'Ultimate Plan', 
      price: 14,
      popular: false,
      features: [
        'Everything in Executive',
        '500 Voice Notes / Month',
        '100 Image Analysis / Month',
        '100 Internet Searches',
        'Priority Support',
        'Advanced Analytics'
      ]
    }
  ]

  return (
    <div style={{ fontFamily: "Lato, system-ui, -apple-system, sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf0e6 0%, #f5e6d3 100%)' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img 
              src="/yaya-logo.png" 
              alt="Yaya Logo" 
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            />
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a67c5a' }}>
              Yaya
            </div>
          </Link>
          <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#3d2817', marginBottom: '1rem', fontFamily: "Montserrat, sans-serif" }}>
              Choose Your Plan
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#6b4e3d', maxWidth: '600px', margin: '0 auto' }}>
              Start your 7-day free trial. No commitment, cancel anytime.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: 'white',
                  borderRadius: '1.5rem',
                  padding: '2.5rem',
                  boxShadow: plan.popular ? '0 20px 40px rgba(166, 124, 90, 0.2)' : '0 10px 25px rgba(0, 0, 0, 0.1)',
                  border: plan.popular ? '2px solid #a67c5a' : '1px solid #e5e7eb',
                  transform: plan.popular ? 'scale(1.05)' : 'none',
                  position: 'relative'
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#a67c5a',
                    color: 'white',
                    padding: '6px 20px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                    {plan.name}
                  </h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '3rem', fontWeight: '900', color: '#1f2937', fontFamily: "Montserrat, sans-serif" }}>
                      ${plan.price}
                    </span>
                    <span style={{ fontSize: '1rem', color: '#6b7280' }}>/month</span>
                  </div>
                  <p style={{ color: '#a67c5a', fontWeight: '600', fontSize: '0.9rem' }}>
                    7 DAY FREE TRIAL
                  </p>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                  {plan.features.map((feature, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.95rem' }}>
                      <CheckIcon size={20} style={{ color: '#a67c5a', marginRight: '0.75rem', flexShrink: 0 }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/payment/checkout?plan=${plan.id}&price=${plan.price}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: plan.popular ? 'linear-gradient(135deg, #a67c5a 0%, #8b5a3c 100%)' : 'linear-gradient(135deg, #faf0e6 0%, #f5e6d3 100%)',
                    color: plan.popular ? 'white' : '#6b4e3d',
                    padding: '16px 24px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    border: plan.popular ? 'none' : '1px solid #e6d3c1',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Questions? <a href="mailto:info@textcoco.com" style={{ color: '#a67c5a', textDecoration: 'none' }}>Contact us</a> or message us on{' '}
              <a href="https://wa.me/972559943649" style={{ color: '#a67c5a', textDecoration: 'none' }}>WhatsApp</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
