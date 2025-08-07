// /app/api/test-tranzila-api/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function createTranzilaHeaders() {
  const appKey = process.env.TRANZILA_API_APP_KEY!;
  const secretKey = process.env.TRANZILA_API_SECRET!;
  const nonce = crypto.randomBytes(20).toString('hex');
  const timestamp = Date.now().toString();
  
  // נסה עם הסדר המדויק מהדוגמה שלהם
  const message = appKey + timestamp + nonce;
  const accessToken = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex'); // חזרה ל-hex
  
  console.log('Auth details:', {
    appKey,
    secretKeyLength: secretKey.length,
    nonce,
    timestamp,
    message,
    accessToken
  });
  
  return {
    'X-tranzila-api-app-key': appKey,
    'X-tranzila-api-nonce': nonce,
    'X-tranzila-api-request-time': timestamp,
    'X-tranzila-api-access-token': accessToken,
    'Content-Type': 'application/json'
  };
}

export async function GET(request: NextRequest) {
  try {
    const headers = createTranzilaHeaders();
    
    // נסה קודם GET request פשוט
    const response = await fetch('https://api.tranzila.com/v1/transaction/1234567', {
      method: 'GET',
      headers
    });
    
    const responseText = await response.text();
    
    return NextResponse.json({
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      sentHeaders: {
        ...headers,
        'X-tranzila-api-access-token': '[HIDDEN]'
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
