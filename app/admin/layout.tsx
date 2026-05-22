import { verifyCfAccessJwt } from '@/lib/cfAccess'
import { headers } from 'next/headers'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers()

  const req = new Request('http://localhost', { headers: headerStore })

  let email = 'unknown'
  try {
    const result = await verifyCfAccessJwt(req)
    email = result.email
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#8a8699]">
        <p>Unauthorized</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-[#12121a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-semibold tracking-tight text-[#818cf8]">fgacic admin</span>
          <div className="flex items-center gap-4 text-sm text-[#8a8699]">
            <span>{email}</span>
            <a
              href="/cdn-cgi/access/logout"
              className="text-[#8a8699] hover:text-[#e8e6f0] transition-colors"
            >
              Sign out
            </a>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
