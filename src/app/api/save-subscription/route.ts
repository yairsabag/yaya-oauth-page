// src/app/api/save-subscription/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: וודא שהמשתמש מחובר
    // const session = await getSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const { transactionId, token, plan, registrationCode } = body;
    
    // TODO: שמור במסד נתונים
    console.log('Saving subscription:', {
      transactionId,
      token,
      plan,
      registrationCode,
      // userId: session.user.id,
      createdAt: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 ימים
    });
    
    // לדוגמה עם Prisma:
    // const subscription = await prisma.subscription.create({
    //   data: {
    //     userId: session.user.id,
    //     tranzilaToken: token,
    //     transactionId,
    //     plan,
    //     status: 'trial',
    //     trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //     nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //     amount: plan === 'executive' ? 5 : 10, // לפי התוכנית
    //   }
    // });
    
    return NextResponse.json({ 
      success: true,
      message: 'Subscription saved successfully'
    });
    
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}
