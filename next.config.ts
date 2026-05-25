import { execSync } from 'node:child_process'
import type { NextConfig } from 'next'

function resolveGitBranch(): string {
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim() || 'main'
  } catch {
    return 'main'
  }
}

const config: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: true,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  env: {
    GIT_BRANCH: resolveGitBranch(),
  },
}

export default config
