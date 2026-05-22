import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'

// Never allow bypass in prod even if env var leaks
const DEV_BYPASS =
  process.env.ADMIN_DEV_BYPASS === 'true' && process.env.NODE_ENV !== 'production'

let cachedJwks: ReturnType<typeof createRemoteJWKSet> | null = null
let cachedJwksFor: string | null = null

function getJwks(domain: string) {
  if (cachedJwks && cachedJwksFor === domain) return cachedJwks
  cachedJwks = createRemoteJWKSet(new URL(`https://${domain}/cdn-cgi/access/certs`))
  cachedJwksFor = domain
  return cachedJwks
}

export async function verifyCfAccessJwt(req: Request | NextRequest): Promise<{ email: string }> {
  if (DEV_BYPASS) return { email: 'dev@local' }

  const domain = process.env.CF_ACCESS_TEAM_DOMAIN
  const aud = process.env.CF_ACCESS_AUD
  if (!domain || !aud) throw new Error('CF_ACCESS_TEAM_DOMAIN and CF_ACCESS_AUD must be set')

  const token = req.headers.get('cf-access-jwt-assertion')
  if (!token) throw new Error('Missing Cf-Access-Jwt-Assertion header')

  const { payload } = await jwtVerify(token, getJwks(domain), {
    audience: aud,
    issuer: `https://${domain}`,
  })

  if (typeof payload.email !== 'string' || payload.email.length === 0) {
    throw new Error('JWT payload missing email claim')
  }
  return { email: payload.email }
}

export async function requireCfAccess(
  req: Request | NextRequest
): Promise<{ email: string } | Response> {
  try {
    return await verifyCfAccessJwt(req)
  } catch {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }
}
