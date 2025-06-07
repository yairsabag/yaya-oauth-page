'use client'
import { useRegistration } from '../../../contexts/RegistrationContext'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OAuthCallback() {
  const { registrationCode, setUserInfo, navigateWithCode } = useRegistration()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState('מעבד...')

  useEffect(() => {
    const handleOAuthReturn = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state') // זה הregistration code שלנו
      const error = searchParams.get('error')
      
      if (error) {
        setStatus('שגיאה באימות Google')
        console.error('OAuth error:', error)
        return
      }
      
      if (code && state) {
        try {
          setStatus('מקבל נתונים מGoogle...')
          
          const response = await fetch('/api/oauth/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              oauthCode: code,
              registrationCode: state, // זה הקוד שלנו
            }),
          })
          
          const result = await response.json()
          
          if (result.success) {
            setStatus('הצלחה! מחבר לחשבון...')
            setUserInfo(result.userInfo)
            
            // חזרה לדף התשלום עם הצלחה
            setTimeout(() => {
              navigateWithCode('/payment?oauth=success')
            }, 2000)
          } else {
            setStatus('שגיאה בעיבוד הנתונים')
          }
        } catch (error) {
          setStatus('שגיאה בחיבור לשרת')
          console.error('OAuth processing error:', error)
        }
      }
    }
    
    if (searchParams.get('code')) {
      handleOAuthReturn()
    }
  }, [searchParams, setUserInfo, navigateWithCode])

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)'
    }}>
      <div style={{ textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #2d5016',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <h1 style={{ color: '#2d5016', marginBottom: '0.5rem' }}>{status}</h1>
        {registrationCode && (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            קוד רישום: {registrationCode}
          </p>
        )}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}
