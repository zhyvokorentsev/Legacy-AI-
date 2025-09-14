/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // App directory is now stable in Next.js 14
  },
  images: {
    domains: [
      'localhost',
      'trae-api-us.mchost.guru',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
  },
  // Accessibility optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Performance optimizations for older devices
  swcMinify: true,
  poweredByHeader: false,
  // Remove static export settings for Vercel deployment
  trailingSlash: false,
}

module.exports = nextConfig