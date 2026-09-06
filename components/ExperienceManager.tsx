'use client'

import { FormEvent, useState } from 'react'
import { Briefcase, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Experience } from '@/types'
import { createExperience, deleteExperience, updateExperience, useExperience } from '@/lib/experience-api'

const EMPTY_FORM = {
  role: '',
  company: '',
  location: '',
  period: '',
  duration: '',
  type: 'project' as Experience['type'],
  highlights: '',
  technologies: '',
}

const TYPE_OPTIONS: { value: Experience['type']; label: string }[] = [
  { value: 'internship', label: 'Internship' },
  { value: 'work', label: 'Work' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'project', label: 'Project' },
]

function inputCls() {
  return 'rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300'
}

export default function ExperienceManager() {
  const items = useExperience()
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const startEdit = (item: Experience) => {
    setEditingId(item.id)
    setForm({
      role: item.role,
      company: item.company,
      location: item.location,
      period: item.period,
      duration: item.duration,
      type: item.type,
      highlights: item.highlights.join('\n'),
      technologies: item.technologies.join(', '),
    })
    setStatus('')
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setStatus('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.role.trim() || !form.company.trim()) {
      setStatus('Role and company are required')
      return
    }
    const payload = {
      role: form.role,
      company: form.company,
      location: form.location,
      period: form.period,
      duration: form.duration,
      type: form.type,
      highlights: form.highlights
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      technologies: form.technologies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    }
    setBusy(true)
    try {
      if (editingId) {
        await updateExperience({ ...payload, id: editingId })
        setStatus('Experience entry updated')
      } else {
        await createExperience(payload)
        setStatus('Experience entry added')
      }
      resetForm()
    } catch (error) {
      setStatus((error as Error).message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (id: string) => {
    setBusy(true)
    try {
      await deleteExperience(id)
      if (editingId === id) resetForm()
      setStatus('Experience entry removed')
    } catch (error) {
      setStatus((error as Error).message || 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-slate-950/80 p-5">
        <div className="mb-4 flex items-center gap-2 text-cyan-300">
          <Briefcase className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">
            {editingId ? 'Edit experience entry' : 'Add experience entry'}
          </span>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              Role / Title
              <input
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                className={inputCls()}
                placeholder="Full Stack Developer"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Company / Org
              <input
                value={form.company}
                onChange={(event) => setForm({ ...form, company: event.target.value })}
                className={inputCls()}
                placeholder="Acme Corp"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-4">
            <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2">
              Location
              <input
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                className={inputCls()}
                placeholder="Remote"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Period
              <input
                value={form.period}
                onChange={(event) => setForm({ ...form, period: event.target.value })}
                className={inputCls()}
                placeholder="Sep 2025 - Dec 2025"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Duration
              <input
                value={form.duration}
                onChange={(event) => setForm({ ...form, duration: event.target.value })}
                className={inputCls()}
                placeholder="4 months"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm text-slate-300">
            Type
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: option.value })}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    form.type === option.value
                      ? 'border-cyan-300 bg-cyan-500/15 text-cyan-200'
                      : 'border-white/10 bg-black/40 text-gray-300 hover:border-white/25'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            Highlights (one per line)
            <textarea
              value={form.highlights}
              onChange={(event) => setForm({ ...form, highlights: event.target.value })}
              rows={4}
              className={`${inputCls()} min-h-24 resize-y`}
              placeholder={'Shipped a production feature end-to-end\nBuilt secure authentication and REST APIs'}
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            Technologies (comma separated)
            <input
              value={form.technologies}
              onChange={(event) => setForm({ ...form, technologies: event.target.value })}
              className={inputCls()}
              placeholder="Node.js, Express, MongoDB"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus className="h-4 w-4" />
              {busy ? 'Saving...' : editingId ? 'Update entry' : 'Add entry'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-gray-300 transition hover:border-white/25 hover:text-white"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>

          {status ? <p className="text-sm text-cyan-200">{status}</p> : null}
        </div>
      </form>

      <h2 className="mb-4 mt-8 font-space-grotesk text-xl font-bold text-white">Experience Timeline</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-white/10 bg-slate-950/75 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-white">{item.role}</h3>
                <p className="text-sm text-slate-400">{item.company}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.period} &middot; {item.duration}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.technologies.slice(0, 6).map((tech) => (
                    <span key={tech} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-sm text-cyan-300 transition hover:border-cyan-300/40"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-sm text-red-300 transition hover:border-red-300/40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No experience entries yet.</p>}
      </div>
    </div>
  )
}