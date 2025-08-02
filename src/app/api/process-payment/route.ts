import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // קבל את פרטי Tranzila
    const terminal = process.env.TRANZILA_TERMINAL;
    const password = process.env.TRANZILA_PASSWORD;
    
    if (!terminal || !password) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }
    
    // חישוב תאריך דחוי (7 ימי trial)
    const deferredDate = new Date();
    deferredDate.setDate(deferredDate.getDate() + 7);
    const deferredDateStr = deferredDate.toISOString().split('T')[0].replace(/-/g, '');
    
    // הכן את הפרמטרים ל-Tranzila Direct API
    const tranzilaParams = new URLSearchParams({
      // Merchant details
      supplier: terminal,
      
      // Transaction details
      sum: body.amount,
      currency: '1', // ILS
      
      // Card details
      ccno: body.cardNumber,
      expmonth: body.expiryMonth.padStart(2, '0'),
      expyear: body.expiryYear,
      mycvv: body.cvv,
      myid: body.idNumber,
      
      // Customer details
      contact: body.fullName,
      email: body.email,
      phone: body.phone,
      
      // Transaction mode
      TranzilaPW: password,
      tranmode: 'D', // D = Deferred (תשלום דחוי)
      DeferredPaymentDate: deferredDateStr,
      
      // Custom fields
      custom1: body.registrationCode,
      custom2: body.plan,
      custom3: body.billing,
      
      // Response format
      response_return_format: 'json'
    });
    
    console.log('Processing payment for:', {
      plan: body.plan,
      amount: body.amount,
      registrationCode: body.registrationCode,
      deferredDate: deferredDateStr
    });
    
    // שלח ל-Tranzila Direct API
    const tranzilaResponse = await fetch('https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tranzilaParams.toString()
    });
    
    const responseText = await tranzilaResponse.text();
    console.log('Tranzila response:', responseText);
    
    // נסה לפרסר כ-JSON או כ-URL params
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      // אם זה לא JSON, נסה לפרסר כ-URL params
      const params = new URLSearchParams(responseText);
      result = Object.fromEntries(params.entries());
    }
    
    // בדוק האם העסקה הצליחה
    if (result.Response === '000') {
      // הצלחה!
      return NextResponse.json({
        success: true,
        transactionId: result.Tempref || result.TranzRef,
        approvalNumber: result.ConfirmationCode,
        message: 'Payment processed successfully'
      });
    } else {
      // כישלון
      const errorMessages: Record<string, string> = {
        '001': 'כרטיס חסום',
        '002': 'גנוב',
        '003': 'התקשר לחברת אשראי',
        '004': 'סירוב',
        '005': 'מזויף',
        '006': 'שגיאת זהות',
        '015': 'לא קיים',
        '033': 'כרטיס פג תוקף',
        '036': 'כרטיס מוגבל',
        '037': 'סירוב - התקשר לחברת אשראי',
        '039': 'אין ספק כזה',
        '041': 'כרטיס אבוד',
        '043': 'גנוב - לא להחזיר',
        '051': 'אין יתרה מספקת',
        '057': 'זהות לא תקינה',
        '061': 'מעבר לסכום המותר',
        '062': 'מספר עסקאות מקסימלי',
        '065': 'מעבר למגבלת אשראי',
        '999': 'שגיאה כללית'
      };
      
      const errorMessage = errorMessages[result.Response] || `שגיאה: ${result.Response}`;
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        errorCode: result.Response
      });
    }
    
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process payment' 
      },
      { status: 500 }
    );
  }
}
