// FILE: src/app/payment/success/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, MessageCircle, Calendar, Bell, AlertCircle, Loader2 } from 'lucide-react'

interface UrlParams { plan: string; email: string; price: string; code: string; billing: string }
interface UpdateResponse { success: boolean; message?: string; error?: string }

export default function PaymentSuccessPage() {
  const [urlParams, setUrlParams] = useState<UrlParams>({ plan:'', email:'', price:'', code:'', billing:'' })
  const [planUpdateStatus, setPlanUpdateStatus] = useState<'loading'|'success'|'error'>('loading')
  const [updateMessage, setUpdateMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const planData = {
      plan: params.get('plan') || '',
      email: params.get('email') || '',
      price: params.get('price') || '',
      code: params.get('code') || '',
      billing: params.get('billing') || 'monthly'
    }
    setUrlParams(planData)

    const paymentToken =
      params.get('payment_token') ||
      params.get('TranzilaTK') ||
      params.get('TranzilaToken') ||
      params.get('CCtoken') || ''

    const trialStart = params.get('trial_start') || new Date().toISOString()
    const trialEnd   = params.get('trial_end')   || new Date(Date.now() + 7*24*60*60*1000).toISOString()

    if (planData.code && planData.plan) {
      updateUserPlan(planData, { paymentToken, trialStart, trialEnd })
    } else {
      setPlanUpdateStatus('error')
      setUpdateMessage('Missing registration code or plan information')
    }
  }, [])

  async function updateUserPlan(
    planData: UrlParams,
    extra: { paymentToken: string; trialStart: string; trialEnd: string },
    isRetry = false
  ) {
    try {
      const { paymentToken, trialStart, trialEnd } = extra
      const expirationDate = new Date()
      if (planData.billing === 'yearly') expirationDate.setFullYear(expirationDate.getFullYear() + 1)
      else expirationDate.setMonth(expirationDate.getMonth() + 1)

      const body = {
        registration_code: planData.code,
        plan: planData.plan.toLowerCase(),
        email: planData.email,
        expires_at: expirationDate.toISOString(),
        billing_type: planData.billing,
        status: 'active',
        price: planData.price,
        payment_date: new Date().toISOString(),
        trial_end_date: new Date(trialEnd).toISOString(),
        payment_token: paymentToken,
        trial_start: trialStart,
        trial_end: trialEnd,
        subscription_status: 'trial_active'
      }

      const res = await fetch('https://n8n-TD2y.sliplane.app/webhook/update-user-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const text = await res.text()
      let parsed: UpdateResponse
      try { parsed = JSON.parse(text) } catch { parsed = res.ok ? { success:true, message:'Plan updated successfully' } : { success:false, error:'Invalid response' } }

      if (res.ok && parsed.success !== false) {
        setPlanUpdateStatus('success')
        setUpdateMessage(parsed.message || 'Your plan has been activated successfully!')
        localStorage.setItem('userPlan', planData.plan)
        localStorage.setItem('planExpiresAt', expirationDate.toISOString())
        localStorage.setItem('userEmail', planData.email)
        localStorage.setItem('paymentToken', extra.paymentToken)
      } else {
        throw new Error(parsed.error || parsed.message || 'Failed to update plan')
      }
    } catch (err) {
      setPlanUpdateStatus('error')
      setUpdateMessage(err instanceof Error ? err.message : 'Failed to activate your plan.')
      if (!isRetry && retryCount < 3) {
        setRetryCount(c => c + 1)
        setTimeout(() => updateUserPlan(planData, extra, true), 2000)
      }
    }
  }

  // … ה־UI שלך נשאר כמו אצלך …

  return (
    <div style={{ padding: 24 }}>
      {planUpdateStatus === 'loading' ? <Loader2 className="spin" /> :
       planUpdateStatus === 'success' ? <CheckCircle color="#25d366" size={64}/> :
       <AlertCircle color="#ef4444" size={64}/>}
      <h1>{planUpdateStatus === 'success' ? '🎉 Payment Successful!' : planUpdateStatus === 'loading' ? 'Setting up your account…' : 'There was a problem'}</h1>
      <p>{updateMessage}</p>
    </div>
  )
}

export {}
