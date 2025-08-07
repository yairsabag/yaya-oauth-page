// /app/api/check-env/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    hasApiKey: !!process.env.TRANZILA_API_APP_KEY,
    hasSecret: !!process.env.TRANZILA_API_SECRET,
    hasTerminal: !!process.env.TRANZILA_TERMINAL,
    terminal: process.env.TRANZILA_TERMINAL,
    // אל תחשוף את המפתחות עצמם!
    apiKeyLength: process.env.TRANZILA_API_APP_KEY?.length || 0,
    secretLength: process.env.TRANZILA_API_SECRET?.length || 0
  });
}
