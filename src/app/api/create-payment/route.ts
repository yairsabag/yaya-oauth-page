// /app/api/create-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// פונקציה ליצירת ה-authentication headers
function createTranzilaHeaders() {
  const appKey = process.env.TRANZILA_API_APP_KEY!;
  const secretKey = process.env.TRANZILA_API_SECRET!;
  const nonce = crypto.randomBytes(20).toString('hex'); // 40 characters
  const timestamp = Date.now().toString();
  
  // יצירת ה-access token - HMAC-SHA256
  const dataToSign = secretKey + timestamp + nonce;
  const accessToken = crypto
    .createHmac('sha256', appKey)
    .update(dataToSign)
    .digest('hex');
  
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
    const body = await request.json();
    const { plan, billing, registrationCode, email, fullName } = body;
    
    // וידוא שדות חובה
    if (!plan || !billing || !registrationCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // הגדרת מחירים
    const prices = {
      executive: { monthly: 5, yearly: 48 },
      ultimate: { monthly: 14, yearly: 156 }
    };
    
    const amount = billing === 'yearly' 
      ? prices[plan as keyof typeof prices].yearly 
      : prices[plan as keyof typeof prices].monthly;
    
    // יצירת payment request
    const paymentRequest = {
      terminal_name: process.env.TRANZILA_TERMINAL!,
      action_type: 1, // 1 = charge
      request_date: null, // יחייב מיידית
      request_language: "hebrew",
      response_language: "hebrew",
      request_currency: "ILS",
      created_by_user: "system",
      created_by_system: "YayaAgent",
      created_via: "TRAPI",
      payment_plans: [1], // 1 = regular payment
      payment_methods: [1, 15], // 1 = credit card, 15 = Apple Pay
      payments_number: 1,
      client: {
        name: fullName || "Yaya Customer",
        contact_person: fullName || "Yaya Customer",
        id: "", // תעודת זהות - אופציונלי
        email: email || "",
        phone_country_code: "972",
        phone_area_code: "",
        phone_number: ""
      },
      items: [{
        name: `Yaya ${plan.charAt(0).toUpperCase() + plan.slice(1)} - ${billing === 'yearly' ? 'שנתי' : 'חודשי'}`,
        unit_price: amount,
        type: "I", // I = Item
        units_number: 1,
        unit_type: 1,
        price_type: "G", // G = Gross (כולל מע"מ)
        currency_code: "ILS"
      }],
      request_vat: 17, // מע"מ בישראל
      user_defined_fields: [
        { name: "registration_code", value: registrationCode },
        { name: "plan", value: plan },
        { name: "billing", value: billing },
        { name: "trial_days", value: "7" },
        { name: "DCdisable", value: `${registrationCode}-${Date.now()}` } // למניעת כפל חיובים
      ]
    };
    
    // אם רוצים לשלוח דרישת תשלום במייל
    if (email) {
      paymentRequest.send_email = {
        sender_name: "Yaya Agent",
        sender_email: "noreply@yayagent.com"
      };
    }
    
    console.log('Creating payment request:', {
      plan,
      billing,
      amount,
      registrationCode
    });
    
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
        billing,
        message: result.message
      });
    } else {
      console.error('Tranzila error:', result);
      throw new Error(result.message || 'Payment creation failed');
    }
    
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
