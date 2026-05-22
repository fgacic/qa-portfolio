'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Submission } from '@/lib/db'

export default function SubmissionRow({ submission }: { submission: Submission }) {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  const date = new Date(submission.createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const preview =
    submission.message.length > 80
      ? submission.message.slice(0, 80) + '…'
      : submission.message

  async function handleMarkRead(e: React.MouseEvent) {
    e.stopPropagation()
    await fetch(`/api/admin/submissions/${submission.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ read: true }),
      headers: { 'content-type': 'application/json' },
    })
    router.refresh()
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!window.confirm('Delete this submission?')) return
    await fetch(`/api/admin/submissions/${submission.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
      >
        <td className="px-4 py-3 text-[#8a8699] whitespace-nowrap">{date}</td>
        <td className="px-4 py-3 font-medium">{submission.name}</td>
        <td className="px-4 py-3">
          <a
            href={`mailto:${submission.email}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[#818cf8] hover:underline"
          >
            {submission.email}
          </a>
        </td>
        <td className="px-4 py-3 text-[#8a8699] max-w-xs truncate">{preview}</td>
        <td className="px-4 py-3">
          {submission.readAt === null ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#6366f1]/20 text-[#818cf8]">
              Unread
            </span>
          ) : null}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {submission.readAt === null && (
              <button
                onClick={handleMarkRead}
                className="text-xs text-[#8a8699] hover:text-[#e8e6f0] transition-colors"
              >
                Mark read
              </button>
            )}
            <button
              onClick={handleDelete}
              className="text-xs text-red-400/70 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-white/5 bg-white/3">
          <td colSpan={6} className="px-4 py-4">
            <p className="text-[#e8e6f0]/80 leading-relaxed whitespace-pre-wrap">{submission.message}</p>
          </td>
        </tr>
      )}
    </>
  )
}
