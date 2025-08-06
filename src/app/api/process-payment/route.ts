// src/app/api/process-payment/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // קבל את פרטי Tranzila מה-environment variables
    const terminal = process.env.TRANZILA_TERMINAL || 'fxpyairsabagtok'; // מסוף טוקנים למנויים
    const password = process.env.TRANZILA_PASSWORD || 'Fwnf8oAr'; // סיסמת מסוף טוקנים
    
    // הכן את הפרמטרים ל-Tranzila
    const tranzilaParams = new URLSearchParams({
      // פרטי מסוף
      supplier: terminal,
      terminal_name: terminal,
      TranzilaPW: password,
      
      // פרטי עסקה
      sum: body.amount,
      currency: '1', // ILS
      cred_type: '1',
      
      // פרטי כרטיס
      ccno: body.cardNumber.replace(/\s/g, ''),
      expmonth: body.expiryMonth.padStart(2, '0'),
      expyear: body.expiryYear.length === 2 ? body.expiryYear : body.expiryYear.slice(-2),
      mycvv: body.cvv,
      myid: body.idNumber,
      
      // פרטי לקוח
      contact: body.fullName,
      email: body.email,
      phone: body.phone.replace(/[-\s]/g, ''),
      
      // הגדרות מנוי
      tranmode: 'VK', // V = Verify, K = Create Token
      TranzilaTK: '1', // בקש יצירת טוקן
      
      // תיאור
      pdesc: `${body.plan} Plan - ${body.billing} Subscription`,
      
      // שדות מותאמים
      custom1: body.registrationCode,
      custom2: body.plan,
      custom3: body.billing,
      
      // פורמט תשובה
      response_return_format: 'json'
    });
    
    console.log('Sending to Tranzila:', {
      terminal,
      amount: body.amount,
      plan: body.plan
    });
    
    // שלח ל-Tranzila
    const response = await fetch('https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tranzilaParams.toString()
    });
    
    const responseText = await response.text();
    console.log('Tranzila raw response:', responseText);
    
    // פרסר את התשובה
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      // אם לא JSON, נסה כ-URL params
      const params = new URLSearchParams(responseText);
      result = Object.fromEntries(params.entries());
    }
    
    console.log('Parsed result:', result);
    
    // בדוק תוצאה
    if (result.Response === '000') {
      // הצלחה!
      const successData = {
        success: true,
        transactionId: result.Tempref || result.TranzRef,
        approvalNumber: result.ConfirmationCode || result.ApprovalNo,
        token: result.TranzilaTK,
        last4: result.ccno ? result.ccno.slice(-4) : '',
        message: 'תשלום בוצע בהצלחה! יש לך 7 ימי ניסיון בחינם.'
      };
      
      // TODO: שמור את פרטי המנוי במסד נתונים
      // await saveSubscription({
      //   email: body.email,
      //   token: result.TranzilaTK,
      //   plan: body.plan,
      //   transactionId: result.Tempref
      // });
      
      return NextResponse.json(successData);
      
    } else {
      // טיפול בשגיאות
      const errorMessages: Record<string, string> = {
        '001': 'כרטיס חסום',
        '002': 'כרטיס גנוב',
        '003': 'צור קשר עם חברת האשראי',
        '004': 'הכרטיס נדחה',
        '006': 'תעודת זהות שגויה',
        '033': 'כרטיס פג תוקף',
        '036': 'כרטיס מוגבל',
        '039': 'מספר ספק שגוי',
        '051': 'אין מספיק כסף בחשבון',
        '057': 'תעודת זהות לא תקינה',
        '065': 'חריגה ממגבלת אשראי',
        '20006': 'שגיאת הרשאה - פנה לתמיכה'
      };
      
      return NextResponse.json({
        success: false,
        error: errorMessages[result.Response] || `שגיאה ${result.Response}`,
        errorCode: result.Response,
        details: result.error_msg || ''
      });
    }
    
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'שגיאה בעיבוד התשלום' 
      },
      { status: 500 }
    );
  }
}
