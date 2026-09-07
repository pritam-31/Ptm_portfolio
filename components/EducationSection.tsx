'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GraduationCap, School, BookOpen } from 'lucide-react'
import { EducationItem } from '@/types'
import { useEducation } from '@/lib/education-api'
import { WriteUnderline } from './ManimEffects'

const themeMap = {
  cyan: {
    icon: GraduationCap,
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'hover:shadow-cyan-500/40',
    border: 'hover:border-cyan-400/40',
    text: 'text-cyan-400',
  },
  violet: {
    icon: School,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'hover:shadow-violet-500/40',
    border: 'hover:border-violet-400/40',
    text: 'text-violet-400',
  },
  emerald: {
    icon: BookOpen,
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'hover:shadow-emerald-500/40',
    border: 'hover:border-emerald-400/40',
    text: 'text-emerald-400',
  },
}

export default function EducationSection() {
  const educations = useEducation()
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const themeOf = (theme: EducationItem['theme']) => themeMap[theme ?? 'cyan'] ?? themeMap.cyan

  return (
    <section id="education" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.12),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 sm:mb-16 text-center">
          <span className="inline-block rounded-full border border-violet-400/25 bg-violet-500/15 px-4 py-1.5 text-sm font-medium text-violet-300">
            Education
          </span>
          <h2 className="mt-4 font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            My Academic{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">
              Journey
            </span>
          </h2>
          <WriteUnderline className="mt-4 mx-auto w-32" />
          <p className="mx-auto mt-4 max-w-2xl text-gray-400 text-base sm:text-lg">
            A strong foundation in electronics, computer science, and engineering.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {educations.map((edu, index) => {
            const colors = themeOf(edu.theme)
            const Icon = colors.icon

            return (
              <motion.article
                key={edu.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${colors.glow} ${colors.border}`}
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="font-space-grotesk text-lg font-bold leading-snug text-white mb-2">
                  {edu.degree}
                </h3>
                <p className="text-sm text-gray-400 mb-5">{edu.institution}</p>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                    {edu.period}
                  </span>
                  <span className={`rounded-full border border-white/[0.08] bg-white/[0.06] px-3 py-1 text-xs font-semibold ${colors.text}`}>
                    {edu.score}
                  </span>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}