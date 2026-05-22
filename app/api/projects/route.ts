import { NextRequest } from 'next/server'
import { PROJECTS } from '@/lib/projects'

export function GET(req: NextRequest) {
  const tag = req.nextUrl.searchParams.get('tag')
  const projects = tag
    ? PROJECTS.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
    : PROJECTS
  return Response.json({ projects })
}
