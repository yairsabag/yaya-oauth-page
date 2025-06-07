'use client'
import React from 'react'

export default function PaymentSuccess() {
  return (
    <div style={{ 
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ 
          fontSize: '2rem', 
          color: '#2d5016', 
          marginBottom: '1rem',
          fontWeight: '600'
        }}>
          Payment Successful!
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem', 
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Welcome to Yaya Assistant! Your account has been activated successfully.
        </p>
        
        <div style={{
          background: '#e8f5e8',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #2d5016'
        }}>
          <p style={{ color: '#2d5016', margin: 0, fontWeight: '500' }}>
            🎯 Next Steps:
          </p>
          <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
            You can now use all premium features via WhatsApp!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a 
            href="https://wa.me/972559943649" 
            style={{
              background: '#25d366',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            💬 Chat with Yaya
          </a>
          <a 
            href="/" 
            style={{
              background: '#2d5016',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            🏠 Home
          </a>
        </div>
      </div>
    </div>
  )
}
