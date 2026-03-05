/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static page generation to avoid prerender errors
  // when API is not available during build
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  
  // Allow external images
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
}

module.exports = nextConfig
