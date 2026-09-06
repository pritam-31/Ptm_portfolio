import { NextResponse } from 'next/server'
import { getSkills, publicSkill } from '@/lib/skill-data'

export async function GET() {
  try {
    const skills = await getSkills()
    const enabled = skills
      .filter((s) => s.enabled)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(publicSkill)
    return NextResponse.json(enabled)
  } catch (error) {
    console.error('Get skills error:', error)
    return NextResponse.json({ error: 'Unable to load skills' }, { status: 500 })
  }
}
