// FILE: src/app/api/tranzila/success-bridge/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  return NextResponse.redirect(new URL(`/payment/success?${url.searchParams.toString()}`, url.origin))
}

export async function POST(req: NextRequest) {
  // טרנזילה שולחת בד"כ x-www-form-urlencoded; formData יתפוס גם את זה
  const form = await req.formData()
  const qs = new URLSearchParams()
  for (const [k, v] of form.entries()) qs.append(k, String(v))
  const url = new URL(req.url)
  return NextResponse.redirect(new URL(`/payment/success?${qs.toString()}`, url.origin))
}
