import { promises as fs } from 'fs'
import path from 'path'
import { Project } from '@/types'

// Fallback used only when no projects exist on disk yet.
export const defaultProjects: Project[] = []

export const PROJECTS_FILE_PATH = path.join(process.cwd(), 'data', 'projects.json')

export async function ensureProjectsFile() {
  try {
    await fs.access(PROJECTS_FILE_PATH)
    return
  } catch {
    await fs.mkdir(path.dirname(PROJECTS_FILE_PATH), { recursive: true })
    await fs.writeFile(PROJECTS_FILE_PATH, JSON.stringify(defaultProjects, null, 2), 'utf-8')
  }
}

export async function getProjects() {
  await ensureProjectsFile()
  const raw = await fs.readFile(PROJECTS_FILE_PATH, 'utf-8')

  try {
    const parsed = JSON.parse(raw) as Project[]
    return parsed.length ? parsed : defaultProjects
  } catch {
    return defaultProjects
  }
}

export async function saveProjects(projects: Project[]) {
  await ensureProjectsFile()
  await fs.writeFile(PROJECTS_FILE_PATH, JSON.stringify(projects, null, 2), 'utf-8')
}
