import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const params = url.searchParams

  // יעד הניווט מחוץ ל-iframe (דף ה-success שלך)
  const target = new URL('/payment/success', url.origin)
  params.forEach((v, k) => target.searchParams.set(k, v))

  // HTML קטן שרץ בתוך ה-iframe ומנווט את החלון הראשי
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Redirecting…</title></head>
<body>
<script>
  try {
    window.top.location.href = ${JSON.stringify(target.toString())};
  } catch(e) {
    window.open(${JSON.stringify(target.toString())}, '_top');
  }
</script>
<p style="font-family: system-ui, -apple-system, Segoe UI, sans-serif">
  Redirecting to success page…
</p>
</body></html>`

  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
