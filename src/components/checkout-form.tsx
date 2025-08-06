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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // בנה URL עם כל הפרמטרים הנדרשים
    const params = new URLSearchParams({
      // פרטי מסוף
      supplier: 'fxpyairsabag',
      
      // פרטי עסקה
      sum: price,
      currency: '1', // ILS
      cred_type: '1',
      
      // פרטי לקוח
      contact: formData.fullName,
      email: formData.email,
      phone: formData.phone.replace(/[-\s]/g, ''),
      myid: formData.idNumber,
      
      // הגדרות
      tranmode: 'VK', // Verify + Token למנוי
      lang: 'il',
      
      // תיאור
      pdesc: `${plan} Plan - Monthly Subscription`,
      
      // שדות מותאמים
      custom1: registrationCode,
      custom2: plan,
      custom3: billing
    });
    
    // הפנה לדף התשלום של Tranzila
    window.location.href = `https://direct.tranzila.com/fxpyairsabag/iframenew.php?${params}`;
  };

  const handleDirectPayment = () => {
    // יצירת טופס זמני ושליחה ישירה ל-Tranzila
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://direct.tranzila.com/fxpyairsabagtok/';
    form.style.display = 'none';
    
    // כל השדות הנדרשים
    const fields = {
      // פרטי מסוף - נסה עם המסוף הרגיל
      supplier: 'fxpyairsabag',
      TranzilaPW: 'Mhat5D1',
      
      // פרטי עסקה
      sum: price,
      currency: '1', // ILS
      
      // פרטי כרטיס
      ccno: formData.cardNumber.replace(/\s/g, ''), // הסר רווחים
      expmonth: formData.expiryMonth.padStart(2, '0'),
      expyear: formData.expiryYear,
      mycvv: formData.cvv,
      myid: formData.idNumber,
      
      // פרטי לקוח
      contact: formData.fullName,
      email: formData.email,
      phone: formData.phone.replace(/[-\s]/g, ''), // הסר מקפים ורווחים
      
      // הגדרות מנוי
      tranmode: 'VK', // Verify + Token למנוי
      TranzilaTK: '1', // בקש יצירת טוקן
      
      // תיאור
      pdesc: `${plan} Plan - Monthly Subscription`,
      
      // שדות מותאמים
      custom1: registrationCode,
      custom2: plan,
      custom3: billing,
      
      // URLs לחזרה
      success_return_url: `${window.location.origin}/payment/callback?status=success`,
      fail_return_url: `${window.location.origin}/payment/callback?status=failed`,
      notify_url: `${window.location.origin}/api/payment-webhook`,
      
      // שפה
      lang: 'il'
    };
    
    // הוסף את כל השדות לטופס
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    });
    
    // הוסף לדף ושלח
    document.body.appendChild(form);
    form.submit();
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="050-1234567"
          />
        </div>
        
        {/* פרטי כרטיס */}
        <div>
          <label className="block mb-1 font-medium">מספר כרטיס *</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            required
            maxLength={19}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="1234 5678 9012 3456"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block mb-1 font-medium">חודש *</label>
            <input
              type="text"
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleInputChange}
              required
              maxLength={2}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="123"
            />
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
          className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-700"
        >
          התחל ניסיון חינם - ₪0.00
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          התשלום מאובטח ומוצפן. ניתן לבטל בכל עת.
        </p>
      </form>
    </div>
  );
}
