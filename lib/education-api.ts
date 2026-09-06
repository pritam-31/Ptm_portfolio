'use client'

import { createJsonStore } from './use-json-store'
import { defaultEducation } from './education-defaults'
import { EducationItem } from '@/types'

const fetchPublic = async (): Promise<EducationItem[]> => {
  const res = await fetch('/api/education', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load education')
  return res.json()
}

const store = createJsonStore<EducationItem[]>(fetchPublic, defaultEducation)

export const useEducation = store.useValue
export const setEducation = store.setSnapshot

async function mutate(input: Omit<EducationItem, 'id'> & { id?: string }, method: 'POST' | 'PUT') {
  const res = await fetch('/api/education', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = (await res.json()) as EducationItem[] | { error?: string }
  if (!res.ok || !Array.isArray(data)) {
    throw new Error((data as { error?: string }).error || 'Education save failed')
  }
  setEducation(data)
  return data
}

export async function createEducation(input: Omit<EducationItem, 'id'>) {
  return mutate(input, 'POST')
}

export async function updateEducation(input: EducationItem) {
  return mutate(input, 'PUT')
}

export async function deleteEducation(id: string) {
  const res = await fetch(`/api/education?id=${id}`, { method: 'DELETE' })
  const data = (await res.json()) as EducationItem[] | { error?: string }
  if (!res.ok || !Array.isArray(data)) {
    throw new Error((data as { error?: string }).error || 'Education delete failed')
  }
  setEducation(data)
  return data
}