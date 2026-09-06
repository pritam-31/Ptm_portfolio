import { promises as fs } from 'fs'
import path from 'path'
import { SiteContent } from '@/types'
import { defaultContent } from './content-defaults'

export const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json')

async function rawContent(): Promise<string> {
  try {
    await fs.access(CONTENT_FILE_PATH)
    return await fs.readFile(CONTENT_FILE_PATH, 'utf-8')
  } catch {
    await fs.mkdir(path.dirname(CONTENT_FILE_PATH), { recursive: true })
    await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(defaultContent, null, 2), 'utf-8')
    return JSON.stringify(defaultContent, null, 2)
  }
}

export async function getContent(): Promise<SiteContent> {
  try {
    const parsed = JSON.parse(await rawContent()) as SiteContent
    return parsed && typeof parsed === 'object' ? parsed : defaultContent
  } catch {
    return defaultContent
  }
}

export async function saveContent(content: SiteContent) {
  const current = await getContent()
  const merged: SiteContent = {
    hero: { ...current.hero, ...content.hero },
    about: {
      ...current.about,
      ...content.about,
      stats: content.about?.stats ?? current.about.stats,
      values: content.about?.values ?? current.about.values,
    },
    cta: { ...current.cta, ...content.cta, stats: content.cta?.stats ?? current.cta.stats },
    contact: { ...current.contact, ...content.contact },
    footer: { ...current.footer, ...content.footer },
  }
  await fs.mkdir(path.dirname(CONTENT_FILE_PATH), { recursive: true })
  await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(merged, null, 2), 'utf-8')
  return merged
}