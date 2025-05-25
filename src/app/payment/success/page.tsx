'use client'

import React, { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, MessageCircle, Calendar, Bell } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const email = searchParams.get('email')

  const planNames = {
    executive: 'Executive Plan',
    ultimate: 'Ultimate Plan'
  }

  useEffect(() => {
    // Add confetti or celebration animation here if desired
  }, [])

  return (
    <div style={{ fontFamily: "Lato, system-ui, -apple-system, sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #faf0e6 0%, #f5e6d3 100%)' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px',
