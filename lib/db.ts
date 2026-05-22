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

export interface Submission {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
  ip: string
}

const _insert = db.prepare(
  `INSERT INTO submissions (id, name, email, message, created_at, ip)
   VALUES (@id, @name, @email, @message, @createdAt, @ip)`
)

const _selectAll = db.prepare(
  `SELECT id, name, email, message, created_at AS createdAt, ip
   FROM submissions ORDER BY created_at DESC`
)

export function insertSubmission(sub: Submission): void {
  _insert.run(sub)
}

export function getAllSubmissions(): Submission[] {
  return _selectAll.all() as Submission[]
}
