// src/app/api/create-payment-request/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function generateTranzilaHeaders(appKey: string, privateKey: string, requestBody: string) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  
  // יצירת החתימה
  const dataToSign = `${appKey}${timestamp}${nonce}${requestBody}`;
  const signature = crypto
    .createHmac('sha256', privateKey)
    .update(dataToSign)
    .digest('hex');
  
  return {
    'X-tranzila-api-app-key': appKey,
    'X-tranzila-api-request-time': timestamp,
    'X-tranzila-api-nonce': nonce,
    'X-tranzila-api-access-token': signature,
    'Content-Type': 'application/json'
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // המפתחות שלך
    const appKey = 'WyztPVpPn13DTtQ2CLDxsaWGvFrh1vTLUkbKLdXeV4FTPRlcrZi8g8ycPHVUGbCJwgqKJlaQIcU'; // Public key
    const privateKey = 'Wnw8SPxfFs'; // Private key
    
    // הכן את הבקשה
    const paymentRequest = {
      terminal_name: 'fxpyairsabag', // או fxpyairsabagtok
      action_type: 1, // חיוב
      response_language: 'hebrew',
      request_currency: 'ILS',
      request_vat: 17,
      payments_number: 1,
      created_by_user: body.email,
      created_via: 'TRAPI',
      payment_plans: [1], // רגיל
      payment_methods: [1, 14], // כרטיס אשראי + Apple Pay
      
      client: {
        name: body.fullName,
        id: body.idNumber || '123456789',
        contact_person: body.fullName,
        email: body.email,
        phone_country_code: '972',
        phone_area_code: body.phone.substring(1, 4), // מ-0542598700 ל-054
        phone_number: body.phone.substring(4) // 2598700
      },
      
      items: [{
        id: 1,
        code: body.plan,
        name: `${body.plan} Plan - Monthly Subscription`,
        unit_price: parseFloat(body.amount),
        type: 'S', // Service
        units_number: 1,
        unit_type: 1,
        price_type: 'G',
        currency_code: 'ILS'
      }],
      
      send_email: {
        sender_name: 'YayAgent',
        sender_email: 'noreply@yayagent.com'
      }
    };
    
    const requestBody = JSON.stringify(paymentRequest);
    const headers = generateTranzilaHeaders(appKey, privateKey, requestBody);
    
    console.log('Sending payment request to Tranzila:', {
      url: 'https://api.tranzila.com/v1/pr/create',
      headers: { ...headers, 'X-tranzila-api-access-token': '[HIDDEN]' },
      body: paymentRequest
    });
    
    // שלח ל-Tranzila
    const response = await fetch('https://api.tranzila.com/v1/pr/create', {
      method: 'POST',
      headers,
      body: requestBody
    });
    
    const responseText = await response.text();
    console.log('Tranzila response:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', responseText);
      return NextResponse.json(
        { error: 'Invalid response from payment provider' },
        { status: 500 }
      );
    }
    
    if (result.error_code === 0) {
      // הצלחה! קיבלנו קישור תשלום
      return NextResponse.json({
        success: true,
        paymentUrl: result.pr_link,
        paymentRequestId: result.pr_id,
        message: result.message
      });
    } else {
      // שגיאה
      return NextResponse.json({
        success: false,
        error: result.message || 'Failed to create payment request',
        errorCode: result.error_code
      });
    }
    
  } catch (error) {
    console.error('Payment request error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment request' },
      { status: 500 }
    );
  }
}

// src/components/checkout-form.tsx - עדכון
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  
  try {
    // שלח לשרת ליצירת Payment Request
    const response = await fetch('/api/create-payment-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        amount: price,
        plan,
        billing,
        registrationCode
      })
    });
    
    const result = await response.json();
    
    if (result.success && result.paymentUrl) {
      // הפנה לדף התשלום של Tranzila
      window.location.href = result.paymentUrl;
    } else {
      setError(result.error || 'שגיאה ביצירת בקשת תשלום');
      setIsLoading(false);
    }
  } catch (error) {
    console.error('Payment error:', error);
    setError('שגיאה בתהליך התשלום');
    setIsLoading(false);
  }
};
