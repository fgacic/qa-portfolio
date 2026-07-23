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
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[#8a8699] shadow-sm hover:bg-white/10 hover:text-[#e8e6f0] hover:shadow-md transition-all"
              >
                Mark read
              </button>
            )}
            <button
              onClick={handleDelete}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-400/20 bg-red-400/10 text-red-400/80 shadow-sm hover:bg-red-400/20 hover:text-red-400 hover:shadow-md transition-all"
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
