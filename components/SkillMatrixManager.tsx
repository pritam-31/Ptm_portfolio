'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, X, Check, Layers } from 'lucide-react'
import {
  fetchAdminSkills,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  reorderSkillCategories,
} from '@/lib/skills-api'
import { SkillCategory } from '@/types'

const EMPTY_CATEGORY = { name: '', score: 92, description: '', icon: 'code2', color: '#38bdf8', displayOrder: 0 }

const ICON_OPTIONS = ['code2', 'terminal', 'database', 'brain', 'cloud', 'wrench', 'smartphone']
const COLOR_OPTIONS = ['#38bdf8', '#3b82f6', '#34d399', '#a78bfa', '#fb923c', '#2dd4bf']

function inputCls() {
  return 'rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300'
}

export default function SkillMatrixManager() {
  const [skills, setSkills] = useState<SkillCategory[]>([])
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<{ name: string; score: number; description: string; icon: string; color: string }>(EMPTY_CATEGORY)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [techEditorId, setTechEditorId] = useState<string | null>(null)
  const [techEditor, setTechEditor] = useState<{ name: string; enabled: boolean }>({ name: '', enabled: true })

  const load = useCallback(async () => {
    try {
      const data = await fetchAdminSkills()
      setSkills(data)
    } catch {
      setStatus('Unable to load skill matrix')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const persist = (next: SkillCategory[]) => {
    setSkills([...next].sort((a, b) => a.displayOrder - b.displayOrder))
  }

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setStatus('Category name is required')
      return
    }
    if (form.score < 0 || form.score > 100) {
      setStatus('Score must be between 0 and 100')
      return
    }
    setBusy(true)
    try {
      await createSkillCategory(form)
      setStatus('Category created')
      setShowForm(false)
      setForm(EMPTY_CATEGORY)
      await load()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to create category')
    } finally {
      setBusy(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingId) return
    if (!form.name.trim()) {
      setStatus('Category name is required')
      return
    }
    if (form.score < 0 || form.score > 100) {
      setStatus('Score must be between 0 and 100')
      return
    }
    setBusy(true)
    try {
      await updateSkillCategory(editingId, form)
      setStatus('Category updated')
      setEditingId(null)
      setShowForm(false)
      setForm(EMPTY_CATEGORY)
      await load()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to update category')
    } finally {
      setBusy(false)
    }
  }

  const startEdit = (s: SkillCategory) => {
    setForm({ name: s.name, score: s.score, description: s.description, icon: s.icon, color: s.color })
    setEditingId(s.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    setBusy(true)
    try {
      await deleteSkillCategory(id)
      setStatus('Category deleted')
      setConfirmDelete(null)
      await load()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to delete category')
    } finally {
      setBusy(false)
    }
  }

  const toggleEnabled = async (s: SkillCategory) => {
    try {
      await updateSkillCategory(s.id, { enabled: !s.enabled })
      await load()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to toggle category')
    }
  }

  const move = async (index: number, dir: -1 | 1) => {
    const next = [...skills]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    const tmp = next[index]
    next[index] = next[target]
    next[target] = tmp
    next.forEach((s, i) => (s.displayOrder = i))
    persist(next)
    try {
      await reorderSkillCategories(next.map((s) => s.id))
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to reorder')
      await load()
    }
  }

  const openTechEditor = (s: SkillCategory) => {
    setTechEditorId(s.id)
  }

  const addTechnology = async (techText: string) => {
    const s = skills.find((x) => x.id === techEditorId)
    if (!s || !techText.trim()) return
    const existing = (s.technologies || []).map((t) => ({ ...t }))
    const newTech = { id: `${techText.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`, name: techText.trim(), enabled: true }
    existing.push(newTech)
    try {
      await updateSkillCategory(s.id, { technologies: existing })
      setStatus('Technology added')
      await load()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to add technology')
    }
  }

  const toggleTech = async (s: SkillCategory, techId: string) => {
    const existing = (s.technologies || []).map((t) => (t.id === techId ? { ...t, enabled: !t.enabled } : { ...t }))
    try {
      await updateSkillCategory(s.id, { technologies: existing })
      await load()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to update technology')
    }
  }

  const removeTech = async (s: SkillCategory, techId: string) => {
    const existing = (s.technologies || []).filter((t) => t.id !== techId)
    try {
      await updateSkillCategory(s.id, { technologies: existing })
      setStatus('Technology removed')
      await load()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to remove technology')
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-space-grotesk text-xl font-bold text-white">
          <Layers className="h-5 w-5 text-cyan-300" />
          Skill Matrix
        </h3>
        <button
          onClick={() => {
            setShowForm((v) => !v)
            setEditingId(null)
            setForm(EMPTY_CATEGORY)
          }}
          className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {status ? <p className="mb-3 text-sm text-cyan-200">{status}</p> : null}

      {showForm && (
        <div className="mb-5 grid gap-3 rounded-lg border border-white/10 bg-black/30 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs text-slate-300">
              Name
              <input className={inputCls()} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="AI / ML" />
            </label>
            <label className="grid gap-1 text-xs text-slate-300">
              Score (0-100)
              <input type="number" min={0} max={100} className={inputCls()} value={form.score} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} />
            </label>
          </div>
          <label className="grid gap-1 text-xs text-slate-300">
            Description
            <textarea className={`${inputCls()} min-h-16`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short category description" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs text-slate-300">
              Icon
              <select className={inputCls()} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                {ICON_OPTIONS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-xs text-slate-300">
              Accent Color
              <select className={inputCls()} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
                {COLOR_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            {editingId ? (
              <button onClick={handleUpdate} disabled={busy} className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50">
                Save Changes
              </button>
            ) : (
              <button onClick={handleCreate} disabled={busy} className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50">
                Create
              </button>
            )}
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:text-white">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {skills.map((s, index) => (
          <div key={s.id} className={`rounded-lg border p-4 transition ${s.enabled ? 'border-white/10 bg-white/[0.02]' : 'border-white/5 bg-black/20 opacity-70'}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(index, -1)} className="text-gray-500 hover:text-white" aria-label="Move up"><ChevronUp className="h-4 w-4" /></button>
                  <button onClick={() => move(index, 1)} className="text-gray-500 hover:text-white" aria-label="Move down"><ChevronDown className="h-4 w-4" /></button>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{s.name}</span>
                    {!s.enabled && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-400">hidden</span>}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: s.color }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: s.color }}>{s.score}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => toggleEnabled(s)} className="rounded-md p-2 text-gray-400 hover:text-white" title={s.enabled ? 'Disable' : 'Enable'}>
                  {s.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => openTechEditor(s)} className="rounded-md p-2 text-cyan-300 hover:text-white" title="Manage technologies"><Layers className="h-4 w-4" /></button>
                <button onClick={() => startEdit(s)} className="rounded-md p-2 text-gray-400 hover:text-white" title="Edit"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setConfirmDelete(s.id)} className="rounded-md p-2 text-red-300 hover:text-red-200" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>

            {techEditorId === s.id && (
              <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <input className={inputCls()} value={techEditor.name} onChange={(e) => setTechEditor({ ...techEditor, name: e.target.value })} placeholder="Technology name" />
                  <button onClick={() => { addTechnology(techEditor.name); setTechEditor({ name: '', enabled: true }) }} className="rounded-lg bg-cyan-400/20 px-3 py-2 text-cyan-200 hover:bg-cyan-400/30" title="Add"><Plus className="h-4 w-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(s.technologies || []).map((tech) => (
                    <span key={tech.id} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${tech.enabled ? 'border-white/10 bg-white/[0.04] text-gray-300' : 'border-white/5 bg-black/20 text-gray-600 line-through'}`}>
                      {tech.name}
                      <button onClick={() => toggleTech(s, tech.id)} className="text-gray-500 hover:text-white" title={tech.enabled ? 'Disable' : 'Enable'}>
                        {tech.enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </button>
                      <button onClick={() => removeTech(s, tech.id)} className="text-gray-500 hover:text-red-300" title="Remove"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-slate-950 p-6 text-center shadow-2xl">
            <Trash2 className="mx-auto mb-3 h-8 w-8 text-red-400" />
            <h3 className="text-lg font-bold text-white">Delete this category?</h3>
            <p className="mt-2 text-sm text-gray-400">
              This will permanently remove the category and all its technologies from your portfolio.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button onClick={() => setConfirmDelete(null)} className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-300 hover:text-white">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              >
                <Check className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
