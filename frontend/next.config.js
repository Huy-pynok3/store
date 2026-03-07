/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // CSP headers enabled for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://cdnjs.cloudflare.com",
              "frame-src 'self' https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://cdnjs.cloudflare.com",
              "connect-src 'self' https://challenges.cloudflare.com https://marketplace-backend-kpwq.onrender.com http://localhost:* http://127.0.0.1:* http://192.168.1.254:*",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
