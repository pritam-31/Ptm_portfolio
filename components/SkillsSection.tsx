'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Lock, Wrench } from 'lucide-react'
import { fetchPublicSkills, PublicSkill } from '@/lib/skills-api'
import { techIcon, categoryIcon } from '@/lib/skill-icons'
import { WriteUnderline } from './ManimEffects'

function SkillLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-14 sm:py-20">
      <div className="relative h-28 w-28 sm:h-36 sm:w-36 lg:h-40 lg:w-40">
        <div className="absolute inset-0 rounded-full border border-cyan-400/20" />
        <div className="absolute inset-3 rounded-full border border-cyan-400/15 border-t-cyan-400/60 animate-spin" />
        <div className="absolute inset-6 rounded-full border border-blue-500/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Wrench className="h-7 w-7 sm:h-8 sm:w-8 text-cyan-300 animate-pulse" />
        </div>
      </div>
      <p className="mt-5 sm:mt-6 text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase text-cyan-300/70 animate-pulse">
        Loading Skills
      </p>
    </div>
  )
}

export default function SkillsSection() {
  const [categories, setCategories] = useState<PublicSkill[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'empty'>('loading')

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const data = await fetchPublicSkills()
      if (!data.length) {
        setStatus('empty')
        setCategories([])
        return
      }
      setCategories(data)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <section id="skills" className="relative py-14 sm:py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14 lg:mb-16 text-center">
          <span className="inline-block rounded-full border border-cyan-400/25 bg-cyan-500/15 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-cyan-300">
            Skills & Technologies
          </span>
          <h2 className="mt-4 font-space-grotesk text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            What I{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">
              Bring to the Table
            </span>
          </h2>
          <WriteUnderline className="mt-4 mx-auto w-32" />
          <p className="mt-4 max-w-2xl mx-auto text-gray-400 text-base sm:text-lg">
            A categorized view of the tools and technologies I use to design, build, and ship products end-to-end.
          </p>
        </div>

        {status === 'loading' && <SkillLoadingState />}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Lock className="h-10 w-10 text-red-400/60" />
            <p className="mt-4 text-gray-400 text-sm sm:text-base">Skills temporarily unavailable.</p>
            <button onClick={load} className="mt-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-200 hover:bg-cyan-400/20">
              Retry
            </button>
          </div>
        )}

        {status === 'empty' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Wrench className="h-10 w-10 text-cyan-300/60" />
            <p className="mt-4 text-gray-400 text-sm sm:text-base">Skills are being updated.</p>
          </div>
        )}

        {status === 'ready' && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, index) => {
              const CatIcon = categoryIcon(cat.icon)
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-4 sm:p-5 lg:p-6 transition-colors duration-300 hover:border-white/[0.16]"
                >
                  <div
                    className="pointer-events-none absolute -top-10 -right-10 h-32 sm:h-40 w-32 sm:w-40 rounded-full blur-3xl opacity-15 transition-opacity duration-500 group-hover:opacity-35"
                    style={{ backgroundColor: cat.color }}
                  />

                  <div className="relative flex items-center gap-2.5 sm:gap-3">
                    <span
                      className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border shadow-lg"
                      style={{ borderColor: `${cat.color}40`, backgroundColor: `${cat.color}14`, color: cat.color }}
                    >
                      <CatIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px] lg:h-5 lg:w-5" />
                    </span>
                    <h3 className="font-space-grotesk text-base sm:text-lg lg:text-xl font-bold text-white leading-tight">{cat.name}</h3>
                  </div>

                  <p className="relative mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-gray-400">
                    {cat.description || 'No description available.'}
                  </p>

                  <div className="mt-4 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
                    {cat.technologies.map((tech, techIndex) => {
                      const TechIcon = techIcon(tech.name)
                      return (
                        <motion.span
                          key={tech.id}
                          initial={{ opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                          className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-200 transition-colors duration-300 hover:border-white/[0.22] hover:bg-white/[0.08]"
                          style={TechIcon ? {} : { color: cat.color }}
                        >
                          {TechIcon && <TechIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />}
                          {tech.name}
                        </motion.span>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
