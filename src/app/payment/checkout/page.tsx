/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // אפשר הטמעת iframe של Tranzila
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' https: data: blob:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "img-src 'self' data: https:",
              "font-src 'self' data: https:",
              "connect-src 'self' https:",
              "frame-src 'self' https://direct.tranzila.com",
              "child-src https://direct.tranzila.com",
              "frame-ancestors 'self'"
            ].join('; ')
          },
          // אופציונלי: אם יש לך X-Frame-Options אחר, אל תשים SAMEORIGIN
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          // לטובת Web Payments API, לא חובה אבל נחמד
          { key: 'Permissions-Policy', value: 'payment=(self "https://direct.tranzila.com")' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
