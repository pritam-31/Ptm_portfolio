import { SkillCategory } from '@/types'
import { validateScore } from '@/lib/skill-data'

export type NormalizedSkillInput = {
  name: string
  score: number
  description: string
  icon: string
  color: string
  displayOrder: number
  enabled: boolean
}

export type NormalizeResult =
  | { error: string; data: null }
  | { error: null; data: NormalizedSkillInput }

export function normalizeSkillInput(input: Partial<SkillCategory>): NormalizeResult {
  const name = String(input.name ?? '').trim()
  if (!name) return { error: 'Category name is required', data: null }

  const score = Number(input.score)
  if (!validateScore(score)) {
    return { error: 'Score must be a number between 0 and 100', data: null }
  }

  return {
    error: null,
    data: {
      name,
      score,
      description: String(input.description ?? '').trim(),
      icon: String(input.icon ?? '').trim() || 'code2',
      color: String(input.color ?? '').trim() || '#38bdf8',
      displayOrder: Number.isFinite(Number(input.displayOrder)) ? Number(input.displayOrder) : 0,
      enabled: input.enabled !== false,
    },
  }
}

export function normalizeTechnologies(input: unknown): { error: string | null; data: SkillCategory['technologies'] } {
  const raw = Array.isArray(input) ? input : []
  const data = raw
    .filter((item): item is { name?: unknown; enabled?: unknown } => Boolean(item) && typeof item === 'object')
    .map((item) => ({
      id: typeof item.name === 'string' ? `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).slice(2, 7)}` : `t-${Math.random().toString(36).slice(2, 7)}`,
      name: typeof item.name === 'string' ? item.name.trim() : '',
      icon: typeof (item as { icon?: unknown }).icon === 'string' ? (item as { icon: string }).icon : undefined,
      enabled: (item as { enabled?: boolean }).enabled !== false,
    }))
    .filter((t) => t.name)

  return { error: null, data }
}
