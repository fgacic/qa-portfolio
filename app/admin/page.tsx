import { verifyCfAccessJwt } from '@/lib/cfAccess'
import { getAllSubmissions } from '@/lib/db'
import { headers } from 'next/headers'
import SubmissionRow from '@/components/admin/SubmissionRow'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const headerStore = await headers()
  const req = new Request('http://localhost', { headers: headerStore })
  await verifyCfAccessJwt(req)

  const submissions = getAllSubmissions()

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Submissions</h1>

      {submissions.length === 0 ? (
        <p className="text-[#8a8699]">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[#8a8699] text-left">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Preview</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <SubmissionRow key={submission.id} submission={submission} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
