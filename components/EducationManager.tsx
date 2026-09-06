'use client'

import { FormEvent, useState } from 'react'
import { GraduationCap, Pencil, Plus, Trash2, X } from 'lucide-react'
import { EducationItem } from '@/types'
import { createEducation, deleteEducation, updateEducation, useEducation } from '@/lib/education-api'

const EMPTY_FORM = {
  degree: '',
  institution: '',
  period: '',
  score: '',
  theme: 'cyan' as EducationItem['theme'],
}

const THEME_OPTIONS = [
  { value: 'cyan', label: 'Cyan / Blue', dot: 'bg-cyan-400' },
  { value: 'violet', label: 'Violet / Purple', dot: 'bg-violet-400' },
  { value: 'emerald', label: 'Emerald / Teal', dot: 'bg-emerald-400' },
]

function inputCls() {
  return 'rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300'
}

export default function EducationManager() {
  const items = useEducation()
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const startEdit = (item: EducationItem) => {
    setEditingId(item.id)
    setForm({
      degree: item.degree,
      institution: item.institution,
      period: item.period,
      score: item.score,
      theme: item.theme,
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
    if (!form.degree.trim() || !form.institution.trim()) {
      setStatus('Degree and institution are required')
      return
    }
    setBusy(true)
    try {
      if (editingId) {
        await updateEducation({ ...form, id: editingId })
        setStatus('Education entry updated')
      } else {
        await createEducation(form)
        setStatus('Education entry added')
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
      await deleteEducation(id)
      if (editingId === id) resetForm()
      setStatus('Education entry removed')
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
          <GraduationCap className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">
            {editingId ? 'Edit education entry' : 'Add education entry'}
          </span>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              Degree / Certificate
              <input
                value={form.degree}
                onChange={(event) => setForm({ ...form, degree: event.target.value })}
                className={inputCls()}
                placeholder="B.Tech — Electronics & Communication Engineering"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Institution
              <input
                value={form.institution}
                onChange={(event) => setForm({ ...form, institution: event.target.value })}
                className={inputCls()}
                placeholder="GIET, Bhubaneswar"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              Period
              <input
                value={form.period}
                onChange={(event) => setForm({ ...form, period: event.target.value })}
                className={inputCls()}
                placeholder="Aug 2024 – Jun 2028"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Score / Result
              <input
                value={form.score}
                onChange={(event) => setForm({ ...form, score: event.target.value })}
                className={inputCls()}
                placeholder="CGPA 8.95 / 10"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm text-slate-300">
            Card color scheme
            <div className="flex flex-wrap gap-2">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm({ ...form, theme: option.value as EducationItem['theme'] })}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                    form.theme === option.value
                      ? 'border-cyan-300 bg-cyan-500/15 text-cyan-200'
                      : 'border-white/10 bg-black/40 text-gray-300 hover:border-white/25'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${option.dot}`} />
                  {option.label}
                </button>
              ))}
            </div>
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

      <h2 className="mb-4 mt-8 font-space-grotesk text-xl font-bold text-white">Education Timeline</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-950/75 p-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-white">{item.degree}</h3>
              <p className="text-sm text-slate-400">{item.institution}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.period} &middot; {item.score}
              </p>
            </div>
            <div className="flex gap-2">
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
          </article>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No education entries yet.</p>}
      </div>
    </div>
  )
}