// /components/payment-button.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentButtonProps {
  plan: 'executive' | 'ultimate';
  billing: 'monthly' | 'yearly';
  registrationCode: string;
  email?: string;
  fullName?: string;
}

export default function PaymentButton({ 
  plan, 
  billing, 
  registrationCode,
  email,
  fullName
}: PaymentButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const prices = {
    executive: { monthly: 5, yearly: 48 },
    ultimate: { monthly: 14, yearly: 156 }
  };
  
  const price = prices[plan][billing];
  const displayPrice = billing === 'yearly' 
    ? `$${price} לשנה ($${price/12} לחודש)` 
    : `$${price} לחודש`;
  
  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan, 
          billing, 
          registrationCode,
          email,
          fullName
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // שמור נתונים ב-localStorage לפני המעבר
        localStorage.setItem('pendingPayment', JSON.stringify({
          plan,
          billing,
          price,
          registrationCode,
          paymentRequestId: data.paymentRequestId
        }));
        
        // הפנה לדף התשלום של Tranzila
        window.location.href = data.paymentUrl;
      } else {
        setError(data.error || 'שגיאה ביצירת התשלום');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('שגיאה בתהליך התשלום. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-white 
          transition-all duration-200 transform
          ${loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            מעבד...
          </span>
        ) : (
          <div>
            <div className="text-lg">התחל 7 ימי ניסיון בחינם</div>
            <div className="text-sm opacity-90 mt-1">
              לאחר מכן {displayPrice}
            </div>
          </div>
        )}
      </button>
      
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          תשלום מאובטח
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.828V13a1 1 0 102 0V9.828l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
          ביטול בכל עת
        </div>
      </div>
      
      <p className="text-center text-xs text-gray-500">
        תומך ב-Apple Pay וכל כרטיסי האשראי
      </p>
    </div>
  );
}
