'use client'
import React, { useState, useEffect } from 'react'
import { MessageCircle, Check } from 'lucide-react'
import { useRegistration } from '../contexts/RegistrationContext'

// שאר הקוד נשאר זהה עד לפונקציה handlePlanAction...

export default function Home() {
  const { navigateWithCode, buildUrlWithCode, registrationCode } = useRegistration()
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [billingType, setBillingType] = useState('monthly')

  // ... כל השאר נשאר זהה עד ל-handlePlanAction

  // עדכון הפונקציה הזו:
  const handlePlanAction = (planId: string) => {
    if (planId === 'basic') {
      window.open('https://api.whatsapp.com/send/?phone=972559943649&text&type=phone_number&app_absent=0', '_blank')
    } else {
      // שימוש בפונקציה החדשה שמעבירה את הקוד
      navigateWithCode(`/payment?plan=${planId}&billing=${billingType}`)
    }
  }

  // בכל הלינקים באתר, החלף את href= ב-buildUrlWithCode:
  // לדוגמה:
  // <a href="/payment"> הופך ל-:
  // <a href={buildUrlWithCode('/payment')}>

  // שאר הקוד נשאר זהה...
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* כל הקוד הקיים נשאר זהה */}
      {/* רק החלף את כל ה-href="/payment" ל-buildUrlWithCode('/payment') */}
    </div>
  )
}

// ========================================
// 4. עדכון דף התשלום
// עדכן את src/app/payment/page.tsx
// ========================================

'use client'
import React, { useState, useEffect } from 'react'
import { Check, MessageCircle } from 'lucide-react'
import { useRegistration } from '../../contexts/RegistrationContext'
import { useSearchParams } from 'next/navigation'

export default function PaymentPage() {
  const { registrationCode, setRegistrationCode, navigateWithCode } = useRegistration()
  const searchParams = useSearchParams()
  const [billingType, setBillingType] = useState('monthly')
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    plan: '',
    countryCode: '+972'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showContactForm, setShowContactForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')

  useEffect(() => {
    // קבלת פרמטרים מה-URL
    const planFromUrl = searchParams.get('plan')
    const billingFromUrl = searchParams.get('billing')
    const codeFromUrl = searchParams.get('code')
    
    if (planFromUrl) {
      setSelectedPlan(planFromUrl)
      setFormData(prev => ({ ...prev, plan: planFromUrl }))
      setShowContactForm(true)
    }
    if (billingFromUrl) {
      setBillingType(billingFromUrl)
    }
    if (codeFromUrl && !registrationCode) {
      setRegistrationCode(codeFromUrl)
    }
  }, [searchParams, registrationCode, setRegistrationCode])

  // עדכון הפונקציה handleSubmit:
  const handleSubmit = async () => {
    setIsLoading(true)
    setErrors({})

    // Validate form
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.plan) newErrors.plan = 'Please select a plan'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // שימוש בקוד הקיים או יצירת חדש
      const currentCode = registrationCode || Math.random().toString(36).substring(2, 8).toUpperCase()
      
      if (!registrationCode) {
        setRegistrationCode(currentCode)
      }
      
      console.log('Sending webhook data:', {
        phone: formData.phone,
        email: formData.email,
        plan: formData.plan,
        registration_code: currentCode
      })
      
      // Send data to n8n webhook
      const response = await fetch('https://yairsabag.app.n8n.cloud/webhook-test/whatsapp-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formData.countryCode + formData.phone,
          email: formData.email,
          plan: formData.plan,
          registration_code: currentCode
        })
      })
      
      console.log('Webhook response status:', response.status)
      console.log('Webhook response:', await response.text())
      
      // Get plan details for checkout
      const plan = plans.find(p => p.id === formData.plan)
      const price = billingType === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice
      
      // שימוש בפונקציה החדשה לניווט
      navigateWithCode(`/payment/checkout?plan=${formData.plan}&price=${price}&billing=${billingType}&email=${formData.email}`)
      
    } catch (error) {
      console.error('Webhook error:', error)
      // Still proceed to checkout even if webhook fails
      const plan = plans.find(p => p.id === formData.plan)
      const price = billingType === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice
      const currentCode = registrationCode || Math.random().toString(36).substring(2, 8).toUpperCase()
      
      navigateWithCode(`/payment/checkout?plan=${formData.plan}&price=${price}&billing=${billingType}&email=${formData.email}`)
    } finally {
      setIsLoading(false)
    }
  }

  // הצגת הקוד למשתמש (אופציונלי)
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img
              src="/yaya-logo.png"
              alt="Yaya Assistant Logo"
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d5016' }}>Yaya</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* הצגת קוד הרישום (אופציונלי) */}
            {registrationCode && (
              <div style={{ 
                background: 'rgba(45, 80, 22, 0.1)', 
                color: '#2d5016', 
                padding: '4px 12px', 
                borderRadius: '12px', 
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                קוד: {registrationCode}
              </div>
            )}
            <a href="/" style={{ color: '#4a5568', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* שאר הקוד נשאר זהה... */}
    </div>
  )
}
