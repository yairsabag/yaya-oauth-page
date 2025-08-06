// src/app/payment/callback/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // קבל את הפרמטרים מה-URL
    const urlStatus = searchParams.get('status');
    const response = searchParams.get('Response');
    const transactionId = searchParams.get('Tempref');
    const token = searchParams.get('TranzilaTK');
    const errorMsg = searchParams.get('error_msg');
    
    // בדוק את הסטטוס
    if (urlStatus === 'success' || response === '000') {
      setStatus('success');
      setMessage('התשלום בוצע בהצלחה! המנוי שלך הופעל.');
      
      // שמור את פרטי המנוי
      if (token) {
        // TODO: שלח את הטוקן לשרת לשמירה
        fetch('/api/save-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId,
            token,
            plan: searchParams.get('custom2'),
            registrationCode: searchParams.get('custom1')
          })
        }).catch(console.error);
      }
      
      // הפנה לדף הצלחה אחרי 3 שניות
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      
    } else {
      setStatus('failed');
      
      // הודעות שגיאה מותאמות
      const errorMessages: Record<string, string> = {
        '001': 'הכרטיס נדחה. אנא נסה כרטיס אחר.',
        '004': 'העסקה נדחתה על ידי חברת האשראי.',
        '033': 'תוקף הכרטיס פג. אנא בדוק את פרטי הכרטיס.',
        '051': 'אין יתרה מספקת בכרטיס.',
        '057': 'מספר תעודת הזהות אינו תקין.',
        '20006': 'שגיאת מערכת. אנא נסה שוב.'
      };
      
      const errorCode = response || '';
      setMessage(errorMessages[errorCode] || errorMsg || 'התשלום נכשל. אנא נסה שוב.');
    }
  }, [searchParams, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">מעבד את התשלום...</h2>
            <p className="text-gray-600">אנא המתן</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">התשלום בוצע בהצלחה!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">מעביר אותך לחשבון שלך...</p>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">התשלום נכשל</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/payment/checkout"
                className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                נסה שוב
              </Link>
              <Link
                href="/contact"
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                צור קשר לתמיכה
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
