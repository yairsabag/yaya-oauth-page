// /app/api/debug-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function createTranzilaHeaders() {
  try {
    const appKey = process.env.TRANZILA_API_APP_KEY!;
    const secretKey = process.env.TRANZILA_API_SECRET!;
    const time = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(40).toString('hex');
    
    const accessToken = crypto
      .createHmac('sha256', secretKey + time + nonce)
      .update(appKey)
      .digest('hex');
    
    return {
      'X-tranzila-api-app-key': appKey,
      'X-tranzila-api-request-time': time.toString(),
      'X-tranzila-api-nonce': nonce,
      'X-tranzila-api-access-token': accessToken,
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error('Error creating headers:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan = 'executive', billing = 'monthly', registrationCode = 'TEST123' } = body;
    
    console.log('Debug payment request:', { plan, billing, registrationCode });
    
    const prices = {
      executive: { monthly: 5, yearly: 48 },
      ultimate: { monthly: 14, yearly: 156 }
    };
    
    const amount = prices[plan as keyof typeof prices][billing as keyof typeof prices.executive];
    
    const paymentRequest = {
      terminal_name: process.env.TRANZILA_TERMINAL!,
      created_by_user: "system",
      created_by_system: "YayaAgent",
      created_via: "TRAPI",
      action_type: 1,
      request_language: "hebrew",
      response_language: "hebrew",
      request_currency: "ILS",
      payment_plans: [1],
      payment_methods: [1],
      payments_number: 1,
      request_date: null,
      client: {
        name: "Test Customer",
        contact_person: "Test Customer",
        email: "test@example.com",
        id: "123456789"
      },
      items: [{
        name: `Yaya ${plan} - ${billing}`,
        unit_price: amount,
        type: "I",
        units_number: 1,
        unit_type: 1,
        price_type: "G",
        currency_code: "ILS"
      }],
      send_email: {
        sender_name: "Yaya Agent",
        sender_email: "noreply@yayagent.com"
      }
    };
    
    console.log('Creating payment with Tranzila...');
    
    const headers = createTranzilaHeaders();
    const response = await fetch('https://api.tranzila.com/v1/pr/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentRequest)
    });
    
    const result = await response.json();
    console.log('Tranzila response:', result);
    
    if (result.error_code === 0) {
      return NextResponse.json({
        success: true,
        paymentUrl: result.pr_link,
        paymentRequestId: result.pr_id,
        amount,
        plan,
        billing
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message || 'Payment creation failed',
        errorCode: result.error_code
      });
    }
    
  } catch (error) {
    console.error('Debug payment error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
