// src/app/api/cancel/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, email, reason } = await req.json();
    if (!code) return NextResponse.json({ message: 'Missing code' }, { status: 400 });

    const n8nUrl = process.env.N8N_CANCEL_WEBHOOK_URL
      || 'https://n8n-TD2y.sliplane.app/webhook/cancel-subscription';

    const r = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, email: email || null, reason: reason || null }),
      cache: 'no-store',
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) return NextResponse.json({ message: data?.message || 'Cancel failed' }, { status: 500 });

    return NextResponse.json({ message: data?.message || 'Cancellation processed' });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
