// src/app/api/payment-webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Tranzila שולחת את הנתונים כ-form data
    const formData = await request.formData();
    const data: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    
    console.log('Webhook received:', data);
    
    // בדוק את הסטטוס
    if (data.Response === '000') {
      // התשלום הצליח!
      const paymentInfo = {
        transactionId: data.Tempref || data.TranzRef,
        paymentRequestId: data.pr_id,
        amount: data.sum,
        token: data.TranzilaTK, // טוקן למנוי
        cardMask: data.ccno_masked,
        customerName: data.contact,
        email: data.email,
        plan: data.custom2,
        registrationCode: data.custom1
      };
      
      console.log('Payment successful:', paymentInfo);
      
      // TODO: עדכן במסד נתונים
      // await prisma.subscription.create({
      //   data: {
      //     email: paymentInfo.email,
      //     tranzilaToken: paymentInfo.token,
      //     transactionId: paymentInfo.transactionId,
      //     plan: paymentInfo.plan,
      //     amount: parseFloat(paymentInfo.amount),
      //     status: 'trial',
      //     trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      //     nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      //   }
      // });
    }
    
    // תמיד החזר 200 OK ל-webhook
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    // עדיין החזר 200 כדי ש-Tranzila לא תנסה שוב
    return NextResponse.json({ received: true });
  }
}
