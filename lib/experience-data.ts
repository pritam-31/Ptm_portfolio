import { promises as fs } from 'fs'
import path from 'path'
import { Experience } from '@/types'
import { defaultExperience } from './experience-defaults'

export const EXPERIENCE_FILE_PATH = path.join(process.cwd(), 'data', 'experiences.json')

export async function ensureExperienceFile() {
  try {
    await fs.access(EXPERIENCE_FILE_PATH)
    return
  } catch {
    await fs.mkdir(path.dirname(EXPERIENCE_FILE_PATH), { recursive: true })
    await fs.writeFile(EXPERIENCE_FILE_PATH, JSON.stringify(defaultExperience, null, 2), 'utf-8')
  }
}

export async function getExperience(): Promise<Experience[]> {
  await ensureExperienceFile()
  const raw = await fs.readFile(EXPERIENCE_FILE_PATH, 'utf-8')

  try {
    const parsed = JSON.parse(raw) as Experience[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return defaultExperience
  }
}

export async function saveExperience(entries: Experience[]) {
  await ensureExperienceFile()
  await fs.writeFile(EXPERIENCE_FILE_PATH, JSON.stringify(entries, null, 2), 'utf-8')
}