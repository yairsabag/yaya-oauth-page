// src/app/payment/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface FormData {
  // פרטי לקוח
  fullName: string;
  email: string;
  phone: string;
  
  // פרטי תוכנית
  plan: 'executive' | 'ultimate';
  billing: 'monthly' | 'yearly';
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const registrationCode = searchParams.get('code') || 'DEFAULT';
  const defaultPlan = (searchParams.get('plan') || 'executive') as 'executive' | 'ultimate';
  const defaultBilling = (searchParams.get('billing') || 'monthly') as 'monthly' | 'yearly';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    plan: defaultPlan,
    billing: defaultBilling
  });
  
  const prices = {
    executive: { monthly: 5, yearly: 48 },
    ultimate: { monthly: 14, yearly: 156 }
  };
  
  const currentPrice = prices[formData.plan][formData.billing];
  const monthlyPrice = formData.billing === 'yearly' 
    ? Math.round(currentPrice / 12) 
    : currentPrice;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // בדיקת תקינות
      if (!formData.fullName || !formData.email || !formData.phone) {
        throw new Error('נא למלא את כל השדות');
      }
      
      // בדיקת אימייל
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('כתובת אימייל לא תקינה');
      }
      
      // שליחה ל-API
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          registrationCode
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.paymentUrl) {
        // שמור נתונים לפני המעבר
        sessionStorage.setItem('checkoutData', JSON.stringify({
          ...formData,
          registrationCode,
          paymentRequestId: data.paymentRequestId,
          amount: currentPrice
        }));
        
        // הפנה לדף התשלום של Tranzila
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || 'שגיאה ביצירת התשלום');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold text-center">השלם הרשמה ל-Yaya</h1>
            <p className="text-center mt-2 opacity-90">7 ימי ניסיון בחינם • ביטול בכל עת</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* צד שמאל - פרטי לקוח */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">פרטי לקוח</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ישראל ישראלי"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    דוא"ל *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טלפון *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="050-1234567"
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>קוד הרשמה:</strong> {registrationCode}
                  </p>
                </div>
              </div>
              
              {/* צד ימין - בחירת תוכנית */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">בחר תוכנית</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תוכנית
                  </label>
                  <select
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="executive">Executive - $5/חודש</option>
                    <option value="ultimate">Ultimate - $14/חודש</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תדירות תשלום
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, billing: 'monthly' }))}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                        formData.billing === 'monthly'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      חודשי
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, billing: 'yearly' }))}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                        formData.billing === 'yearly'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      שנתי (חסכון 20%)
                    </button>
                  </div>
                </div>
                
                {/* סיכום מחיר */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3">סיכום הזמנה</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>תוכנית {formData.plan === 'executive' ? 'Executive' : 'Ultimate'}</span>
                      <span className="font-medium">
                        ${currentPrice}/{formData.billing === 'yearly' ? 'שנה' : 'חודש'}
                      </span>
                    </div>
                    {formData.billing === 'yearly' && (
                      <div className="text-sm text-green-600">
                        חסכון של 20% - ${monthlyPrice} לחודש
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>סה"כ היום:</span>
                        <span className="text-green-600">$0.00</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        7 ימי ניסיון בחינם, לאחר מכן ${currentPrice}/{formData.billing === 'yearly' ? 'שנה' : 'חודש'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
            
            {/* Submit button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02]'
                }`}
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
                  'המשך לתשלום מאובטח'
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  תשלום מאובטח
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.828V13a1 1 0 102 0V9.828l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  ביטול בכל עת
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ללא התחייבות
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Security badges */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">תומך בכל אמצעי התשלום המובילים</p>
          <div className="flex justify-center items-center space-x-4">
            <span className="text-gray-400">💳 Visa</span>
            <span className="text-gray-400">💳 Mastercard</span>
            <span className="text-gray-400">💳 Amex</span>
            <span className="text-gray-400">🍎 Apple Pay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
