'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, FolderKanban, GitBranch } from 'lucide-react'
import { Project } from '@/types'
import { WriteUnderline } from './ManimEffects'

export default function ProjectsShowcase() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects', { cache: 'no-store' })
        if (!response.ok) {
          setProjects([])
          return
        }
        const data = (await response.json()) as Project[]
        setProjects(data)
      } catch {
        setProjects([])
      }
    }

    loadProjects()
  }, [])

  return (
    <section id="projects" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(14,165,233,0.14),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.12),transparent_25%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Live Portfolio</p>
            <h2 className="font-space-grotesk text-3xl font-bold text-white md:text-5xl">
              Featured <span className="text-cyan-300">Projects</span>
            </h2>
            <WriteUnderline className="mt-2 w-36" />
          </div>
          <Link
            href="/admin"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/20"
          >
            <FolderKanban className="h-4 w-4" />
            Admin Panel
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-lg border border-white/10 bg-slate-950/72 shadow-2xl shadow-black/30 backdrop-blur"
            >
              <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-white/10 bg-slate-900">
                {project.mediaType === 'video' && project.mediaUrl ? (
                  <video src={project.mediaUrl} className="h-full w-full object-cover" muted playsInline autoPlay loop />
                ) : project.image ? (
                  <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.28),rgba(15,23,42,0.94)_48%,rgba(168,85,247,0.26))]" />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.14),transparent)] opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center">
                  <div className="h-16 w-16 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm shadow-[0_0_18px_rgba(34,211,238,0.1)]" />
                </div>
                <div className="absolute right-3 top-3 z-20 flex gap-2">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-black/50 p-2 text-white transition hover:border-cyan-300 hover:text-cyan-300">
                      <GitBranch className="h-4 w-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-black/50 p-2 text-white transition hover:border-cyan-300 hover:text-cyan-300">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="mb-2 font-space-grotesk text-xl font-bold text-white">{project.title}</h3>
                <p className="mb-4 text-sm leading-6 text-slate-300">{project.description}</p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
                {(project.link || project.liveUrl) && (
                  <Link href={project.liveUrl || project.link || '#'} target={project.liveUrl ? '_blank' : undefined} rel={project.liveUrl ? 'noreferrer' : undefined} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-white">
                    View project <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
