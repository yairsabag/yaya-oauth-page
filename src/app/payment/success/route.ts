import { NextRequest, NextResponse } from 'next/server'

// Tranzila לעתים מחזירה POST לכתובת ההצלחה.
// כאן אנו ממירים את ה־POST ל־GET עם אותם פרמטרים בדיוק.
export async function POST(req: NextRequest) {
  // ה-URL כבר מכיל את ה-query (plan, email, price, code, וכו')
  const url = new URL(req.url)
  // 303 אומר לדפדפן לבצע GET על אותה כתובת
  return NextResponse.redirect(url, 303)
}

// אופציונלי – אם יש בדיקות מקדימות של הדפדפן
export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 })
}

// GET נשאר מטופל ע"י /payment/success/page.tsx כרגיל
