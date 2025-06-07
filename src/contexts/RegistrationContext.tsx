// עדכון RegistrationContext.tsx עם debug logs
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
    console.log('🔍 RegistrationContext useEffect triggered')
    console.log('🔍 Current URL params:', Object.fromEntries(searchParams.entries()))
    console.log('🔍 Current registrationCode state:', registrationCode)
    
    // קבלת הקוד מה-URL בכל טעינת דף
    const codeFromUrl = searchParams.get('code')
    console.log('🔍 Code from URL:', codeFromUrl)
    
    if (codeFromUrl && codeFromUrl !== registrationCode) {
      console.log('✅ Setting new registration code from URL:', codeFromUrl)
      setRegistrationCode(codeFromUrl)
      
      // שמירה ב-localStorage לגיבוי
      if (typeof window !== 'undefined') {
        localStorage.setItem('registrationCode', codeFromUrl)
        console.log('💾 Saved to localStorage:', codeFromUrl)
      }
    } else if (!codeFromUrl && !registrationCode) {
      // אם אין בURL, נסה לקחת מlocalStorage
      if (typeof window !== 'undefined') {
        const savedCode = localStorage.getItem('registrationCode')
        console.log('💾 Checking localStorage:', savedCode)
        if (savedCode) {
          console.log('✅ Restored registration code from localStorage:', savedCode)
          setRegistrationCode(savedCode)
        }
      }
    }
  }, [searchParams, registrationCode])

  // פונקציה לניווט עם שמירת הקוד
  const navigateWithCode = (path: string) => {
    console.log('🚀 navigateWithCode called with:', path)
    console.log('🚀 Current registrationCode:', registrationCode)
    
    if (registrationCode) {
      const separator = path.includes('?') ? '&' : '?'
      const newUrl = `${path}${separator}code=${registrationCode}`
      console.log('🚀 Navigating to:', newUrl)
      router.push(newUrl)
    } else {
      console.log('⚠️ No registration code, navigating without code')
      router.push(path)
    }
  }

  // פונקציה לבניית URL עם הקוד
  const buildUrlWithCode = (path: string) => {
    console.log('🔗 buildUrlWithCode called with:', path)
    console.log('🔗 Current registrationCode:', registrationCode)
    
    if (registrationCode) {
      const separator = path.includes('?') ? '&' : '?'
      const result = `${path}${separator}code=${registrationCode}`
      console.log('🔗 Built URL:', result)
      return result
    }
    console.log('🔗 No code, returning original path:', path)
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

  console.log('🎯 RegistrationContext value:', { registrationCode, userInfo: !!userInfo })

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
