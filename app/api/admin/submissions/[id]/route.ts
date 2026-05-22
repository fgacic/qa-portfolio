import { NextRequest } from 'next/server'
import { markSubmissionRead, softDeleteSubmission } from '@/lib/db'
import { requireCfAccess } from '@/lib/cfAccess'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireCfAccess(req)
  if (authResult instanceof Response) return authResult

  const { id } = await params
  const body = await req.json().catch(() => ({}))

  if (body.read === true) {
    markSubmissionRead(id)
  }

  return Response.json({ ok: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireCfAccess(req)
  if (authResult instanceof Response) return authResult

  const { id } = await params
  softDeleteSubmission(id)

  return Response.json({ ok: true })
}
