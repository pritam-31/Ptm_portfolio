import { SkillCategory } from '@/types'

export type PublicSkill = {
  id: string
  name: string
  slug: string
  score: number
  description: string
  icon: string
  color: string
  technologies: { id: string; name: string; icon?: string }[]
}

export async function fetchPublicSkills(): Promise<PublicSkill[]> {
  const res = await fetch('/api/skills', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load skills')
  return res.json()
}

export async function fetchAdminSkills(): Promise<SkillCategory[]> {
  const res = await fetch('/api/admin/skills', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load admin skills')
  return res.json()
}

export async function createSkillCategory(input: Partial<SkillCategory>): Promise<SkillCategory> {
  const res = await fetch('/api/admin/skills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create category')
  return data
}

export async function updateSkillCategory(id: string, input: Partial<SkillCategory>): Promise<SkillCategory> {
  const res = await fetch(`/api/admin/skills?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update category')
  return data
}

export async function deleteSkillCategory(id: string): Promise<void> {
  const res = await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to delete category')
}

export async function reorderSkillCategories(ids: string[]): Promise<void> {
  const res = await fetch('/api/admin/skills', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'reorder', ids }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to reorder categories')
}
