'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'

export default function CancelSuccessPage() {
  const sp = useSearchParams()
  const router = useRouter()

  const code = useMemo(() => sp.get('code') || '', [sp])

  // redirect אחרי 5 שניות
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAF5F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: 'white',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, justifyContent: 'center' }}>
          <img src="/yaya-logo.png" alt="Yaya" width={32} height={32} style={{ borderRadius: 6 }} />
          <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#166534' }}>Subscription cancelled</h1>
        </div>

        <p style={{ margin: '0 0 20px', color: '#374151', lineHeight: 1.5 }}>
          Your subscription has been successfully cancelled.  
          {code && (
            <> (Code: <strong>{code}</strong>)</>
          )}
        </p>

        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            padding: '12px 18px',
            background: '#166534',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(22, 101, 52, 0.25)',
            marginBottom: 10
          }}
        >
          Back to Home
        </button>

        <p style={{ marginTop: 14, fontSize: '.9rem', color: '#6b7280' }}>
          Redirecting you automatically in 5 seconds...
        </p>
      </div>
    </div>
  )
}
