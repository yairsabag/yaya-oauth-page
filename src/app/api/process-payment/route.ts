import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // השתמש במסוף הטוקנים למנויים!
    const terminal = 'fxpyairsabagtok'; // מסוף טוקנים
    const password = 'Fwnf8oAr'; // סיסמת מסוף טוקנים
    
    // הכן את הפרמטרים ל-Tranzila
    const tranzilaParams = new URLSearchParams({
      // Merchant details
      supplier: terminal,
      terminal_name: terminal,
      
      // Transaction details
      sum: body.amount.toString(), // המר למחרוזת
      currency: '1', // ILS
      
      // Card details (אם לא Apple Pay)
      ccno: body.cardNumber || '',
      expmonth: body.expiryMonth?.padStart(2, '0') || '',
      expyear: body.expiryYear || '',
      mycvv: body.cvv || '',
      myid: body.idNumber || '',
      
      // Customer details
      contact: body.fullName,
      email: body.email,
      phone: body.phone,
      
      // Transaction mode - חשוב!
      TranzilaPW: password,
      tranmode: 'VK', // VK = Verify + Token (אימות ויצירת טוקן למנוי)
      TranzilaTK: '1', // בקש יצירת טוקן
      
      // תיאור
      pdesc: `${body.plan} Plan - Monthly Subscription`,
      
      // Custom fields
      custom1: body.registrationCode,
      custom2: body.plan,
      custom3: body.billing,
      
      // Response format
      response_return_format: 'json'
    });
    
    // אם זה Apple Pay
    if (body.paymentMethod === 'apple_pay') {
      tranzilaParams.set('apple_pay', '1');
      tranzilaParams.set('apple_pay_token', body.applePayToken);
      // הסר פרטי כרטיס רגיל
      tranzilaParams.delete('ccno');
      tranzilaParams.delete('expmonth');
      tranzilaParams.delete('expyear');
      tranzilaParams.delete('mycvv');
    }
    
    console.log('Processing subscription payment:', {
      plan: body.plan,
      amount: body.amount,
      paymentMethod: body.paymentMethod || 'card',
      terminal: terminal
    });
    
    // שלח ל-Tranzila
    const tranzilaResponse = await fetch('https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tranzilaParams.toString()
    });
    
    const responseText = await tranzilaResponse.text();
    console.log('Tranzila response:', responseText);
    
    // פרסר את התשובה
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      const params = new URLSearchParams(responseText);
      result = Object.fromEntries(params.entries());
    }
    
    if (result.Response === '000') {
      // הצלחה! קיבלנו טוקן למנוי
      const subscriptionToken = result.TranzilaTK;
      
      // TODO: שמור את הטוקן במסד נתונים
      // await saveSubscriptionToken({
      //   userId: body.userId,
      //   token: subscriptionToken,
      //   plan: body.plan,
      //   amount: body.amount,
      //   trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      // });
      
      return NextResponse.json({
        success: true,
        transactionId: result.Tempref,
        subscriptionToken: subscriptionToken,
        message: 'Subscription created successfully! 7 days free trial activated.'
      });
      
    } else if (result.Response === '20006') {
      // בעיית IP - נעבור לפתרון client-side
      return NextResponse.json({
        success: false,
        error: 'נדרש אימות נוסף. מעביר לדף תשלום מאובטח...',
        errorCode: result.Response,
        requiresRedirect: true,
        redirectData: {
          terminal: terminal,
          amount: body.amount,
          plan: body.plan,
          // אל תחזיר את הסיסמה! נשתמש בטופס ישיר
        }
      });
      
    } else {
      const errorMessages: Record<string, string> = {
        '001': 'כרטיס חסום',
        '004': 'סירוב',
        '033': 'כרטיס פג תוקף',
        '051': 'אין יתרה מספקת',
        '20006': 'נדרש אימות נוסף',
        // ... שאר השגיאות
      };
      
      return NextResponse.json({
        success: false,
        error: errorMessages[result.Response] || `שגיאה: ${result.Response}`,
        errorCode: result.Response
      });
    }
    
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

// פונקציה לחיוב חוזר (תועבר לקובץ נפרד)
// TODO: העבר את הפונקציה הזו ל-/lib/subscription-manager.ts
async function chargeSubscription(subscriptionToken: string, amount: number) {
  const chargeParams = new URLSearchParams({
    supplier: 'fxpyairsabagtok',
    TranzilaPW: 'Fwnf8oAr',
    tranmode: 'F', // F = Force (חיוב עם טוקן)
    TranzilaTK: subscriptionToken,
    sum: amount.toString(), // המר למחרוזת
    currency: '1',
    response_return_format: 'json'
  });
  
  const response = await fetch('https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: chargeParams.toString()
  });
  
  const result = await response.json();
  return result;
}
