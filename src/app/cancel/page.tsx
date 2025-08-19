'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'

export default function CancelPage() {
  const router = useRouter()
  const sp = useSearchParams()

  const code = useMemo(() => sp.get('code') || '', [sp])

  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // שליחת הבקשה ל-webhook
      const response = await fetch('YOUR_N8N_WEBHOOK_URL/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          email,
          reason,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      // אם הבקשה הצליחה, ניווט לעמוד ההצלחה
      router.push(`/cancel/success?code=${encodeURIComponent(code)}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Cancel subscription error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // אם אין code ב-URL – מציגים הודעה במקום לנווט
  if (!code) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#FAF5F0',padding:'2rem'}}>
        <div style={{background:'#fff',border:'1px solid #eee',borderRadius:16,padding:'1.5rem',maxWidth:460,width:'100%',textAlign:'center'}}>
          <h1 style={{marginTop:0,color:'#8B5E3C'}}>Cancel subscription</h1>
          <p style={{color:'#374151'}}>Missing <code>code</code> in the URL. Try the link you got from Yaya.</p>
          <a href="/" style={{display:'inline-block',marginTop:12,background:'#2d5016',color:'#fff',padding:'10px 16px',borderRadius:10,textDecoration:'none',fontWeight:600}}>Back to Home</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAF5F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'white',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          padding: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <img src="/yaya-logo.png" alt="Yaya" width={32} height={32} style={{ borderRadius: 6 }} />
          <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#991B1B' }}>Cancel subscription</h1>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: 8,
            color: '#DC2626',
            marginBottom: 16,
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Registration code</label>
          <input
            type="text"
            value={code}
            disabled
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: '#f9fafb'
            }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 8,
              border: '1px solid #d1d5db'
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Reason (optional)</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Why are you cancelling?"
            rows={3}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 8,
              border: '1px solid #d1d5db'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px 18px',
            background: isLoading ? '#9CA3AF' : '#B91C1C',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: '1rem',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 10px rgba(185, 28, 28, 0.25)',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Cancelling...' : 'Cancel my subscription'}
        </button>
      </form>
    </div>
  )
}
