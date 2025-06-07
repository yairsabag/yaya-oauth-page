'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface RegistrationContextType {
  registrationCode: string
  setRegistrationCode: (code: string) => void
  userInfo: any
  setUserInfo: (info: any) => void
  navigateWithCode: (path: string) => void
  buildUrlWithCode: (path: string) => string
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [registrationCode, setRegistrationCode] = useState('')
  const [userInfo, setUserInfo] = useState(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // קבלת הקוד מה-URL בכל טעינת דף
    const codeFromUrl = searchParams.get('code')
    
    if (codeFromUrl && codeFromUrl !== registrationCode) {
      console.log('Registration code found in URL:', codeFromUrl)
      setRegistrationCode(codeFromUrl)
      
      // שמירה ב-localStorage לגיבוי
      if (typeof window !== 'undefined') {
        localStorage.setItem('registrationCode', codeFromUrl)
      }
    } else if (!codeFromUrl && !registrationCode) {
      // אם אין בURL, נסה לקחת מlocalStorage
      if (typeof window !== 'undefined') {
        const savedCode = localStorage.getItem('registrationCode')
        if (savedCode) {
          console.log('Registration code restored from localStorage:', savedCode)
          setRegistrationCode(savedCode)
        }
      }
    }
  }, [searchParams, registrationCode])

  // פונקציה לניווט עם שמירת הקוד
  const navigateWithCode = (path: string) => {
    if (registrationCode) {
      const separator = path.includes('?') ? '&' : '?'
      router.push(`${path}${separator}code=${registrationCode}`)
    } else {
      router.push(path)
    }
  }

  // פונקציה לבניית URL עם הקוד
  const buildUrlWithCode = (path: string) => {
    if (registrationCode) {
      const separator = path.includes('?') ? '&' : '?'
      return `${path}${separator}code=${registrationCode}`
    }
    return path
  }

  const value = {
    registrationCode,
    setRegistrationCode,
    userInfo,
    setUserInfo,
    navigateWithCode,
    buildUrlWithCode,
  }

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  )
}

export function useRegistration() {
  const context = useContext(RegistrationContext)
  if (!context) {
    throw new Error('useRegistration must be used within RegistrationProvider')
  }
  return context
}
