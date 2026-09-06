import { NextResponse } from 'next/server'
import { getContent, saveContent } from '@/lib/content-data'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  try {
    return NextResponse.json(await getContent())
  } catch (error) {
    console.error('Get content error:', error)
    return NextResponse.json({ error: 'Unable to load content' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin()
    const body = (await request.json()) as Parameters<typeof saveContent>[0]
    const merged = await saveContent(body)
    return NextResponse.json(merged)
  } catch (error) {
    console.error('Save content error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}