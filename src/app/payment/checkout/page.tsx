'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Lock } from 'lucide-react'

export default function CheckoutPage() {
  const [urlParams, setUrlParams] = useState({
    plan: '',
    price: '',
    billing: '',
    code: '',
    planName: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    setTimeout(() => setIsLoading(false), 500)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Get URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setUrlParams({
      plan: params.get('plan') || 'executive',
      price: params.get('price') || '5',
      billing: params.get('billing') || 'monthly',
      code: params.get('code') || 'F75CEJ',
      planName: params.get('planName') || 'Executive Plan'
    })
  }, [])

  const planDetails = {
    executive: {
      name: 'Executive Plan',
      features: [
        'Google Calendar integration',
        'Expense tracking',
        'Contact management',
        'Recurring reminders'
      ]
    },
    ultimate: {
      name: 'Ultimate Plan',
      features: [
        'All Executive features',
        'Food & calorie tracking',
        'Advanced analytics',
        'Priority support'
      ]
    }
  }

  const currentPlan =
    planDetails[urlParams.plan as keyof typeof planDetails] || planDetails.executive

  /**
   * Build Tranzila IFRAME URL:
   * - sum=0  (אין חיוב עכשיו)
   * - tranmode=VK  (Verification + Token)
   * - currency=2 (USD)
   * - recur_transaction=4_approved (חודשי, ללא בחירה של הלקוח)
   * - recur_sum=<price>  (החיוב החודשי)
   * - recur_start_date=YYYY-MM-DD (בעוד 7 ימים)
   * - success/fail מפנים דרך ה־bridge ל־/payment/success או /payment/failed
   */
  const buildIframeUrl = () => {
    const baseUrl = 'https://direct.tranzila.com/fxpyairsabag/iframenew.php'

    // start recurring in 7 days
    const start = new Date()
    start.setDate(start.getDate() + 7)
    const recurStart =
      start.getFullYear() +
      '-' +
      String(start.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(start.getDate()).padStart(2, '0')

    const origin = window.location.origin

    const params = new URLSearchParams({
      // --- חובה למצב ניסיון/טוקן ---
      sum: '0',
      tranmode: 'VK',         // Verification + Token (לא A!)
      currency: '2',          // USD

      // --- Recurring: חיוב חודשי החל מעוד 7 ימים ---
      recur_sum: urlParams.price,         // הסכום החודשי
      recur_transaction: '4_approved',    // 4=Monthly (Not Customer Choice)
      recur_start_date: recurStart,       // YYYY-MM-DD
      // אם רוצים מספר חיובים מוגבל, אפשר להוסיף:
      // recur_payments: '12',

      // --- UI/מיתוג ---
      nologo: '1',
      trBgColor: 'FAF5F0',
      trTextColor: '2D5016',
      trButtonColor: '8B5E3C',
      buttonLabel: 'Start Free Trial',

      // --- שדות משלך (יחזרו אליך ב-bridge / notify) ---
      u1: urlParams.code,
      u2: urlParams.plan,
      u3: urlParams.billing,
      u4: urlParams.price,
      pdesc: `Yaya ${urlParams.plan} - 7 Day Trial (USD)`,

      // --- כתובות החזרה (מוגדר גם במסוף; כאן אנחנו עוקפים) ---
      success_url_address: `${origin}/api/tranzila/success-bridge`,
      fail_url_address: `${origin}/api/tranzila/fail-bridge`,

      // --- כתובת Notify לשרת (יקבל POST מהעסקה בפועל) ---
      notify_url_address: 'https://n8n-TD2y.sliplane.app/webhook/update-user-plan'
    })

    return `${baseUrl}?${params.toString()}`
  }

  return (
    <div style={{
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5f0 0%, #f7f3ed 100%)'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '0 1rem' : '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img src="/yaya-logo.png" alt="Yaya" style={{ width: isMobile ? 60 : 80, height: isMobile ? 60 : 80, objectFit: 'contain' }} />
            <span style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 600, color: '#2d5016' }}>Yaya</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: '#4a5568' }}>
            <Shield size={16} />
            {!isMobile && <span style={{ fontSize: '.9rem' }}>Secure Checkout</span>}
          </div>
        </div>
      </header>

      <main style={{ padding: isMobile ? '1.5rem 0' : '3rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem' }}>
          {/* … השאר ללא שינוי (תקציר, תכונות, סיכום וכו') … */}

          {/* תיבת התשלום */}
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: 0,
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)',
            minHeight: isMobile ? 600 : 650
          }}>
            {isLoading ? (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 600, flexDirection: 'column', gap: '1rem'
              }}>
                <div style={{
                  width: 50, height: 50,
                  border: '4px solid #E5DDD5', borderTopColor: '#8B5E3C',
                  borderRadius: '50%', animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: '#8B5E3C', fontSize: '.9rem' }}>Loading secure payment form...</p>
              </div>
            ) : (
              <iframe
                src={buildIframeUrl()}
                style={{ width: '100%', height: isMobile ? 650 : 700, border: 'none', display: 'block' }}
                title="Secure Payment Form"
                allow="payment"
                sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
              />
            )}
          </div>

          {/* חותמות */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '.85rem', color: '#718096', marginBottom: '1rem' }}>
              Your payment information is encrypted and secure. We never store your credit card details.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <img src="https://www.tranzila.com/images/logo-tranzila.png" alt="Tranzila" style={{ height: 30, opacity: .7 }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" style={{ height: 20, opacity: .7 }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: 30, opacity: .7 }} />
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
