/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['logo.clearbit.com', 'finnhub.io'],
  },
  // Performance optimizations
  swcMinify: true,
  compress: true,
  // Production optimizations
  poweredByHeader: false,
  generateEtags: true,
  // Better build output
  output: 'standalone',
}

module.exports = nextConfig
