// /app/api/start-trial/route.ts
import { NextRequest, NextResponse } from 'next/server'


interface TrialRequest {
  registration_code: string
  email: string
  full_name: string
  phone: string
  id_number: string
  plan: string
  billing: string
  price: number
  payment_token: string
  auth_transaction_id: string
  trial_start: string
  trial_end: string
  charge_date: string
  tranzila_response: any
}

export async function POST(request: NextRequest) {
  try {
    const body: TrialRequest = await request.json()
    
    console.log('Starting trial for user:', body.registration_code)
    
    // וידוא שדות חובה
    if (!body.registration_code || !body.payment_token || !body.email) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }
    
    // צור רשומת טריאל
    const trialRecord = {
      registration_code: body.registration_code,
      email: body.email,
      full_name: body.full_name,
      phone: body.phone,
      id_number: body.id_number,
      
      // פרטי תוכנית
      plan: body.plan,
      billing: body.billing,
      price: body.price,
      
      // פרטי טריאל
      status: 'trial_active',
      trial_start: new Date(body.trial_start),
      trial_end: new Date(body.trial_end),
      charge_date: new Date(body.charge_date),
      
      // טוקן ופרטי אישור
      payment_token: body.payment_token,
      auth_transaction_id: body.auth_transaction_id,
      
      // דגלים
      charged: false,
      cancelled: false,
      token_used: false,
      
      // מטה-דאטה
      created_at: new Date(),
      tranzila_auth_data: body.tranzila_response,
      
      // תזמון
      scheduled_charge_date: new Date(body.charge_date)
    }
    
    // שמור רשומת טריאל
    const insertResult = await trialsCollection.insertOne(trialRecord)
    
    // עדכן/צור רשומת משתמש
    await usersCollection.updateOne(
      { registration_code: body.registration_code },
      {
        $set: {
          email: body.email,
          full_name: body.full_name,
          phone: body.phone,
          plan: body.plan,
          status: 'trial_active',
          trial_end: new Date(body.trial_end),
          subscription_active: false,
          payment_token: body.payment_token,
          updated_at: new Date(),
          trial_id: insertResult.insertedId
        }
      },
      { upsert: true }
    )
    
    // שלח webhook ל-n8n להודעה על טריאל חדש
    try {
      await fetch(process.env.N8N_PLAN_UPDATE_WEBHOOK!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registration_code: body.registration_code,
          plan: body.plan,
          email: body.email,
          status: 'trial_active',
          trial_end: body.trial_end,
          charge_date: body.charge_date,
          action: 'trial_started',
          auth_transaction_id: body.auth_transaction_id
        })
      })
    } catch (webhookError) {
      console.error('Webhook error (non-critical):', webhookError)
    }
    
    await client.close()
    
    console.log('Trial started successfully:', body.registration_code)
    
    return NextResponse.json({
      success: true,
      message: 'Trial started successfully',
      trial_end: body.trial_end,
      charge_date: body.charge_date,
      trial_id: insertResult.insertedId
    })

  } catch (error) {
    console.error('Start trial error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
