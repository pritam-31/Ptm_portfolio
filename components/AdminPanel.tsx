'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ExternalLink, GitBranch, ImageUp, Lock, LogOut, Plus, Trash2, FolderKanban, Layers, GraduationCap, Briefcase, Type, Camera } from 'lucide-react'
import { Project } from '@/types'
import SkillMatrixManager from './SkillMatrixManager'
import EducationManager from './EducationManager'
import ExperienceManager from './ExperienceManager'
import ContentForm from './ContentForm'
import PhotoManager from './PhotoManager'

const emptyProject = {
  title: '',
  description: '',
  technologies: '',
  githubUrl: '',
  liveUrl: '',
  mediaType: 'image' as 'image' | 'video',
  mediaFile: null as File | null,
}

type AdminTab = 'projects' | 'skills' | 'education' | 'experience' | 'content' | 'photo'

export default function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState(emptyProject)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/session', { cache: 'no-store' })
        const data = (await response.json()) as { loggedIn: boolean }
        setIsLoggedIn(Boolean(data.loggedIn))
      } catch {
        setIsLoggedIn(false)
      }
    }

    checkSession()
    loadProjects()
  }, [])

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string }
        setStatus(errorData.error || 'Login failed')
        return
      }

      setIsLoggedIn(true)
      setStatus('Admin login successful')
      await loadProjects()
    } catch {
      setStatus('Unable to login right now')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setIsLoggedIn(false)
    setStatus('Logged out')
  }

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setForm((current) => ({ ...current, mediaFile: file || null }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isLoggedIn) {
      setStatus('Please login to upload projects')
      return
    }

    if (!form.title.trim() || !form.description.trim()) {
      setStatus('Project title and description are required')
      return
    }

    setIsSubmitting(true)
    setStatus('Uploading project media...')

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('technologies', form.technologies)
      formData.append('githubUrl', form.githubUrl)
      formData.append('liveUrl', form.liveUrl)
      formData.append('mediaType', form.mediaType)

      if (form.mediaFile) {
        formData.append('media', form.mediaFile)
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      })

      const result = (await response.json()) as { error?: string }
      if (!response.ok) {
        setStatus(result.error || 'Project upload failed')
        return
      }

      setForm(emptyProject)
      setStatus('Project uploaded successfully')
      await loadProjects()
    } catch {
      setStatus('Upload failed. Check your Cloudinary setup.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeProject = async (id: string) => {
    if (!isLoggedIn) return

    try {
      const response = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        await loadProjects()
      }
    } catch {
      setStatus('Unable to remove project')
    }
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(168,85,247,0.13),transparent_28%)]" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Control Room</p>
          <h1 className="mb-4 font-space-grotesk text-4xl font-bold text-white md:text-6xl">Admin Panel</h1>
          <p className="max-w-xl text-slate-300">
            Manage every part of your portfolio — projects, skills, education timeline, experience entries, and the site text (hero, about, CTA, contact). Only the admin can change this content.
          </p>

          {!isLoggedIn ? (
            <form onSubmit={handleLogin} className="mt-6 rounded-lg border border-white/10 bg-slate-950/80 p-5">
              <div className="mb-4 flex items-center gap-2 text-cyan-300">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-[0.2em]">Admin access</span>
              </div>
              <div className="grid gap-4">
                <input
                  value={credentials.email}
                  onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                  className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  placeholder="pritampadhan3107@gmail.com"
                  type="email"
                />
                <input
                  value={credentials.password}
                  onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                  className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  placeholder="Password"
                  type="password"
                />
                <button type="submit" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
                  Login
                </button>
              </div>
            </form>
          ) : (
            <button onClick={handleLogout} className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300 hover:text-white">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}

          {status ? <p className="mt-4 text-sm text-cyan-200">{status}</p> : null}

          {isLoggedIn && (
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => setTab('projects')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tab === 'projects' ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 text-gray-300 hover:text-white'}`}
              >
                <FolderKanban className="h-4 w-4" />
                Projects
              </button>
              <button
                onClick={() => setTab('skills')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tab === 'skills' ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 text-gray-300 hover:text-white'}`}
              >
                <Layers className="h-4 w-4" />
                Skills
              </button>
              <button
                onClick={() => setTab('education')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tab === 'education' ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 text-gray-300 hover:text-white'}`}
              >
                <GraduationCap className="h-4 w-4" />
                Education
              </button>
              <button
                onClick={() => setTab('experience')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tab === 'experience' ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 text-gray-300 hover:text-white'}`}
              >
                <Briefcase className="h-4 w-4" />
                Experience
              </button>
              <button
                onClick={() => setTab('content')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tab === 'content' ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 text-gray-300 hover:text-white'}`}
              >
                <Type className="h-4 w-4" />
                Site Content
              </button>
              <button
                onClick={() => setTab('photo')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tab === 'photo' ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 text-gray-300 hover:text-white'}`}
              >
                <Camera className="h-4 w-4" />
                Photo
              </button>
            </div>
          )}
        </div>

        {isLoggedIn && tab === 'projects' ? (
          <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm text-slate-300">
                Project title
                <input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  placeholder="Web3 launchpad"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-300">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  className="min-h-28 rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  placeholder="Short project summary"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-300">
                  Technologies
                  <input
                    value={form.technologies}
                    onChange={(event) => setForm({ ...form, technologies: event.target.value })}
                    className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                    placeholder="Next.js, Web3, Three.js"
                  />
                </label>
                <label className="grid gap-2 text-sm text-slate-300">
                  Media type
                  <select
                    value={form.mediaType}
                    onChange={(event) => setForm({ ...form, mediaType: event.target.value as 'image' | 'video' })}
                    className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  >
                    <option value="image">Image</option>
                    <option value="video">Short video</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-300">
                  GitHub link
                  <input
                    value={form.githubUrl}
                    onChange={(event) => setForm({ ...form, githubUrl: event.target.value })}
                    className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                    placeholder="https://github.com/your-repo"
                  />
                </label>
                <label className="grid gap-2 text-sm text-slate-300">
                  Live link
                  <input
                    value={form.liveUrl}
                    onChange={(event) => setForm({ ...form, liveUrl: event.target.value })}
                    className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                    placeholder="https://example.com"
                  />
                </label>
              </div>
              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-cyan-400/35 bg-cyan-400/5 p-5 text-center text-sm text-slate-300 transition hover:bg-cyan-400/10">
                <ImageUp className="h-7 w-7 text-cyan-300" />
                <span>
                  {form.mediaFile ? `Selected ${form.mediaType}: ${form.mediaFile.name}` : 'Upload project preview image or 5s video'}
                </span>
                <input type="file" accept={form.mediaType === 'video' ? 'video/*' : 'image/*'} onChange={handleMediaChange} className="hidden" />
              </label>
              <button disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70">
                <Plus className="h-5 w-5" />
                {isSubmitting ? 'Uploading...' : 'Upload Project'}
              </button>
            </div>
          </form>
        ) : null}

        {isLoggedIn && tab === 'projects' ? (
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-space-grotesk text-2xl font-bold text-white">Current Projects</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {projects.map((project) => (
                <article key={project.id} className="rounded-lg border border-white/10 bg-slate-950/75 p-4">
                  <div className="mb-3 aspect-video overflow-hidden rounded-md bg-slate-900">
                    {project.mediaType === 'video' && project.mediaUrl ? (
                      <video src={project.mediaUrl} className="h-full w-full object-cover" muted playsInline controls />
                    ) : project.image ? (
                      <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <h3 className="mb-1 font-semibold text-white">{project.title}</h3>
                  <p className="mb-3 line-clamp-2 text-sm text-slate-400">{project.description}</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {project.githubUrl ? (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-300"><GitBranch className="h-3 w-3" /> GitHub</a>
                    ) : null}
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-300"><ExternalLink className="h-3 w-3" /> Live</a>
                    ) : null}
                  </div>
                  <button onClick={() => removeProject(project.id)} className="inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-200">
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {isLoggedIn && tab === 'skills' ? (
          <div className="lg:col-span-2">
            <SkillMatrixManager />
          </div>
        ) : null}

        {isLoggedIn && tab === 'education' ? (
          <div className="lg:col-span-2">
            <EducationManager />
          </div>
        ) : null}

        {isLoggedIn && tab === 'experience' ? (
          <div className="lg:col-span-2">
            <ExperienceManager />
          </div>
        ) : null}

        {isLoggedIn && tab === 'content' ? (
          <div className="lg:col-span-2">
            <ContentForm />
          </div>
        ) : null}

        {isLoggedIn && tab === 'photo' ? (
          <div className="lg:col-span-2">
            <PhotoManager />
          </div>
        ) : null}
      </div>
    </section>
  )
}
