import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code, email, reason } = await req.json();
    if (!code) {
      return NextResponse.json({ message: 'Missing code' }, { status: 400 });
    }

    // שלח ל-n8n את הבקשה. שים את ה-URL של ה-webhook שלך:
    const n8nUrl = process.env.N8N_CANCEL_WEBHOOK_URL
      || 'https://n8n-TD2y.sliplane.app/webhook/cancel-subscription';

    const res = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        code,                      // registration_code בלבד
        email: email || null,
        reason: reason || null,
        // מטא שימושי:
        userAgent: req.headers.get('user-agent') || '',
        ip: req.headers.get('x-forwarded-for') || '',
        executionMode: process.env.NODE_ENV === 'production' ? 'production' : 'test',
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ message: data?.message || 'Cancel failed' }, { status: 500 });
    }

    return NextResponse.json({ message: data?.message || 'Cancellation processed' });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Unexpected error' }, { status: 500 });
  }
}
