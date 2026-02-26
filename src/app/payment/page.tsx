'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/payment/checkout')
  }, [router])
  return null
}
EOF
