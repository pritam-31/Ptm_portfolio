export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  price?: string
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  githubUrl?: string
  liveUrl?: string
  link?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  location?: string
  message: string
}

export interface NavItem {
  name: string
  href: string
  icon?: string
}

export interface Technology {
  name: string
  icon: string
  color: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'ai'
}

export interface Experience {
  id: string
  role: string
  company: string
  location: string
  period: string
  duration: string
  type: 'internship' | 'hackathon' | 'project' | 'work'
  highlights: string[]
  technologies: string[]
}

export interface SkillTechnology {
  id: string
  name: string
  icon?: string
  enabled: boolean
}

export interface SkillCategory {
  id: string
  name: string
  slug: string
  score: number
  description: string
  icon: string
  technologies: SkillTechnology[]
  displayOrder: number
  enabled: boolean
  color: string
  createdAt: string
  updatedAt: string
}

export interface EducationItem {
  id: string
  degree: string
  institution: string
  period: string
  score: string
  theme: 'cyan' | 'violet' | 'emerald'
}

export interface ContentStat {
  icon: string
  number: string
  label: string
}

export interface ContentValue {
  icon: string
  title: string
  description: string
}

export interface SiteContent {
  hero: {
    badge: string
    greeting: string
    name: string
    titleLine1: string
    titleAccent: string
    description: string
    photoUrl?: string
  }
  about: {
    badge: string
    heading: string
    headingAccent: string
    paragraph1: string
    paragraph2: string
    stats: ContentStat[]
    values: ContentValue[]
  }
  cta: {
    badge: string
    heading: string
    headingAccent: string
    paragraph: string
    stats: string[]
  }
  contact: {
    email: string
    phone: string
    phoneRaw: string
    location: string
  }
  footer: {
    tagline: string
  }
}
