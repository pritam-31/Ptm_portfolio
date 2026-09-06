'use client'

import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { ContentStat, ContentValue, SiteContent } from '@/types'
import { saveSiteContent, useSiteContent } from '@/lib/content-api'
import { contentIconKeys } from '@/lib/content-icons'

const STAT_ICON_LABELS: Record<string, string> = {
  award: 'Award',
  rocket: 'Rocket',
  globe: 'Globe',
  clock: 'Clock',
  target: 'Target',
  users: 'Users',
  shield: 'Shield',
  trending: 'Trending',
}

function inputCls() {
  return 'rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300'
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-white/10 bg-slate-950/80 p-5">
      <legend className="px-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">{title}</legend>
      <div className="grid gap-4">{children}</div>
    </fieldset>
  )
}

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
  rows,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  textarea?: boolean
  placeholder?: string
  rows?: number
}) {
  const shared = {
    value,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value),
    className: textarea ? `${inputCls()} min-h-20 resize-y` : inputCls(),
    placeholder,
  }
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      {label}
      {textarea ? <textarea {...shared} rows={rows} /> : <input {...shared} />}
    </label>
  )
}

export default function ContentForm() {
  const content = useSiteContent()
  const [draft, setDraft] = useState<SiteContent>(content)
  const dirtyRef = useRef(false)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!dirtyRef.current) setDraft(content)
  }, [content])

  const markDirty = () => {
    dirtyRef.current = true
  }

  const updateHero = (patch: Partial<SiteContent['hero']>) => {
    markDirty()
    setDraft((current) => ({ ...current, hero: { ...current.hero, ...patch } }))
  }

  const updateAbout = (patch: Partial<SiteContent['about']>) => {
    markDirty()
    setDraft((current) => ({ ...current, about: { ...current.about, ...patch } }))
  }

  const updateCta = (patch: Partial<SiteContent['cta']>) => {
    markDirty()
    setDraft((current) => ({ ...current, cta: { ...current.cta, ...patch } }))
  }

  const updateContact = (patch: Partial<SiteContent['contact']>) => {
    markDirty()
    setDraft((current) => ({ ...current, contact: { ...current.contact, ...patch } }))
  }

  const updateFooter = (patch: Partial<SiteContent['footer']>) => {
    markDirty()
    setDraft((current) => ({ ...current, footer: { ...current.footer, ...patch } }))
  }

  const updateStat = (index: number, patch: Partial<ContentStat>) => {
    markDirty()
    setDraft((current) => ({
      ...current,
      about: {
        ...current.about,
        stats: current.about.stats.map((stat, i) => (i === index ? { ...stat, ...patch } : stat)),
      },
    }))
  }

  const addStat = () => {
    markDirty()
    setDraft((current) => ({
      ...current,
      about: { ...current.about, stats: [...current.about.stats, { icon: 'award', number: '', label: '' }] },
    }))
  }

  const removeStat = (index: number) => {
    markDirty()
    setDraft((current) => ({
      ...current,
      about: { ...current.about, stats: current.about.stats.filter((_, i) => i !== index) },
    }))
  }

  const updateValue = (index: number, patch: Partial<ContentValue>) => {
    markDirty()
    setDraft((current) => ({
      ...current,
      about: {
        ...current.about,
        values: current.about.values.map((value, i) => (i === index ? { ...value, ...patch } : value)),
      },
    }))
  }

  const addValue = () => {
    markDirty()
    setDraft((current) => ({
      ...current,
      about: { ...current.about, values: [...current.about.values, { icon: 'target', title: '', description: '' }] },
    }))
  }

  const removeValue = (index: number) => {
    markDirty()
    setDraft((current) => ({
      ...current,
      about: { ...current.about, values: current.about.values.filter((_, i) => i !== index) },
    }))
  }

  const updateCtaStat = (index: number, next: string) => {
    markDirty()
    setDraft((current) => ({
      ...current,
      cta: { ...current.cta, stats: current.cta.stats.map((stat, i) => (i === index ? next : stat)) },
    }))
  }

  const addCtaStat = () => {
    markDirty()
    setDraft((current) => ({ ...current, cta: { ...current.cta, stats: [...current.cta.stats, ''] } }))
  }

  const removeCtaStat = (index: number) => {
    markDirty()
    setDraft((current) => ({
      ...current,
      cta: { ...current.cta, stats: current.cta.stats.filter((_, i) => i !== index) },
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setStatus('')
    try {
      const saved = await saveSiteContent(draft)
      dirtyRef.current = false
      setDraft(saved)
      setStatus('Site content saved')
    } catch (error) {
      setStatus((error as Error).message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <Group title="Hero">
        <Field label="Role badge" value={draft.hero.badge} onChange={(next) => updateHero({ badge: next })} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Greeting" value={draft.hero.greeting} onChange={(next) => updateHero({ greeting: next })} />
          <Field label="Name" value={draft.hero.name} onChange={(next) => updateHero({ name: next })} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Headline line 1" value={draft.hero.titleLine1} onChange={(next) => updateHero({ titleLine1: next })} />
          <Field label="Headline accent" value={draft.hero.titleAccent} onChange={(next) => updateHero({ titleAccent: next })} />
        </div>
        <Field label="Description" value={draft.hero.description} onChange={(next) => updateHero({ description: next })} textarea rows={3} />
      </Group>

      <Group title="About">
        <Field label="Badge" value={draft.about.badge} onChange={(next) => updateAbout({ badge: next })} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Heading" value={draft.about.heading} onChange={(next) => updateAbout({ heading: next })} />
          <Field label="Heading accent" value={draft.about.headingAccent} onChange={(next) => updateAbout({ headingAccent: next })} />
        </div>
        <Field label="Intro paragraph" value={draft.about.paragraph1} onChange={(next) => updateAbout({ paragraph1: next })} textarea rows={2} />
        <Field label="Detail paragraph" value={draft.about.paragraph2} onChange={(next) => updateAbout({ paragraph2: next })} textarea rows={3} />

        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="mb-3 text-sm font-medium text-slate-300">Stats</p>
          <div className="space-y-2">
            {draft.about.stats.map((stat, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2">
                <select value={stat.icon} onChange={(event) => updateStat(index, { icon: event.target.value })} className={inputCls()}>
                  {contentIconKeys.map((key) => (
                    <option key={key} value={key}>
                      {STAT_ICON_LABELS[key] ?? key}
                    </option>
                  ))}
                </select>
                <input value={stat.number} onChange={(event) => updateStat(index, { number: event.target.value })} className={`${inputCls()} w-20`} placeholder="8.95" />
                <input value={stat.label} onChange={(event) => updateStat(index, { label: event.target.value })} className={`${inputCls()} flex-1`} placeholder="CGPA / 10" />
                <button type="button" onClick={() => removeStat(index)} className="rounded-lg border border-white/10 p-2 text-red-300 transition hover:border-red-300/40">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addStat} className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-cyan-300 transition hover:border-cyan-300/40">
            <Plus className="h-3.5 w-3.5" />
            Add stat
          </button>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="mb-3 text-sm font-medium text-slate-300">What I Bring (values)</p>
          <div className="space-y-3">
            {draft.about.values.map((value, index) => (
              <div key={index} className="rounded-lg border border-white/[0.08] bg-black/40 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <select value={value.icon} onChange={(event) => updateValue(index, { icon: event.target.value })} className={inputCls()}>
                    {contentIconKeys.map((key) => (
                      <option key={key} value={key}>
                        {STAT_ICON_LABELS[key] ?? key}
                      </option>
                    ))}
                  </select>
                  <input value={value.title} onChange={(event) => updateValue(index, { title: event.target.value })} className={`${inputCls()} flex-1`} placeholder="Title" />
                  <button type="button" onClick={() => removeValue(index)} className="rounded-lg border border-white/10 p-2 text-red-300 transition hover:border-red-300/40">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea value={value.description} onChange={(event) => updateValue(index, { description: event.target.value })} className={`${inputCls()} min-h-16 w-full resize-y`} placeholder="Description" />
              </div>
            ))}
          </div>
          <button type="button" onClick={addValue} className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-cyan-300 transition hover:border-cyan-300/40">
            <Plus className="h-3.5 w-3.5" />
            Add value
          </button>
        </div>
      </Group>

      <Group title="CTA (Call to Action)">
        <Field label="Badge" value={draft.cta.badge} onChange={(next) => updateCta({ badge: next })} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Heading" value={draft.cta.heading} onChange={(next) => updateCta({ heading: next })} />
          <Field label="Heading accent" value={draft.cta.headingAccent} onChange={(next) => updateCta({ headingAccent: next })} />
        </div>
        <Field label="Paragraph" value={draft.cta.paragraph} onChange={(next) => updateCta({ paragraph: next })} textarea rows={2} />
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-300">Info chips</p>
          {draft.cta.stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2">
              <input value={stat} onChange={(event) => updateCtaStat(index, event.target.value)} className={`${inputCls()} flex-1`} placeholder="CGPA 8.95 / 10" />
              <button type="button" onClick={() => removeCtaStat(index)} className="rounded-lg border border-white/10 p-2 text-red-300 transition hover:border-red-300/40">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addCtaStat} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-cyan-300 transition hover:border-cyan-300/40">
            <Plus className="h-3.5 w-3.5" />
            Add chip
          </button>
        </div>
      </Group>

      <Group title="Contact & Footer">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email" value={draft.contact.email} onChange={(next) => updateContact({ email: next })} />
          <Field label="Phone (display)" value={draft.contact.phone} onChange={(next) => updateContact({ phone: next })} />
          <Field label="Phone (raw for tel: link)" value={draft.contact.phoneRaw} onChange={(next) => updateContact({ phoneRaw: next })} />
          <Field label="Location" value={draft.contact.location} onChange={(next) => updateContact({ location: next })} />
        </div>
        <Field label="Footer tagline" value={draft.footer.tagline} onChange={(next) => updateFooter({ tagline: next })} textarea rows={2} />
      </Group>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save className="h-4 w-4" />
          {busy ? 'Saving...' : 'Save Site Content'}
        </button>
        {status ? <p className="text-sm text-cyan-200">{status}</p> : null}
      </div>
    </form>
  )
}