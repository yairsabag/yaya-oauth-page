import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { oauthCode, registrationCode } = await req.json()
    
    // קבלת tokens מGoogle
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code: oauthCode,
        grant_type: 'authorization_code',
        redirect_uri: process.env.OAUTH_REDIRECT_URI!,
      }),
    })
    
    const tokens = await tokenResponse.json()
    
    // קבלת פרטי משתמש
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    
    const userInfo = await userResponse.json()
    
    // שליחה לn8n עם הקישור
    await fetch('https://yairsabag.app.n8n.cloud/webhook-test/link-accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'link_accounts',
        registrationCode,
        email: userInfo.email,
        name: userInfo.name,
        timestamp: new Date().toISOString(),
      }),
    })
    
    return NextResponse.json({ success: true, userInfo })
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.json({ error: 'OAuth processing failed' }, { status: 500 })
  }
}
