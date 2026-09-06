import { promises as fs } from 'fs'
import path from 'path'
import { EducationItem } from '@/types'
import { defaultEducation } from './education-defaults'

export const EDUCATION_FILE_PATH = path.join(process.cwd(), 'data', 'education.json')

export async function ensureEducationFile() {
  try {
    await fs.access(EDUCATION_FILE_PATH)
    return
  } catch {
    await fs.mkdir(path.dirname(EDUCATION_FILE_PATH), { recursive: true })
    await fs.writeFile(EDUCATION_FILE_PATH, JSON.stringify(defaultEducation, null, 2), 'utf-8')
  }
}

export async function getEducation(): Promise<EducationItem[]> {
  await ensureEducationFile()
  const raw = await fs.readFile(EDUCATION_FILE_PATH, 'utf-8')

  try {
    const parsed = JSON.parse(raw) as EducationItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return defaultEducation
  }
}

export async function saveEducation(entries: EducationItem[]) {
  await ensureEducationFile()
  await fs.writeFile(EDUCATION_FILE_PATH, JSON.stringify(entries, null, 2), 'utf-8')
}