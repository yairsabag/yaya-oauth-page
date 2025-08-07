// /app/api/test-tranzila-api/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function createTranzilaHeaders() {
  const appKey = process.env.TRANZILA_API_APP_KEY!;
  const secretKey = process.env.TRANZILA_API_SECRET!;
  const nonce = crypto.randomBytes(40).toString('hex'); // 80 characters כמו בדוגמה
  const timestamp = Math.floor(Date.now() / 1000).toString(); // Unix timestamp בשניות, לא במילישניות!
  
  // הסדר הנכון לפי הדוקומנטציה
  const dataToSign = secretKey + timestamp + nonce;
  
  // hash_hmac עם appKey בתור ה-key
  const accessToken = crypto
    .createHmac('sha256', appKey)
    .update(dataToSign)
    .digest('hex');
  
  return {
    'X-tranzila-api-app-key': appKey,
    'X-tranzila-api-request-time': timestamp,
    'X-tranzila-api-nonce': nonce,
    'X-tranzila-api-access-token': accessToken,
    'Content-Type': 'application/json'
  };
}

export async function POST(request: NextRequest) {
  try {
    const paymentRequest = {
      terminal_name: process.env.TRANZILA_TERMINAL!,
      created_by_user: "system",
      created_by_system: "YayaAgent",
      created_via: "TRAPI",
      action_type: 1,
      response_language: "hebrew",
      request_currency: "ILS",
      payment_plans: [1],
      payment_methods: [1],
      client: {
        name: "Test Customer",
        contact_person: "Test Customer",
        email: "test@example.com",
        id: "123456789"
      },
      items: [{
        name: "Test Product",
        unit_price: 10,
        type: "I",
        units_number: 1,
        price_type: "G",
        currency_code: "ILS"
      }],
      payments_number: 1
    };
    
    const headers = createTranzilaHeaders();
    
    const response = await fetch('https://api.tranzila.com/v1/pr/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentRequest)
    });
    
    const result = await response.json();
    
    return NextResponse.json({
      success: result.error_code === 0,
      result
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
