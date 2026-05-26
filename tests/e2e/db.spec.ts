// Direct behavior tests for the admin route handlers' database operations.
// Auth gating is covered by admin.spec.ts; this file covers what happens
// after auth: markSubmissionRead, softDeleteSubmission, and the soft-delete
// exclusion in getAllSubmissions. Tests import lib/db directly rather than
// going through the HTTP API, which would require a CF Access JWT.
import { test, expect } from '@playwright/test'
import {
  insertSubmission,
  markSubmissionRead,
  softDeleteSubmission,
  getAllSubmissions,
} from '../../lib/db'

function uniqueId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function makeSubmission(id: string) {
  return {
    id,
    name: 'DB Test',
    email: 'dbtest@example.com',
    message: 'Submission written by the db behavior spec.',
    createdAt: new Date().toISOString(),
    ip: '127.0.0.1',
  }
}

test.describe('admin db behavior', () => {
  test('markSubmissionRead sets read_at on the matching row', () => {
    const id = uniqueId('read')
    insertSubmission(makeSubmission(id))

    const before = getAllSubmissions().find((s) => s.id === id)
    expect(before).toBeDefined()
    expect(before?.readAt).toBeNull()

    markSubmissionRead(id)

    const after = getAllSubmissions().find((s) => s.id === id)
    expect(after?.readAt).not.toBeNull()
    expect(typeof after?.readAt).toBe('string')
  })

  test('softDeleteSubmission sets deleted_at and excludes the row from the default query', () => {
    const id = uniqueId('del')
    insertSubmission(makeSubmission(id))

    expect(getAllSubmissions().find((s) => s.id === id)).toBeDefined()

    softDeleteSubmission(id)

    expect(getAllSubmissions().find((s) => s.id === id)).toBeUndefined()

    const includedWithFlag = getAllSubmissions({ includeDeleted: true }).find((s) => s.id === id)
    expect(includedWithFlag).toBeDefined()
    expect(includedWithFlag?.deletedAt).not.toBeNull()
  })
})
