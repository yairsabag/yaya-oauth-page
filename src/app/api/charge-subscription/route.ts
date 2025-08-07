// /app/api/charge-subscription/route.ts
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
      token,           // Token מהעסקה הראשונה
      originalTxnId,   // מספר העסקה המקורית (מה-verify)
      amount,
      subscriptionId,
      email,
      plan,
      billing
    } = body;
    
    if (!token || !originalTxnId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // ביצוע חיוב עם ה-token השמור
    const chargeRequest = {
      terminal_name: process.env.TRANZILA_TERMINAL!,
      txn_type: "force", // חיוב באמצעות הרשאה קיימת
      reference_txn_id: parseInt(originalTxnId), // העסקה המקורית
      token: token, // ה-token שקיבלנו
      txn_currency_code: "ILS",
      items: [{
        name: `Yaya ${plan} - מנוי ${billing === 'yearly' ? 'שנתי' : 'חודשי'}`,
        unit_price: amount,
        units_number: 1,
        type: "I",
        price_type: "G",
        currency_code: "ILS"
      }],
      client: {
        email: email || null
      },
      user_defined_fields: [
        { name: "subscription_id", value: subscriptionId },
        { name: "plan", value: plan },
        { name: "billing", value: billing },
        { name: "charge_type", value: "recurring" },
        { name: "DCdisable", value: `${subscriptionId}-${Date.now()}` }
      ],
      response_language: "hebrew",
      created_by_user: "system",
      created_by_system: "YayaAgent-Recurring"
    };
    
    console.log('Charging subscription:', {
      subscriptionId,
      amount,
      plan,
      billing
    });
    
    const headers = createTranzilaHeaders();
    
    const response = await fetch('https://api.tranzila.com/v1/transaction/credit_card/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(chargeRequest)
    });
    
    const result = await response.json();
    
    console.log('Charge result:', result);
    
    if (result.error_code === 0 && result.transaction_result) {
      const txResult = result.transaction_result;
      
      if (txResult.processor_response_code === '000') {
        // החיוב הצליח
        return NextResponse.json({
          success: true,
          transactionId: txResult.transaction_id,
          authNumber: txResult.auth_number,
          amount: txResult.amount,
          chargedAt: new Date().toISOString(),
          nextChargeDate: calculateNextChargeDate(billing)
        });
      } else {
        // החיוב נכשל
        return NextResponse.json({
          success: false,
          error: `חיוב נכשל (${txResult.processor_response_code})`,
          errorCode: txResult.processor_response_code,
          shouldRetry: ['051', '065', '057'].includes(txResult.processor_response_code) // שגיאות זמניות
        });
      }
    } else {
      throw new Error(result.message || 'Charge failed');
    }
    
  } catch (error) {
    console.error('Subscription charge error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to charge subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function calculateNextChargeDate(billing: string): string {
  const nextDate = new Date();
  if (billing === 'yearly') {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  } else {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  return nextDate.toISOString();
}
