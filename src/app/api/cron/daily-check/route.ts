// /app/api/cron/daily-check/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // בדיקת authorization (אופציונלי)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting daily trial check...')
    
    // התחבר ל-MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    
    const db = client.db('yaya-assistant')
    const trialsCollection = db.collection('trials')
    
    // מצא טריאלים שהסתיימו היום
    const today = new Date()
    today.setHours(23, 59, 59, 999) // סוף היום
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0) // תחילת אתמול
    
    const expiredTrials = await trialsCollection.find({
      status: 'trial_active',
      charged: false,
      cancelled: false,
      trial_end: {
        $gte: yesterday,
        $lte: today
      }
    }).toArray()
    
    console.log(`Found ${expiredTrials.length} expired trials`)
    
    const results = {
      total: expiredTrials.length,
      successful: 0,
      failed: 0,
      errors: []
    }
    
    // עבור כל טריאל שהסתיים
    for (const trial of expiredTrials) {
      try {
        console.log(`Processing trial: ${trial.registration_code}`)
        
        // קרא ל-API לחיוב
        const chargeResponse = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/charge-trial`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CRON_SECRET}`
          },
          body: JSON.stringify({
            registration_code: trial.registration_code
          })
        })
        
        const chargeResult = await chargeResponse.json()
        
        if (chargeResult.success) {
          results.successful++
          console.log(`✅ Successfully charged: ${trial.registration_code}`)
        } else {
          results.failed++
          results.errors.push({
            registration_code: trial.registration_code,
            error: chargeResult.error
          })
          console.log(`❌ Failed to charge: ${trial.registration_code} - ${chargeResult.error}`)
        }
        
      } catch (error) {
        results.failed++
        results.errors.push({
          registration_code: trial.registration_code,
          error: error.message
        })
        console.error(`❌ Error processing ${trial.registration_code}:`, error)
      }
      
      // המתן קצת בין בקשות
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    await client.close()
    
    console.log('Daily check completed:', results)

    return NextResponse.json({
      success: true,
      message: 'Daily check completed',
      timestamp: new Date().toISOString(),
      results
    })

  } catch (error) {
    console.error('Daily check error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// GET endpoint לבדיקת סטטוס
export async function GET(request: NextRequest) {
  try {
    const client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    
    const db = client.db('yaya-assistant')
    const trialsCollection = db.collection('trials')
    
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const stats = {
      active_trials: await trialsCollection.countDocuments({
        status: 'trial_active',
        cancelled: false
      }),
      expiring_today: await trialsCollection.countDocuments({
        status: 'trial_active',
        cancelled: false,
        trial_end: {
          $gte: today,
          $lt: tomorrow
        }
      }),
      converted_subscriptions: await trialsCollection.countDocuments({
        status: 'converted_to_subscription'
      }),
      failed_charges: await trialsCollection.countDocuments({
        status: 'charge_failed'
      })
    }
    
    await client.close()
    
    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
