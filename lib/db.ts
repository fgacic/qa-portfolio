import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
fs.mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(path.join(DATA_DIR, 'db.sqlite'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    message    TEXT NOT NULL,
    created_at TEXT NOT NULL,
    ip         TEXT NOT NULL
  )
`)

try { db.exec('ALTER TABLE submissions ADD COLUMN read_at TEXT') } catch { /* column exists */ }
try { db.exec('ALTER TABLE submissions ADD COLUMN deleted_at TEXT') } catch { /* column exists */ }

export interface Submission {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
  ip: string
  readAt: string | null
  deletedAt: string | null
}

const _insert = db.prepare(
  `INSERT INTO submissions (id, name, email, message, created_at, ip)
   VALUES (@id, @name, @email, @message, @createdAt, @ip)`
)

const _selectAll = db.prepare(
  `SELECT id, name, email, message, created_at AS createdAt, ip,
          read_at AS readAt, deleted_at AS deletedAt
   FROM submissions WHERE deleted_at IS NULL ORDER BY created_at DESC`
)

const _selectAllIncludeDeleted = db.prepare(
  `SELECT id, name, email, message, created_at AS createdAt, ip,
          read_at AS readAt, deleted_at AS deletedAt
   FROM submissions ORDER BY created_at DESC`
)

const _markRead = db.prepare(
  `UPDATE submissions SET read_at = ? WHERE id = ? AND read_at IS NULL`
)

const _softDelete = db.prepare(
  `UPDATE submissions SET deleted_at = ? WHERE id = ?`
)

export function insertSubmission(sub: Omit<Submission, 'readAt' | 'deletedAt'>): void {
  _insert.run(sub)
}

export function getAllSubmissions(opts?: { includeDeleted?: boolean }): Submission[] {
  if (opts?.includeDeleted) return _selectAllIncludeDeleted.all() as Submission[]
  return _selectAll.all() as Submission[]
}

export function markSubmissionRead(id: string): void {
  _markRead.run(new Date().toISOString(), id)
}

export function softDeleteSubmission(id: string): void {
  _softDelete.run(new Date().toISOString(), id)
}
