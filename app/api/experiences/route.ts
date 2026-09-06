import { NextResponse } from 'next/server'
import { getExperience, saveExperience } from '@/lib/experience-data'
import { requireAdmin } from '@/lib/admin-auth'
import { Experience } from '@/types'

const VALID_TYPES = ['internship', 'work', 'hackathon', 'project']

function sanitizeInput(body: Record<string, unknown>) {
  const role = String(body.role ?? '').trim()
  const company = String(body.company ?? '').trim()
  if (!role || !company) {
    throw new Error('Role and company are required')
  }

  return {
    role,
    company,
    location: String(body.location ?? '').trim(),
    period: String(body.period ?? '').trim(),
    duration: String(body.duration ?? '').trim(),
    type: (VALID_TYPES.includes(String(body.type)) ? body.type : 'project') as Experience['type'],
    highlights: Array.isArray(body.highlights)
      ? (body.highlights as string[]).map((item) => String(item).trim()).filter(Boolean)
      : [],
    technologies: Array.isArray(body.technologies)
      ? (body.technologies as string[]).map((item) => String(item).trim()).filter(Boolean)
      : [],
  }
}

function handleError(error: unknown) {
  if (error instanceof Error && error.message === 'Unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (error instanceof Error && error.message === 'Role and company are required') {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  console.error('Experience API error:', error)
  return NextResponse.json({ error: 'Failed to save experience entry' }, { status: 500 })
}

export async function GET() {
  try {
    return NextResponse.json(await getExperience())
  } catch (error) {
    console.error('Get experience error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = (await request.json()) as Record<string, unknown>
    const next: Experience = {
      id: crypto.randomUUID(),
      ...sanitizeInput(body),
    }
    const entries = [...(await getExperience()), next]
    await saveExperience(entries)
    return NextResponse.json(entries, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin()
    const body = (await request.json()) as Record<string, unknown>
    const id = String(body.id ?? '').trim()
    if (!id) {
      return NextResponse.json({ error: 'Experience id is required' }, { status: 400 })
    }
    const entries = await getExperience()
    const exists = entries.some((entry) => entry.id === id)
    if (!exists) {
      return NextResponse.json({ error: 'Experience entry not found' }, { status: 404 })
    }
    const next = entries.map((entry) => (entry.id === id ? { id, ...sanitizeInput(body) } : entry))
    await saveExperience(next)
    return NextResponse.json(next)
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Experience id is required' }, { status: 400 })
    }
    const next = (await getExperience()).filter((entry) => entry.id !== id)
    await saveExperience(next)
    return NextResponse.json(next)
  } catch (error) {
    return handleError(error)
  }
}