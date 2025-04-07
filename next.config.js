/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['replicate.com'],
  },
  // Environment variables setup
  env: {
    // No client-side exposed variables here
  },
  // Server-side only environment variables
  serverRuntimeConfig: {
    // Server-only secret keys
    replicateApiToken: process.env.REPLICATE_API_TOKEN,
  },
  // Shared environment variables (avoid secrets here)
  publicRuntimeConfig: {
    // Public variables can go here
  },
  // Optimized output for efficient deployment
  output: 'standalone',
  // Performance optimization settings
  swcMinify: true,
  poweredByHeader: false,
}

module.exports = nextConfig 