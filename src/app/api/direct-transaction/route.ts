// /app/api/direct-transaction/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function createTranzilaHeaders() {
  const appKey = process.env.TRANZILA_API_APP_KEY!;
  const secretKey = process.env.TRANZILA_API_SECRET!;
  const nonce = crypto.randomBytes(20).toString('hex');
  const timestamp = Date.now().toString();
  
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
    const { 
      cardNumber, 
      expiryMonth, 
      expiryYear, 
      cvv, 
      cardHolderId,
      amount,
      plan,
      billing,
      email,
      fullName,
      registrationCode
    } = body;
    
    // בדיקת נתונים
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !amount) {
      return NextResponse.json(
        { error: 'Missing required card details' },
        { status: 400 }
      );
    }
    
    // הכנת בקשת עסקה
    const transactionRequest = {
      terminal_name: process.env.TRANZILA_TERMINAL!,
      txn_type: "verify", // verify עם verify_mode 5 = J5 (שמירת הרשאה)
      verfiy_mode: 5, // J5 - שמירת הרשאה לחיוב עתידי
      txn_currency_code: "ILS",
      expire_month: parseInt(expiryMonth),
      expire_year: parseInt(expiryYear),
      cvv: cvv,
      card_number: cardNumber.replace(/\s/g, ''), // הסרת רווחים
      card_holder_id: cardHolderId || null,
      payment_plan: 1, // תשלום רגיל
      client: {
        name: fullName || "Yaya Customer",
        email: email || null,
        id: cardHolderId || null
      },
      items: [{
        name: `Yaya ${plan} - ${billing} (7 days trial)`,
        unit_price: 0.01, // סכום סמלי לאימות
        units_number: 1,
        type: "I",
        price_type: "G",
        currency_code: "ILS"
      }],
      user_defined_fields: [
        { name: "registration_code", value: registrationCode },
        { name: "plan", value: plan },
        { name: "billing", value: billing },
        { name: "actual_amount", value: amount.toString() },
        { name: "DCdisable", value: `${registrationCode}-${Date.now()}` }
      ],
      response_language: "hebrew",
      created_by_user: email || "system",
      created_by_system: "YayaAgent"
    };
    
    console.log('Creating direct transaction...', {
      plan,
      billing,
      amount,
      registrationCode
    });
    
    const headers = createTranzilaHeaders();
    
    const response = await fetch('https://api.tranzila.com/v1/transaction/credit_card/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(transactionRequest)
    });
    
    const result = await response.json();
    
    console.log('Transaction result:', result);
    
    if (result.error_code === 0 && result.transaction_result) {
      const txResult = result.transaction_result;
      
      // אם העסקה הצליחה
      if (txResult.processor_response_code === '000') {
        return NextResponse.json({
          success: true,
          transactionId: txResult.transaction_id,
          authNumber: txResult.auth_number,
          token: txResult.token, // שמור לחיובים עתידיים!
          last4: txResult.last_4,
          cardMask: txResult.card_mask,
          cardType: txResult.card_type_name,
          message: 'אימות הכרטיס הצליח! יש לך 7 ימי ניסיון בחינם.',
          trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      } else {
        // שגיאה מהמעבד
        const errorMessages: Record<string, string> = {
          '001': 'כרטיס חסום',
          '002': 'כרטיס גנוב',
          '003': 'צור קשר עם חברת האשראי',
          '004': 'הכרטיס נדחה',
          '006': 'תעודת זהות שגויה',
          '033': 'כרטיס פג תוקף',
          '036': 'כרטיס מוגבל',
          '051': 'אין מספיק כסף בחשבון',
          '057': 'תעודת זהות לא תקינה',
          '065': 'חריגה ממגבלת אשראי'
        };
        
        return NextResponse.json({
          success: false,
          error: errorMessages[txResult.processor_response_code] || 
                 `שגיאה בעיבוד התשלום (${txResult.processor_response_code})`,
          errorCode: txResult.processor_response_code
        });
      }
    } else {
      // שגיאה ב-API
      throw new Error(result.message || 'Transaction failed');
    }
    
  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'שגיאה בעיבוד התשלום',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
