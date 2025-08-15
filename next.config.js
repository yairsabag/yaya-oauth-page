// FILE: next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      { protocol: "https", hostname: "source.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "ext.same-assets.com", pathname: "/**" },
      { protocol: "https", hostname: "ugc.same-assets.com", pathname: "/**" },
    ],
  },

  // כותרות אבטחה כדי לאפשר הטמעת iframe של טרנזילה
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self' https: data: blob:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "img-src 'self' data: https:",
              "font-src 'self' data: https:",
              "connect-src 'self' https:",
              "frame-src 'self' https://direct.tranzila.com",
              "child-src https://direct.tranzila.com",
              "frame-ancestors 'self'",
            ].join("; "),
          },
          // אם יש כותרת שונה ב-CDN/שרת – הסר אותה שם או השאר כאן ALLOWALL
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Permissions-Policy", value: 'payment=(self "https://direct.tranzila.com")' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
