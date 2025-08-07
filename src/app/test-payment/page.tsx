'use client';

import PaymentButton from '@/components/payment-button';

export default function TestPaymentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8">
        <h1 className="text-2xl font-bold text-center mb-8">בדיקת תשלום</h1>
        
        <PaymentButton 
          plan="executive"
          billing="monthly"
          registrationCode="TEST123"
          email="test@example.com"
          fullName="Test User"
        />
      </div>
    </div>
  );
}
