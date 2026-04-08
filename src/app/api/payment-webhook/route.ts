// src/app/api/payment-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// סוד לאימות הבקשה - תמצא אותו ב:
// LemonSqueezy → Settings → Webhooks → Signing Secret
const LEMON_WEBHOOK_SECRET = process.env.LEMON_WEBHOOK_SECRET || '';

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', LEMON_WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');
  return digest === signature;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';

    // אמת שהבקשה באמת מ-LemonSqueezy
    if (LEMON_WEBHOOK_SECRET && !verifySignature(rawBody, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(rawBody);
    const eventName = data.meta?.event_name;
    const customData = data.meta?.custom_data || {};
    const attributes = data.data?.attributes || {};

    console.log('Webhook received:', eventName, customData);

    // ─── תשלום ראשון / מנוי חדש ───────────────────────────────────────
    if (eventName === 'order_created' || eventName === 'subscription_created') {
      const paymentInfo = {
        orderId:          data.data?.id,
        subscriptionId:   attributes.subscription_id || data.data?.id,
        customerEmail:    attributes.user_email || attributes.email,
        customerName:     attributes.user_name,
        plan:             customData.plan || 'pro',
        registrationCode: customData.registration_code,
        waId:             customData.wa_id,
        amount:           attributes.total || attributes.first_subscription_item?.unit_price,
        status:           'active',
      };

      console.log('New subscription:', paymentInfo);

      // TODO: עדכן במסד נתונים
      // await prisma.subscription.create({
      //   data: {
      //     email:            paymentInfo.customerEmail,
      //     lsSubscriptionId: paymentInfo.subscriptionId,
      //     plan:             paymentInfo.plan,
      //     registrationCode: paymentInfo.registrationCode,
      //     waId:             paymentInfo.waId,
      //     status:           'active',
      //     nextBillingDate:  new Date(attributes.renews_at),
      //   }
      // });
    }

    // ─── מנוי בוטל ────────────────────────────────────────────────────
    if (eventName === 'subscription_cancelled') {
      const subscriptionId = data.data?.id;
      console.log('Subscription cancelled:', subscriptionId);

      // TODO:
      // await prisma.subscription.update({
      //   where: { lsSubscriptionId: subscriptionId },
      //   data: { status: 'cancelled' }
      // });
    }

    // ─── חידוש חיוב חודשי ─────────────────────────────────────────────
    if (eventName === 'subscription_payment_success') {
      const subscriptionId = attributes.subscription_id;
      console.log('Subscription renewed:', subscriptionId);

      // TODO:
      // await prisma.subscription.update({
      //   where: { lsSubscriptionId: subscriptionId },
      //   data: { nextBillingDate: new Date(attributes.next_payment_date) }
      // });
    }

    // ─── תשלום נכשל ───────────────────────────────────────────────────
    if (eventName === 'subscription_payment_failed') {
      const subscriptionId = attributes.subscription_id;
      console.log('Payment failed:', subscriptionId);

      // TODO: שלח התראה למשתמש
    }

    // תמיד החזר 200 כדי ש-LemonSqueezy לא ינסה שוב
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ received: true });
  }
}
