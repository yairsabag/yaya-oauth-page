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
    
    console.log('Payment request:', {
      plan,
      billing,
      amount,
      registrationCode
    });
    
    // כרגע רק נחזיר את הנתונים - בשלב הבא נוסיף את Tranzila
    return NextResponse.json({
      success: true,
      amount,
      plan,
      billing,
      registrationCode,
      message: 'Payment endpoint ready - Tranzila integration pending'
    });
    
  } catch (error) {
    console.error('Error in create-payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
