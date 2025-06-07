import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { oauthCode, registrationCode } = await req.json()
    
    console.log('OAuth callback received:', { oauthCode: !!oauthCode, registrationCode })
    
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
    console.log('Token response:', tokens)
    
    if (!tokens.access_token) {
      console.error('No access token received')
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 400 })
    }
    
    // קבלת פרטי משתמש
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    
    const userInfo = await userResponse.json()
    console.log('User info received:', userInfo)
    
    if (!userInfo.email) {
      console.error('No email received from Google')
      return NextResponse.json({ error: 'No email received' }, { status: 400 })
    }
    
    // שליחה לn8n עם הקישור
    try {
      const webhookResponse = await fetch(process.env.N8N_WEBHOOK_URL + '/link-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'link_accounts',
          registrationCode,
          email: userInfo.email,
          name: userInfo.name,
          googleTokens: tokens,
          timestamp: new Date().toISOString(),
        }),
      })
      
      console.log('n8n webhook response:', webhookResponse.status)
    } catch (webhookError) {
      console.error('Webhook error (non-critical):', webhookError)
      // לא נכשל את כל התהליך בגלל webhook
    }
    
    return NextResponse.json({ 
      success: true, 
      userInfo: {
        email: userInfo.email,
        name: userInfo.name,
        registrationCode: registrationCode,
      }
    })
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.json({ 
      error: 'OAuth processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
