// /app/api/test-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const appKey = process.env.TRANZILA_API_APP_KEY!;
    const secretKey = process.env.TRANZILA_API_SECRET!;
    const nonce = crypto.randomBytes(20).toString('hex');
    const timestamp = Date.now().toString();
    
    // הבעיה כנראה בסדר - צריך להיות: secret + timestamp + nonce
    const dataToSign = secretKey + timestamp + nonce;
    
    // יצירת HMAC-SHA256 עם base64 encoding (לא hex!)
    const accessToken = crypto
      .createHmac('sha256', secretKey) // שים לב: המפתח הסודי הוא ה-key של HMAC
      .update(dataToSign)
      .digest('base64'); // base64, לא hex!
    
    return NextResponse.json({
      nonce,
      timestamp,
      accessToken,
      test: 'This is just for testing auth'
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
