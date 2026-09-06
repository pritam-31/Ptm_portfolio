import { promises as fs } from 'fs'
import path from 'path'
import { SkillCategory } from '@/types'

export const defaultSkills: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    slug: 'frontend',
    score: 92,
    description: 'Building responsive, high-performance user interfaces with modern web frameworks.',
    icon: 'code2',
    technologies: [
      { id: 'js', name: 'JavaScript', enabled: true },
      { id: 'ts', name: 'TypeScript', enabled: true },
      { id: 'react', name: 'React', enabled: true },
      { id: 'nextjs', name: 'Next.js', enabled: true },
      { id: 'tailwind', name: 'Tailwind CSS', enabled: true },
      { id: 'html', name: 'HTML5', enabled: true },
      { id: 'css', name: 'CSS3', enabled: true },
      { id: 'figma', name: 'Figma', enabled: true },
    ],
    displayOrder: 1,
    enabled: true,
    color: '#38bdf8',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'programming',
    name: 'Programming & Languages',
    slug: 'programming-languages',
    score: 95,
    description: 'Strong foundations in languages and problem solving for scalable software.',
    icon: 'terminal',
    technologies: [
      { id: 'cpp', name: 'C / C++', enabled: true },
      { id: 'python', name: 'Python', enabled: true },
      { id: 'js2', name: 'JavaScript', enabled: true },
      { id: 'ts2', name: 'TypeScript', enabled: true },
      { id: 'node', name: 'Node.js', enabled: true },
      { id: 'express', name: 'Express.js', enabled: true },
      { id: 'linux', name: 'Linux', enabled: true },
    ],
    displayOrder: 2,
    enabled: true,
    color: '#3b82f6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'database',
    name: 'Database & Backend',
    slug: 'database-backend',
    score: 88,
    description: 'Designing schemas, queries and robust APIs across SQL and NoSQL databases.',
    icon: 'database',
    technologies: [
      { id: 'mongodb', name: 'MongoDB', enabled: true },
      { id: 'mysql', name: 'MySQL', enabled: true },
      { id: 'firebase', name: 'Firebase', enabled: true },
      { id: 'redis', name: 'Redis', enabled: true },
      { id: 'node2', name: 'Node.js', enabled: true },
      { id: 'express2', name: 'Express.js', enabled: true },
      { id: 'postman', name: 'Postman', enabled: true },
    ],
    displayOrder: 3,
    enabled: true,
    color: '#34d399',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ai',
    name: 'AI / ML',
    slug: 'ai-ml',
    score: 92,
    description: 'Machine learning, deep learning and computer vision expertise for intelligent products.',
    icon: 'brain',
    technologies: [
      { id: 'python3', name: 'Python', enabled: true },
      { id: 'tensorflow', name: 'TensorFlow', enabled: true },
      { id: 'pytorch', name: 'PyTorch', enabled: true },
      { id: 'sklearn', name: 'Scikit-learn', enabled: true },
      { id: 'opencv', name: 'OpenCV', enabled: true },
      { id: 'langchain', name: 'LangChain', enabled: true },
    ],
    displayOrder: 4,
    enabled: true,
    color: '#a78bfa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mobile',
    name: 'Mobile App Development',
    slug: 'mobile-development',
    score: 85,
    description: 'Building cross-platform and native Android applications with React Native and Expo.',
    icon: 'smartphone',
    technologies: [
      { id: 'rn', name: 'React Native', enabled: true },
      { id: 'expo', name: 'Expo', enabled: true },
      { id: 'android', name: 'Android', enabled: true },
      { id: 'firebase', name: 'Firebase', enabled: true },
    ],
    displayOrder: 4,
    enabled: true,
    color: '#22d3ee',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    slug: 'cloud-devops',
    score: 84,
    description: 'Deploying, scaling and monitoring applications using modern cloud and DevOps tooling.',
    icon: 'cloud',
    technologies: [
      { id: 'aws', name: 'AWS', enabled: true },
      { id: 'docker', name: 'Docker', enabled: true },
      { id: 'k8s', name: 'Kubernetes', enabled: true },
      { id: 'vercel', name: 'Vercel', enabled: true },
      { id: 'netlify', name: 'Netlify', enabled: true },
      { id: 'git', name: 'Git', enabled: true },
      { id: 'github', name: 'GitHub', enabled: true },
      { id: 'linux2', name: 'Linux', enabled: true },
    ],
    displayOrder: 5,
    enabled: true,
    color: '#fb923c',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'iot',
    name: 'Hardware / IoT & Tools',
    slug: 'hardware-iot',
    score: 80,
    description: 'Building connected hardware projects and supporting developer workflows and tooling.',
    icon: 'wrench',
    technologies: [
      { id: 'arduino', name: 'Arduino', enabled: true },
      { id: 'embedded', name: 'Embedded C++', enabled: true },
      { id: 'micropython', name: 'MicroPython', enabled: true },
      { id: 'jest', name: 'Jest', enabled: true },
      { id: 'apitesting', name: 'API Testing', enabled: true },
      { id: 'uidesign', name: 'UI Design', enabled: true },
    ],
    displayOrder: 6,
    enabled: true,
    color: '#2dd4bf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const SKILLS_FILE_PATH = path.join(process.cwd(), 'data', 'skills.json')

export function nowISO(): string {
  return new Date().toISOString()
}

export async function ensureSkillsFile() {
  try {
    await fs.access(SKILLS_FILE_PATH)
    return
  } catch {
    await fs.mkdir(path.dirname(SKILLS_FILE_PATH), { recursive: true })
    await fs.writeFile(SKILLS_FILE_PATH, JSON.stringify(defaultSkills, null, 2), 'utf-8')
  }
}

export async function getSkills(): Promise<SkillCategory[]> {
  await ensureSkillsFile()
  const raw = await fs.readFile(SKILLS_FILE_PATH, 'utf-8')

  try {
    const parsed = JSON.parse(raw) as SkillCategory[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return defaultSkills
  }
}

export async function saveSkills(skills: SkillCategory[]) {
  await ensureSkillsFile()
  await fs.writeFile(SKILLS_FILE_PATH, JSON.stringify(skills, null, 2), 'utf-8')
}

export function validateScore(score: number): boolean {
  return Number.isFinite(score) && score >= 0 && score <= 100
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function publicSkill(category: SkillCategory) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    score: category.score,
    description: category.description,
    icon: category.icon,
    color: category.color,
    technologies: category.technologies
      .filter((t) => t.enabled)
      .map((t) => ({ id: t.id, name: t.name, icon: t.icon })),
  }
}
