/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production'

function buildCsp() {
  const base = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    // Allow inline styles from our app and CSS-in-JS; prefer to remove 'unsafe-inline' when feasible
    "style-src 'self' 'unsafe-inline'",
    // Images and fonts
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    // XHR/fetch/websocket endpoints (adjust API origin as needed)
    `connect-src 'self' http://localhost:3001 http://localhost:3000 ws://localhost:3000`,
    // Framing and form targets
    "frame-ancestors 'self'",
    "form-action 'self'",
  ]

  // Scripts: dev builds need eval and often inline scripts for HMR/source maps
  if (isDev) {
    base.splice(4, 0, "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:")
  } else {
    base.splice(4, 0, "script-src 'self'")
  }

  return base.join('; ')
}

const securityHeaders = [
  { key: 'Content-Security-Policy', value: buildCsp() },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // HSTS is effective only over HTTPS; safe to set for production deployments
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
]

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
