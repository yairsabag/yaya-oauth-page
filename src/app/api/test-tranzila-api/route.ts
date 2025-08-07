// /app/api/test-tranzila-api/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function createTranzilaHeaders() {
  const appKey = process.env.TRANZILA_API_APP_KEY!;
  const secretKey = process.env.TRANZILA_API_SECRET!;
  const nonce = crypto.randomBytes(20).toString('hex');
  const timestamp = Date.now().toString();
  
  const dataToSign = secretKey + timestamp + nonce;
  const accessToken = crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('base64');
  
  return {
    'X-tranzila-api-app-key': appKey,
    'X-tranzila-api-nonce': nonce,
    'X-tranzila-api-request-time': timestamp,
    'X-tranzila-api-access-token': accessToken,
    'Content-Type': 'application/json'
  };
}

export async function POST(request: NextRequest) {
  try {
    // בקשה פשוטה מאוד
    const paymentRequest = {
      terminal_name: process.env.TRANZILA_TERMINAL!,
      action_type: 1,
      response_language: "hebrew",
      request_currency: "ILS",
      created_by_user: "test",
      created_by_system: "test",
      created_via: "TRAPI",
      payment_plans: [1],
      payment_methods: [1],
      payments_number: 1,
      client: {
        name: "Test User",
        contact_person: "Test User",
        email: "test@example.com"
      },
      items: [{
        name: "Test Item",
        unit_price: 10,
        type: "I",
        units_number: 1,
        unit_type: 1,
        price_type: "G",
        currency_code: "ILS"
      }]
    };
    
    const headers = createTranzilaHeaders();
    
    console.log('Sending request to Tranzila:', {
      url: 'https://api.tranzila.com/v1/pr/create',
      headers: {
        ...headers,
        'X-tranzila-api-access-token': '[HIDDEN]'
      },
      body: paymentRequest
    });
    
    const response = await fetch('https://api.tranzila.com/v1/pr/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentRequest)
    });
    
    const responseText = await response.text();
    console.log('Tranzila response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json({
        error: 'Failed to parse response',
        responseText,
        status: response.status
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: result.error_code === 0,
      result,
      status: response.status
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
