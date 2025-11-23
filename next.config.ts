import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ]
  },
  turbopack: {
    root: __dirname
  },
  allowedDevOrigins: ['test.ishowfinance.com']
}
const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)