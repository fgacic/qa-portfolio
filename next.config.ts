import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: true,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default config
