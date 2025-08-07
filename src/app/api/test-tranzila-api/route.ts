// /app/api/test-tranzila-api/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function createTranzilaHeaders() {
  const appKey = process.env.TRANZILA_API_APP_KEY!;
  const secretKey = process.env.TRANZILA_API_SECRET!;
  const time = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
  const nonce = crypto.randomBytes(40).toString('hex'); // 80 character string
  
  // בדיוק כמו בדוגמה ב-PHP שלהם (גם אם זה נראה הפוך)
  // PHP: hash_hmac('sha256', $appKey, $secret . $time . $nonce)
  // ב-PHP הסדר הוא: algorithm, data, key
  // אז data = appKey, key = secret+time+nonce
  const accessToken = crypto
    .createHmac('sha256', secretKey + time + nonce)
    .update(appKey)
    .digest('hex');
  
  console.log('Auth calculation:', {
    time,
    nonceLength: nonce.length,
    accessTokenLength: accessToken.length
  });
  
  return {
    'X-tranzila-api-app-key': appKey,
    'X-tranzila-api-request-time': time.toString(),
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
  request_language: "hebrew", // הוספנו
  response_language: "hebrew",
  request_currency: "ILS",
  payment_plans: [1],
  payment_methods: [1], // רק כרטיס אשראי לבינתיים
  payments_number: 1,
  request_date: null, // הוספנו
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
    unit_type: 1, // הוספנו
    price_type: "G",
    currency_code: "ILS"
  }],
  send_email: {
    sender_name: "Yaya Agent",
    sender_email: "noreply@yayagent.com"
  }
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
