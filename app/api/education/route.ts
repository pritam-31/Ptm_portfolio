import { NextResponse } from 'next/server'
import { getEducation, saveEducation } from '@/lib/education-data'
import { requireAdmin } from '@/lib/admin-auth'
import { EducationItem } from '@/types'

const VALID_THEMES = ['cyan', 'violet', 'emerald']

function sanitizeInput(body: Record<string, unknown>) {
  const degree = String(body.degree ?? '').trim()
  const institution = String(body.institution ?? '').trim()
  const theme = VALID_THEMES.includes(String(body.theme)) ? (body.theme as EducationItem['theme']) : 'cyan'

  if (!degree || !institution) {
    throw new Error('Degree and institution are required')
  }

  return {
    degree,
    institution,
    period: String(body.period ?? '').trim(),
    score: String(body.score ?? '').trim(),
    theme,
  }
}

function handleError(error: unknown) {
  if (error instanceof Error && error.message === 'Unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (error instanceof Error && error.message === 'Degree and institution are required') {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  console.error('Education API error:', error)
  return NextResponse.json({ error: 'Failed to save education entry' }, { status: 500 })
}

export async function GET() {
  try {
    return NextResponse.json(await getEducation())
  } catch (error) {
    console.error('Get education error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = (await request.json()) as Record<string, unknown>
    const next: EducationItem = {
      id: crypto.randomUUID(),
      ...sanitizeInput(body),
    }
    const entries = [...(await getEducation()), next]
    await saveEducation(entries)
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
      return NextResponse.json({ error: 'Education id is required' }, { status: 400 })
    }
    const entries = await getEducation()
    const exists = entries.some((e) => e.id === id)
    if (!exists) {
      return NextResponse.json({ error: 'Education entry not found' }, { status: 404 })
    }
    const next = entries.map((entry) => (entry.id === id ? { id, ...sanitizeInput(body) } : entry))
    await saveEducation(next)
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
      return NextResponse.json({ error: 'Education id is required' }, { status: 400 })
    }
    const next = (await getEducation()).filter((entry) => entry.id !== id)
    await saveEducation(next)
    return NextResponse.json(next)
  } catch (error) {
    return handleError(error)
  }
}