'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, MessageCircle, Calendar, Bell, Shield, CreditCard, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const [registrationCode, setRegistrationCode] = useState<string | null>(null)
  const [step, setStep] = useState<'plan' | 'payment' | 'oauth'>('plan')
  const [selectedPlan, setSelectedPlan] = useState('executive')
  const [billingType, setBillingType] = useState('monthly')
  const [isLoading, setIsLoading] = useState(false)

  const plans = {
    executive: {
      name: 'Executive Plan',
      monthlyPrice: 5,
      yearlyPrice: 4,
      popular: true,
      features: [
        'Unlimited messages',
        'Unlimited one-time reminders',
        '100+ languages supported',
        'ChatGPT',
        'Repeat reminders',
        'Google / Outlook Calendar',
        '100 Voice Notes / Month',
        '20 Image Analysis / Month',
        '20 Internet Searches',
        'Send/Receive reminders with friends',
        'AI Memory of You',
        'Create Lists'
      ]
    },
    ultimate: {
      name: 'Ultimate Plan',
      monthlyPrice: 14,
      yearlyPrice: 13,
      popular: false,
      features: [
        'Unlimited messages',
        'Unlimited one-time reminders',
        '100+ languages supported',
        'ChatGPT',
        'Repeat reminders',
        'Google / Outlook Calendar',
        '500 Voice Notes / Month',
        '100 Image Analysis / Month',
        '100 Internet Searches',
        'Send/Receive reminders with friends',
        'AI Memory of You',
        'Create Lists'
      ]
    }
  }

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      setRegistrationCode(code)
    } else {
      window.location.href = '/'
    }
  }, [searchParams])

  const handlePlanSelection = () => {
    setStep('payment')
  }

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      const checkoutUrl = new URL(window.location.origin + '/payment/checkout')
      checkoutUrl.searchParams.set('plan', selectedPlan)
      checkoutUrl.searchParams.set('price', billingType === 'yearly' 
        ? plans[selectedPlan as keyof typeof plans].yearlyPrice.toString()
        : plans[selectedPlan as keyof typeof plans].monthlyPrice.toString()
      )
      checkoutUrl.searchParams.set('billing', billingType)
      checkoutUrl.searchParams.set('code', registrationCode || '')
      checkoutUrl.searchParams.set('planName', plans[selectedPlan as keyof typeof plans].name)
      
      window.location.href = checkoutUrl.toString()
      
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      alert('שגיאה במעבר לדף התשלום')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleOAuth = () => {
    const clientId = '314964896562-o93h71h2cpiqgcikaqeg2a34ht2ipl2j.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('https://n8n-td2y.sliplane.app/webhook/google-oauth-callback');
    
    const scopes = encodeURIComponent([
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/calendar'
    ].join(' '));
    
    const state = encodeURIComponent(registrationCode || '');
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scopes}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${state}`;
      
    window.location.href = googleAuthUrl;
  };

  if (!registrationCode) {
    return (
      <div className="font-system min-h-screen bg-gradient-to-br from-[#faf5f0] to-[#f7f3ed] flex items-center justify-center p-4">
        <div className="bg-yaya-bg rounded-[20px] p-6 sm:p-8 lg:p-12 text-center max-w-[500px] w-full border border-[#E5DDD5]">
          <h1 className="text-2xl sm:text-3xl font-semibold text-yaya-brown mb-4">
            Access Denied
          </h1>
          <p className="text-yaya-brown mb-6 text-base sm:text-lg opacity-80">
            You need to receive a registration link from our WhatsApp bot to access this page.
          </p>
          <a 
            href="/" 
            className="inline-block bg-yaya-brown text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-opacity-90"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="font-system min-h-screen bg-gradient-to-br from-[#faf5f0] to-[#f7f3ed]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-[10px] border-b border-black/5 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center gap-2 sm:gap-3">
              <img
                src="/yaya-logo.png"
                alt="Yaya Assistant Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
              />
              <span className="text-xl sm:text-2xl font-semibold text-yaya-green">Yaya</span>
            </a>
            {step === 'payment' && (
              <div className="flex items-center gap-2 text-[#4a5568] text-sm sm:text-base">
                <Shield size={16} />
                <span className="hidden sm:inline">Secure Registration</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8 sm:mb-12 text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${step === 'plan' ? 'bg-yaya-brown' : 'bg-[#c3d9c6]'} text-white flex items-center justify-center font-semibold text-sm sm:text-base`}>
                1
              </div>
              <div className={`w-12 sm:w-20 lg:w-24 h-1 ${step !== 'plan' ? 'bg-yaya-brown' : 'bg-[#c3d9c6]'} rounded-full`}></div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${step === 'payment' || step === 'oauth' ? 'bg-yaya-brown' : 'bg-[#c3d9c6]'} text-white flex items-center justify-center font-semibold text-sm sm:text-base`}>
                2
              </div>
              <div className={`w-12 sm:w-20 lg:w-24 h-1 ${step === 'oauth' ? 'bg-yaya-brown' : 'bg-[#c3d9c6]'} rounded-full`}></div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${step === 'oauth' ? 'bg-yaya-brown' : 'bg-[#c3d9c6]'} text-white flex items-center justify-center font-semibold text-sm sm:text-base`}>
                3
              </div>
            </div>
            <div className="flex justify-center gap-4 sm:gap-8 lg:gap-24 text-xs sm:text-sm text-yaya-brown font-medium">
              <span>Choose Plan</span>
              <span>Payment</span>
              <span>Connect</span>
            </div>
          </div>

          {/* Step 1: Plan Selection */}
          {step === 'plan' && (
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-yaya-brown mb-3 sm:mb-4 tracking-tight">
                  Choose Your Plan
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#718096] mb-6 sm:mb-8">
                  Select the perfect plan for your needs. Start your 7-day free trial today.
                </p>
                
                <div className="inline-block bg-green-50 rounded-xl px-4 py-3 border border-green-200">
                  <p className="text-whatsapp text-sm sm:text-base font-semibold">
                    ✅ Registration Code: {registrationCode}
                  </p>
                </div>
              </div>

              {/* Billing Toggle */}
              <div className="flex gap-1 justify-center mb-8 sm:mb-12 bg-[#f7fafc] rounded-lg p-1 w-fit mx-auto">
                <button
                  onClick={() => setBillingType('monthly')}
                  className={`${
                    billingType === 'monthly'
                      ? 'bg-white text-yaya-brown shadow-sm'
                      : 'bg-transparent text-gray-400'
                  } px-3 sm:px-5 py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-all duration-200`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingType('yearly')}
                  className={`${
                    billingType === 'yearly'
                      ? 'bg-white text-yaya-brown shadow-sm'
                      : 'bg-transparent text-gray-400'
                  } px-3 sm:px-5 py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-all duration-200`}
                >
                  Yearly Billing
                </button>
              </div>

              {/* Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                {Object.entries(plans).map(([planId, plan]) => (
                  <div
                    key={planId}
                    onClick={() => setSelectedPlan(planId)}
                    className={`
                      relative cursor-pointer transition-all duration-300
                      bg-yaya-bg rounded-[20px] p-6 sm:p-8 lg:p-10
                      ${plan.popular ? 'border-2 border-yaya-brown scale-[1.02]' : 
                        selectedPlan === planId ? 'border-2 border-yaya-brown' : 'border border-[#E5DDD5]'}
                      ${selectedPlan === planId ? 'bg-opacity-50' : ''}
                      hover:scale-[1.02] hover:shadow-lg hover:border-yaya-brown
                    `}
                  >
                    {plan.popular && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-yaya-brown text-white px-2 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs font-medium">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="text-xs sm:text-sm text-yaya-brown font-medium mb-2 uppercase tracking-wider">
                      {plan.name.toUpperCase()}
                    </div>

                    <div className="text-4xl sm:text-5xl lg:text-6xl font-light text-yaya-brown mb-1 sm:mb-2 leading-none flex items-baseline gap-2">
                      ${billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                      <span className="text-sm sm:text-base font-normal">/month</span>
                    </div>

                    {billingType === 'yearly' && (
                      <div className="text-xs sm:text-sm text-whatsapp font-semibold mb-4 sm:mb-6">
                        💰 Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                      </div>
                    )}
                    
                    <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="text-yaya-brown text-xs sm:text-sm lg:text-base flex items-start gap-2">
                          <span className="text-whatsapp font-semibold">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {selectedPlan === planId && (
                      <div className="bg-yaya-brown text-white px-4 py-2 rounded-md text-center text-sm font-medium">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={handlePlanSelection}
                  className="px-8 sm:px-12 py-3 sm:py-4 bg-yaya-brown text-white rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 hover:bg-opacity-90 shadow-lg"
                >
                  Continue with {plans[selectedPlan as keyof typeof plans].name}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <div className="max-w-xl mx-auto">
              <button
                onClick={() => setStep('plan')}
                className="flex items-center gap-2 text-yaya-brown text-sm mb-6 hover:opacity-70 transition-opacity"
              >
                <ArrowLeft size={16} />
                Back to Plan Selection
              </button>

              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-yaya-brown mb-3 tracking-tight">
                  Secure Payment
                </h1>
              </div>

              <div className="bg-yaya-bg rounded-[20px] p-6 sm:p-8 border border-[#E5DDD5] mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-yaya-brown mb-4 sm:mb-6">
                  Order Summary
                </h3>
                
                <div className="space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base text-yaya-brown">
                    <span className="font-medium">Plan:</span>
                    <span>{plans[selectedPlan as keyof typeof plans].name}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-yaya-brown">
                    <span className="font-medium">Billing:</span>
                    <span>{billingType === 'yearly' ? 'Annual' : 'Monthly'}</span>
                  </div>
                </div>

                <div className="border-t border-[#E5DDD5] pt-4 mb-4">
                  <div className="flex justify-between mb-2 text-sm sm:text-base text-yaya-brown">
                    <span>7-day free trial</span>
                    <span className="text-whatsapp font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-yaya-brown">
                    <span>Then ${billingType === 'yearly' ? plans[selectedPlan as keyof typeof plans].yearlyPrice : plans[selectedPlan as keyof typeof plans].monthlyPrice}/{billingType === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                </div>

                <div className="border-t border-[#E5DDD5] pt-4">
                  <div className="flex justify-between font-semibold text-base sm:text-lg text-yaya-brown">
                    <span>Total today</span>
                    <span className="text-whatsapp">$0.00</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isLoading}
                className={`w-full py-3 sm:py-4 ${isLoading ? 'bg-gray-400' : 'bg-yaya-brown'} text-white rounded-lg text-base sm:text-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${!isLoading && 'hover:bg-opacity-90'}`}
              >
                <CreditCard size={20} />
                {isLoading ? 'Processing...' : 'Start Free Trial'}
              </button>

              <p className="text-xs sm:text-sm text-yaya-brown text-center mt-4 opacity-80">
                By continuing, you agree to our Terms of Service and Privacy Policy.
                Your trial starts today and you can cancel anytime before it ends.
              </p>
            </div>
          )}

          {/* Step 3: OAuth */}
          {step === 'oauth' && (
            <div className="max-w-xl mx-auto text-center">
              <div className="mb-6">
                <CheckCircle size={60} className="text-whatsapp mx-auto sm:w-20 sm:h-20" />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-yaya-brown mb-3 tracking-tight">
                🎉 Payment Successful!
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-[#718096] mb-8">
                Now connect your Google account to enable smart calendar features and complete your setup.
              </p>

              <div className="bg-yaya-bg rounded-[20px] p-6 sm:p-8 border border-[#E5DDD5] mb-6 text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-yaya-brown mb-4">
                  Why Connect Google?
                </h3>
                <div className="space-y-2 text-sm sm:text-base text-yaya-brown">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Sync with your Google Calendar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell size={16} />
                    <span>Smart reminders and scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    <span>Seamless WhatsApp integration</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoogleOAuth}
                className="w-full py-3 sm:py-4 bg-[#4285f4] text-white rounded-lg text-base sm:text-lg font-semibold flex items-center justify-center gap-2 mb-4 transition-all duration-200 hover:bg-opacity-90"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Connect Google Account
              </button>

              <p className="text-xs sm:text-sm text-[#718096] text-center">
                Your data is encrypted and only used to help you manage your day via WhatsApp.
              </p>

              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-whatsapp text-xs sm:text-sm">
                  💡 <strong>Next:</strong> After connecting Google, you'll receive a confirmation code to send to our WhatsApp bot at +972 55-994-3649
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
