import { NextResponse } from 'next/server'

function htmlRedirect(to: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Redirecting…</title></head>
<body>
<script>
  (function () {
    try { window.top.location.href = ${JSON.stringify(to)}; }
    catch (e) { window.open(${JSON.stringify(to)}, '_top'); }
  })();
</script>
<p style="font-family: system-ui, -apple-system, Segoe UI, sans-serif">
  Redirecting to success page…
</p>
</body></html>`
}

function buildTarget(origin: string, params: URLSearchParams) {
  const target = new URL('/payment/success', origin)
  // העבר את כל הפרמטרים כפי שהגיעו, בנוסף לאלו שאתה מוסיף ידנית ב-checkout
  params.forEach((v, k) => target.searchParams.set(k, v))
  return target.toString()
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const html = htmlRedirect(buildTarget(url.origin, url.searchParams))
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export async function POST(req: Request) {
  const url = new URL(req.url)
  const contentType = req.headers.get('content-type') || ''
  const params = new URLSearchParams()

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const bodyText = await req.text()
    new URLSearchParams(bodyText).forEach((v, k) => params.set(k, v))
  } else if (contentType.includes('application/json')) {
    const json = await req.json().catch(() => ({}))
    Object.entries(json || {}).forEach(([k, v]) => params.set(k, String(v)))
  } else {
    // best effort – אין גוף? עדיין נפנה
  }

  const html = htmlRedirect(buildTarget(url.origin, params))
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
