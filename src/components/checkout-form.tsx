// src/components/checkout-form.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {
  plan: string;
  price: string;
  billing: string;
  registrationCode: string;
}

interface PaymentFormData {
  fullName: string;
  email: string;
  phone: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  idNumber: string;
}

export default function CheckoutForm({ plan, price, billing, registrationCode }: CheckoutFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<PaymentFormData>({
    fullName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    idNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // פורמט מספר כרטיס
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || value;
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // שלח ל-API שלנו
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: price,
          plan,
          billing,
          registrationCode
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // הצלחה! 
        console.log('Payment successful:', result);
        
        // שמור את פרטי התשלום ב-localStorage
        localStorage.setItem('paymentSuccess', JSON.stringify({
          transactionId: result.transactionId,
          plan,
          email: formData.email
        }));
        
        // הפנה לדף הצלחה
        router.push('/payment/success');
      } else {
        // הצג שגיאה
        setError(result.error || 'התשלום נכשל');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('שגיאה בתהליך התשלום. אנא נסה שוב.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">השלם תשלום</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* פרטי לקוח */}
        <div>
          <label className="block mb-1 font-medium">שם מלא *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="ישראל ישראלי"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">דוא"ל *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">טלפון *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="050-1234567"
          />
        </div>
        
        {/* פרטי כרטיס */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">פרטי תשלום</h3>
          
          <div>
            <label className="block mb-1 font-medium">מספר כרטיס *</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
              maxLength={19}
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div>
              <label className="block mb-1 font-medium">חודש *</label>
              <input
                type="text"
                name="expiryMonth"
                value={formData.expiryMonth}
                onChange={handleInputChange}
                required
                maxLength={2}
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="MM"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">שנה *</label>
              <input
                type="text"
                name="expiryYear"
                value={formData.expiryYear}
                onChange={handleInputChange}
                required
                maxLength={2}
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="YY"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">CVV *</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                required
                maxLength={3}
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="123"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">תעודת זהות *</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleInputChange}
            required
            maxLength={9}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="123456789"
          />
        </div>
        
        {/* סיכום */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>תוכנית:</span>
            <span className="font-semibold">{plan}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>תשלום:</span>
            <span className="font-semibold">{billing}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>סה"כ:</span>
            <span>₪{price}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            * 7 ימי ניסיון בחינם, לאחר מכן ₪{price} לחודש
          </p>
        </div>
        
        {/* כפתור שליחה */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              מעבד...
            </span>
          ) : (
            'התחל ניסיון חינם - ₪0.00'
          )}
        </button>
        
        <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          התשלום מאובטח ומוצפן. ניתן לבטל בכל עת.
        </div>
      </form>
    </div>
  );
}
