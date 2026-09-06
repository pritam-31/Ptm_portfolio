import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getSkills, saveSkills, nowISO, slugify } from '@/lib/skill-data'
import { normalizeSkillInput, normalizeTechnologies } from '@/lib/skill-validation'
import { SkillCategory } from '@/types'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET() {
  try {
    await requireAdmin()
    const skills = await getSkills()
    return NextResponse.json(skills)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized()
    return NextResponse.json({ error: 'Failed to load skills' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const { error, data } = normalizeSkillInput(body)
    if (error || !data) return NextResponse.json({ error }, { status: 400 })

    const techResult = normalizeTechnologies(body.technologies)
    if (techResult.error) return NextResponse.json({ error: techResult.error }, { status: 400 })

    const skills = await getSkills()

    if (skills.some((s) => s.name.toLowerCase() === data.name.toLowerCase())) {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 })
    }

    const now = nowISO()
    const category: SkillCategory = {
      id: crypto.randomUUID(),
      slug: slugify(data.name),
      technologies: techResult.data,
      createdAt: now,
      updatedAt: now,
      ...data,
    }

    const next = [...skills, category].sort((a, b) => a.displayOrder - b.displayOrder)
    await saveSkills(next)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized()
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Category id is required' }, { status: 400 })

    const skills = await getSkills()
    const index = skills.findIndex((s) => s.id === id)
    if (index === -1) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

    const body = await request.json()
    const current = skills[index]

    const name = body.name !== undefined ? String(body.name).trim() : current.name
    if (!name) return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    const score = body.score !== undefined ? Number(body.score) : current.score
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      return NextResponse.json({ error: 'Score must be a number between 0 and 100' }, { status: 400 })
    }

    const up: Partial<SkillCategory> = {
      name,
      slug: name !== current.name ? slugify(name) : current.slug,
      score,
      description: body.description !== undefined ? String(body.description).trim() : current.description,
      icon: body.icon !== undefined ? String(body.icon).trim() : current.icon,
      color: body.color !== undefined ? String(body.color).trim() : current.color,
      displayOrder: body.displayOrder !== undefined && Number.isFinite(Number(body.displayOrder)) ? Number(body.displayOrder) : current.displayOrder,
      enabled: body.enabled !== undefined ? body.enabled !== false : current.enabled,
    }

    if (Array.isArray(body.technologies)) {
      const techResult = normalizeTechnologies(body.technologies)
      if (techResult.error) return NextResponse.json({ error: techResult.error }, { status: 400 })
      up.technologies = techResult.data
    }

    const updated: SkillCategory = { ...current, ...up, updatedAt: nowISO() }
    skills[index] = updated
    await saveSkills(skills)
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized()
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Category id is required' }, { status: 400 })

    const skills = await getSkills()
    const next = skills.filter((s) => s.id !== id)
    if (next.length === skills.length) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    await saveSkills(next)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized()
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()

    if (body.action === 'reorder' && Array.isArray(body.ids)) {
      const skills = await getSkills()
      const orderMap = new Map(body.ids.map((id: string, i: number) => [id, i]))
      const missing = skills.some((s) => !orderMap.has(s.id))
      if (missing) return NextResponse.json({ error: 'Invalid reorder payload' }, { status: 400 })

      const next = skills
        .map((s) => ({ ...s, displayOrder: Number(orderMap.get(s.id)), updatedAt: nowISO() }))
        .sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder))
      await saveSkills(next)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized()
    return NextResponse.json({ error: 'Failed to reorder categories' }, { status: 500 })
  }
}
