// app/api/google/authorize/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const state = searchParams.get('state') || '' // קוד משתמש

  // כתובת החזרה כפי שסיכמנו ל-n8n
  const redirectUri = 'https://n8n-td2y.sliplane.app/webhook/google-oauth-callback'

  const google = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  google.searchParams.set('client_id', '314964896562-o93h71h2cpiqgcikaqeg2a34ht2ipl2j.apps.googleusercontent.com')
  google.searchParams.set('redirect_uri', redirectUri)
  google.searchParams.set('response_type', 'code')
  google.searchParams.set('scope', 'openid email https://www.googleapis.com/auth/calendar')
  google.searchParams.set('state', state)        // חשוב: כדי לשייך את החשבון למשתמש
  google.searchParams.set('access_type', 'offline')
  google.searchParams.set('prompt', 'consent')

  return NextResponse.redirect(google.toString(), 302)
}
