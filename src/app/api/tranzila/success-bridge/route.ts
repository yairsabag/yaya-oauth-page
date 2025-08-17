// app/api/tranzila/success-bridge/route.ts
import { NextRequest } from 'next/server'

function pick(params: URLSearchParams, key: string) {
  // תמיכה גם ב־amp;key (בגלל קידוד HTML)
  return params.get(key) ?? params.get(`amp;${key}`) ?? undefined
}

function parseContactToNames(contact?: string) {
  if (!contact) return { firstName: '', lastName: '' }
  const parts = contact.trim().split(/\s+/)
  const firstName = parts.shift() ?? ''
  const lastName = parts.join(' ')
  return { firstName, lastName }
}

export async function POST(req: NextRequest) {
  const text = await req.text() // Tranzila שולחת form-urlencoded
  const body = new URLSearchParams(text)

  // מה ששלחנו לטרנזילה — חוזר אלינו:
  const code    = pick(body, 'u1') || pick(body, 'uid') || pick(body, 'code') || ''
  const plan    = pick(body, 'u2') || pick(body, 'plan') || ''
  const billing = pick(body, 'u3') || pick(body, 'billing') || 'monthly'
  const price   = pick(body, 'u4') || pick(body, 'price') || ''
  const email   = pick(body, 'email') || ''
  const contact = pick(body, 'contact') || ''
  const { firstName, lastName } = parseContactToNames(contact)

  // נבנה URL ל־/payment/success עם query נקי וברור
  const dest = new URL('/payment/success', req.nextUrl.origin)
  if (code)    dest.searchParams.set('code', code)
  if (plan)    dest.searchParams.set('plan', plan)
  if (billing) dest.searchParams.set('billing', billing)
  if (price)   dest.searchParams.set('price', price)
  if (email)   dest.searchParams.set('email', email)
  if (firstName) dest.searchParams.set('firstName', firstName)
  if (lastName)  dest.searchParams.set('lastName', lastName)

  return Response.redirect(dest.toString(), 302)
}

// אופציונלי: אם מישהו יגיע ב־GET (למקרה שמוגדר אצלכם כ־GET)
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams
  const dest = new URL('/payment/success', req.nextUrl.origin)
  q.forEach((v, k) => dest.searchParams.set(k, v))
  return Response.redirect(dest.toString(), 302)
}
