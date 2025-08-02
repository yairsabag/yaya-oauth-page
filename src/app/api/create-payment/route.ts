import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // קבל את הנתונים מהבקשה
    const body = await request.json();
    const { plan, billing, registrationCode, email } = body;
    
    // בדיקת נתונים
    if (!plan || !billing || !registrationCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // הגדרת מחירים
    const prices = {
      executive: { 
        monthly: 5, 
        yearly: 48  // 5$ לחודש * 12
      },
      ultimate: { 
        monthly: 14, 
        yearly: 156 // 14$ לחודש * 12
      }
    };
    
    // חישוב המחיר הסופי
    const amount = billing === 'yearly' 
      ? prices[plan as keyof typeof prices].yearly 
      : prices[plan as keyof typeof prices].monthly;
    
    // הגדרות Tranzila
    const terminal = process.env.TRANZILA_TERMINAL;
    const password = process.env.TRANZILA_PASSWORD;
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://yayagent.com';
    
    if (!terminal || !password) {
      console.error('Missing Tranzila credentials');
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }
    
    // חישוב תאריך לתשלום דחוי (7 ימי trial)
    const deferredDate = new Date();
    deferredDate.setDate(deferredDate.getDate() + 7);
    const deferredDateStr = deferredDate.toISOString().split('T')[0].replace(/-/g, '');
    
    // הכנת פרמטרים ל-Tranzila
    const tranzilaParams = {
      // חובה
      terminal: terminal,
      
      // סכום
      sum: amount,
      currency: '1', // 1 = ILS, 2 = USD
      
      // סוג עסקה - תשלום דחוי (לאחר 7 ימי trial)
      tranmode: 'VD', // V = Verify, D = Deferred
      
      // תאריך החיוב (בפורמט YYYYMMDD)
      deferredpayment: deferredDateStr,
      
      // פרטי לקוח
      email: email || '',
      
      // נתונים נוספים
      remarks: `Yaya ${plan} - ${billing}`,
      custom1: registrationCode,
      custom2: plan,
      custom3: billing,
      
      // URLs לחזרה
      success_url: `${domain}/payment/success?code=${registrationCode}&plan=${plan}&billing=${billing}&price=${amount}`,
      fail_url: `${domain}/payment/failed?code=${registrationCode}`,
      notify_url: `https://n8n-TD2y.sliplane.app/webhook/tranzila-notify`,
      
      // שפה
      lang: 'il', // עברית
      
      // אפשרויות נוספות
      cred_type: '1', // רגיל
      trBgColor: 'ffffff',
      trTextColor: '000000',
      trButtonColor: '8B5E3C'
    };
    
    // הכן את ה-URL עם כל הפרמטרים
    const baseUrl = 'https://direct.tranzila.com/fxpyairsabagtok/iframenew.php';
    const queryString = new URLSearchParams(tranzilaParams).toString();
    const paymentUrl = `${baseUrl}?${queryString}`;
    
    console.log('Tranzila payment URL created:', {
      plan,
      amount,
      deferredDate: deferredDateStr,
      registrationCode
    });
    
    return NextResponse.json({
      success: true,
      paymentUrl,
      amount,
      plan,
      billing,
      registrationCode,
      trialEndDate: deferredDate.toISOString()
    });
    
  } catch (error) {
    console.error('Error in create-payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
