'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'

interface RegistrationContextType {
  registrationCode: string | null
  setRegistrationCode: (code: string) => void
  getUrlWithCode: (path: string, additionalParams?: Record<string, string>) => string
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [registrationCode, setRegistrationCodeState] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const codeFromUrl = searchParams.get('code')
    if (codeFromUrl && codeFromUrl !== registrationCode) {
      setRegistrationCodeState(codeFromUrl)
    }
  }, [searchParams, registrationCode])

  const setRegistrationCode = (code: string) => {
    setRegistrationCodeState(code)
  }

  const getUrlWithCode = (path: string, additionalParams: Record<string, string> = {}) => {
    const url = new URL(path, window.location.origin)
    
    if (registrationCode) {
      url.searchParams.set('code', registrationCode)
    }
    
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    
    return url.toString()
  }

  return (
    <RegistrationContext.Provider value={{
      registrationCode,
      setRegistrationCode,
      getUrlWithCode
    }}>
      {children}
    </RegistrationContext.Provider>
  )
}

export function useRegistration() {
  const context = useContext(RegistrationContext)
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider')
  }
  return context
}
