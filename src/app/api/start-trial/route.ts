// /app/api/start-trial/route.ts - Webhook Version
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('=== START TRIAL REQUEST ===')
    console.log('Registration code:', body.registration_code)
    console.log('Has payment token:', !!body.payment_token)
    console.log('Email:', body.email)
    
    // וידוא שדות חובה
    if (!body.registration_code || !body.payment_token || !body.email) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }
    
    // בדיקה שה-webhook URL מוגדר
    if (!process.env.N8N_TRIAL_WEBHOOK) {
      console.error('N8N_TRIAL_WEBHOOK not configured')
      return NextResponse.json({
        success: false,
        error: 'Webhook not configured'
      }, { status: 500 })
    }
    
    // שלח ל-n8n webhook
    console.log('Sending to n8n webhook...')
    const webhookResponse = await fetch(process.env.N8N_TRIAL_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // כל הנתונים מה-request
        ...body,
        // הוסף timestamp
        timestamp: new Date().toISOString(),
        // סמן שזה trial start
        action: 'start_trial'
      })
    })
    
    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error('Webhook failed:', webhookResponse.status, errorText)
      throw new Error(`Webhook failed: ${webhookResponse.status}`)
    }
    
    const webhookResult = await webhookResponse.json()
    console.log('Webhook response:', webhookResult)
    
    // החזר תשובה ללקוח
    return NextResponse.json({
      success: true,
      message: 'Trial started successfully',
      ...webhookResult
    })
    
  } catch (error) {
    console.error('Start trial error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
