'use client'

import { createJsonStore } from './use-json-store'
import { defaultContent } from './content-defaults'
import { SiteContent } from '@/types'

const fetchPublic = async (): Promise<SiteContent> => {
  const res = await fetch('/api/content', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load content')
  return res.json()
}

const store = createJsonStore<SiteContent>(fetchPublic, defaultContent)

export const useSiteContent = store.useValue
export const setSiteContent = store.setSnapshot

export async function saveSiteContent(next: SiteContent): Promise<SiteContent> {
  const res = await fetch('/api/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(next),
  })
  const data = (await res.json()) as SiteContent | { error?: string }
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || 'Content save failed')
  }
  const saved = data as SiteContent
  setSiteContent(saved)
  return saved
}