// /app/api/cron/daily-check/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// יצירת connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function POST(request: NextRequest) {
  try {
    // בדיקת authorization (אופציונלי)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting daily trial check...')
    
    const client = await pool.connect()
    
    try {
      // מצא טריאלים שהסתיימו היום
      const today = new Date()
      today.setHours(23, 59, 59, 999) // סוף היום
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0) // תחילת אתמול
      
      const expiredTrialsQuery = `
        SELECT * FROM users 
        WHERE subscription_status = 'trial_active'
        AND payment_token IS NOT NULL
        AND trial_end >= $1 
        AND trial_end <= $2
      `
      
      const expiredTrialsResult = await client.query(expiredTrialsQuery, [yesterday, today])
      const expiredTrials = expiredTrialsResult.rows
      
      console.log(`Found ${expiredTrials.length} expired trials`)
      
      const results = {
        total: expiredTrials.length,
        successful: 0,
        failed: 0,
        errors: [] as any[]
      }
      
      // עבור כל טריאל שהסתיים
      for (const trial of expiredTrials) {
        try {
          console.log(`Processing trial: ${trial.registration_code}`)
          
          // קרא ל-API לחיוב
          const chargeResponse = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN || 'https://yayagent.com'}/api/charge-trial`, {
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
            
            // עדכן סטטוס בDB
            await client.query(
              `UPDATE users 
               SET subscription_status = 'active',
                   last_charge_date = CURRENT_TIMESTAMP
               WHERE registration_code = $1`,
              [trial.registration_code]
            )
          } else {
            results.failed++
            results.errors.push({
              registration_code: trial.registration_code,
              error: chargeResult.error
            })
            console.log(`❌ Failed to charge: ${trial.registration_code} - ${chargeResult.error}`)
            
            // עדכן סטטוס לכשלון
            await client.query(
              `UPDATE users 
               SET subscription_status = 'charge_failed'
               WHERE registration_code = $1`,
              [trial.registration_code]
            )
          }
          
        } catch (error: any) {
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
      
      console.log('Daily check completed:', results)
      
      return NextResponse.json({
        success: true,
        message: 'Daily check completed',
        timestamp: new Date().toISOString(),
        results
      })
      
    } finally {
      client.release()
    }

  } catch (error: any) {
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
    const client = await pool.connect()
    
    try {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      // סטטיסטיקות
      const activeTrialsResult = await client.query(
        `SELECT COUNT(*) FROM users 
         WHERE subscription_status = 'trial_active'`
      )
      
      const expiringTodayResult = await client.query(
        `SELECT COUNT(*) FROM users 
         WHERE subscription_status = 'trial_active'
         AND trial_end >= $1 
         AND trial_end < $2`,
        [today, tomorrow]
      )
      
      const convertedResult = await client.query(
        `SELECT COUNT(*) FROM users 
         WHERE subscription_status = 'active'`
      )
      
      const failedResult = await client.query(
        `SELECT COUNT(*) FROM users 
         WHERE subscription_status = 'charge_failed'`
      )
      
      const stats = {
        active_trials: parseInt(activeTrialsResult.rows[0].count),
        expiring_today: parseInt(expiringTodayResult.rows[0].count),
        converted_subscriptions: parseInt(convertedResult.rows[0].count),
        failed_charges: parseInt(failedResult.rows[0].count)
      }
      
      return NextResponse.json({
        success: true,
        stats,
        timestamp: new Date().toISOString()
      })
      
    } finally {
      client.release()
    }
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
