'use client'
import { useRegistration } from '../../../contexts/RegistrationContext'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react'

export default function OAuthCallback() {
  const { registrationCode, setRegistrationCode, getUrlWithCode } = useRegistration()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState('מעבד...')
  const [statusType, setStatusType] = useState<'loading' | 'success' | 'error'>('loading')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleOAuthReturn = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state') // זה הregistration code שלנו
      const error = searchParams.get('error')
      
      if (error) {
        setStatus('שגיאה באימות Google')
        setStatusType('error')
        console.error('OAuth error:', error)
        return
      }
      
      if (code && state) {
        try {
          setProgress(25)
          setStatus('מתחבר ל-Google...')
          await new Promise(resolve => setTimeout(resolve, 800))
          
          setProgress(50)
          setStatus('מקבל הרשאות...')
          
          // עדכון הקוד אם הוא לא קיים
          if (!registrationCode && state) {
            setRegistrationCode(state)
          }
          
          await new Promise(resolve => setTimeout(resolve, 600))
          setProgress(75)
          setStatus('מעבד נתונים...')
          
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
            setProgress(100)
            setStatus('הצלחה! החשבון חובר בהצלחה')
            setStatusType('success')
            
            // חזרה לדף התשלום עם הצלחה
            setTimeout(() => {
              const successUrl = getUrlWithCode('/payment', { oauth: 'success' })
              router.push(successUrl)
            }, 2000)
          } else {
            setStatus('שגיאה בעיבוד הנתונים')
            setStatusType('error')
          }
        } catch (error) {
          setStatus('שגיאה בחיבור לשרת')
          setStatusType('error')
          console.error('OAuth processing error:', error)
        }
      }
    }
    
    if (searchParams.get('code')) {
      handleOAuthReturn()
    }
  }, [searchParams, registrationCode, setRegistrationCode, getUrlWithCode, router])

  const getStatusIcon = () => {
    switch (statusType) {
      case 'loading':
        return <Clock size={48} style={{ color: '#2d5016' }} />
      case 'success':
        return <CheckCircle size={48} style={{ color: '#25d366' }} />
      case 'error':
        return <AlertCircle size={48} style={{ color: '#ef4444' }} />
      default:
        return <Clock size={48} style={{ color: '#2d5016' }} />
    }
  }

  const getStatusColor = () => {
    switch (statusType) {
      case 'loading':
        return '#2d5016'
      case 'success':
        return '#25d366'
      case 'error':
        return '#ef4444'
      default:
        return '#2d5016'
    }
  }

  return (
    <div style={{ 
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '1rem 0',
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016' }}>Yaya</span>
          </div>
        </div>
      </div>

      <div style={{ 
        textAlign: 'center', 
        background: 'rgba(255,255,255,0.95)', 
        padding: '4rem 3rem', 
        borderRadius: '24px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Status Icon */}
        <div style={{
          background: statusType === 'loading' ? 'rgba(45, 80, 22, 0.1)' : 
                     statusType === 'success' ? 'rgba(37, 211, 102, 0.1)' : 
                     'rgba(239, 68, 68, 0.1)',
          borderRadius: '50%',
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          border: `3px solid ${statusType === 'loading' ? 'rgba(45, 80, 22, 0.2)' : 
                                statusType === 'success' ? 'rgba(37, 211, 102, 0.2)' : 
                                'rgba(239, 68, 68, 0.2)'}`,
          animation: statusType === 'loading' ? 'pulse 2s infinite' : 
                    statusType === 'success' ? 'bounce 0.6s ease-in-out' : 'none'
        }}>
          {statusType === 'loading' ? (
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #2d5016',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          ) : (
            getStatusIcon()
          )}
        </div>

        {/* Progress Bar */}
        {statusType === 'loading' && (
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(45, 80, 22, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #2d5016, #25d366)',
              borderRadius: '4px',
              width: `${progress}%`,
              transition: 'width 0.8s ease-in-out',
              animation: 'shimmer 2s infinite'
            }} />
          </div>
        )}

        {/* Status Text */}
        <h1 style={{ 
          color: getStatusColor(), 
          marginBottom: '1.5rem',
          fontSize: '2rem',
          fontWeight: '600',
          letterSpacing: '-0.02em'
        }}>
          {status}
        </h1>

        {/* Registration Code */}
        {(registrationCode || searchParams.get('state')) && (
          <div style={{
            background: 'rgba(45, 80, 22, 0.05)',
            border: '2px solid rgba(45, 80, 22, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <p style={{ 
              color: '#2d5016', 
              fontSize: '1rem',
              fontWeight: '600',
              margin: '0 0 0.5rem 0'
            }}>
              קוד הרישום שלך:
            </p>
            <div style={{
              background: 'white',
              border: '2px solid #25d366',
              borderRadius: '8px',
              padding: '1rem',
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#25d366',
              fontFamily: 'monospace',
              letterSpacing: '0.1em'
            }}>
              {registrationCode || searchParams.get('state')}
            </div>
          </div>
        )}

        {/* Loading Steps */}
        {statusType === 'loading' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '2rem'
          }}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: progress >= step * 25 ? '#25d366' : 'rgba(45, 80, 22, 0.2)',
                  animation: progress >= step * 25 ? 'bounce 0.6s ease-in-out' : 'none',
                  animationDelay: `${step * 0.1}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Success Message */}
        {statusType === 'success' && (
          <div style={{
            background: 'rgba(37, 211, 102, 0.1)',
            border: '2px solid rgba(37, 211, 102, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginTop: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Zap size={20} style={{ color: '#25d366' }} />
              <span style={{ color: '#25d366', fontWeight: '600', fontSize: '1.1rem' }}>
                מועבר לדף התשלום...
              </span>
            </div>
            <p style={{ 
              color: '#2d5016', 
              fontSize: '0.9rem',
              margin: 0,
              opacity: 0.8
            }}>
              Google Calendar מחובר בהצלחה!
            </p>
          </div>
        )}

        {/* Error Message */}
        {statusType === 'error' && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginTop: '1rem'
          }}>
            <p style={{ 
              color: '#ef4444', 
              fontSize: '1rem',
              margin: '0 0 1rem 0',
              fontWeight: '600'
            }}>
              משהו השתבש...
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#dc2626'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#ef4444'}
            >
              נסה שוב
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
      `}</style>
    </div>
  )
}
