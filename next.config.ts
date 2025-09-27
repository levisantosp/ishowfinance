import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      }
    ]
  },
  turbopack: {
    root: __dirname
  }
}
const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)