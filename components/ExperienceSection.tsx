'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Code2, Cpu, Trophy } from 'lucide-react'
import { Experience } from '@/types'
import { useExperience } from '@/lib/experience-api'

const iconMap = {
  internship: Briefcase,
  work: Code2,
  hackathon: Trophy,
  project: Cpu,
}

const colorMap = {
  internship: { gradient: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/40', border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  work: { gradient: 'from-blue-500 to-violet-600', glow: 'shadow-blue-500/40', border: 'border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500/10' },
  hackathon: { gradient: 'from-yellow-500 to-orange-600', glow: 'shadow-yellow-500/40', border: 'border-yellow-500/30', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  project: { gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/40', border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
}

function useInViewOnce(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

function TimelineNode({ type, inView, delay }: { type: Experience['type']; inView: boolean; delay: number }) {
  const colors = colorMap[type]
  const Icon = iconMap[type]

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`absolute h-10 w-10 rounded-full ${colors.bg} transition-all duration-500 ${
          inView ? `opacity-100 scale-100 shadow-lg ${colors.glow}` : 'opacity-0 scale-50'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      />
      <div
        className={`absolute h-6 w-6 rounded-full bg-gradient-to-br ${colors.gradient} transition-all duration-500 ${
          inView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{ transitionDelay: `${delay + 100}ms` }}
      />
      <div className="relative z-10 flex h-10 w-10 items-center justify-center">
        <Icon className="h-4 w-4 text-white" />
      </div>
    </div>
  )
}

function ExperienceCard({ exp, index, inView }: { exp: Experience; index: number; inView: boolean }) {
  const isLeft = index % 2 === 0
  const colors = colorMap[exp.type]
  const delay = index * 120

  return (
    <>
      {/* Desktop layout — hidden below lg */}
      <div className="hidden lg:contents">
        {isLeft ? (
          <>
            <div
              className="exp-card-left min-w-0"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(-50px)',
                filter: inView ? 'blur(0)' : 'blur(4px)',
                transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms, filter 600ms ease ${delay}ms`,
              }}
            >
              <CardInner exp={exp} colors={colors} />
            </div>
            <div className="flex items-start justify-center pt-6">
              <TimelineNode type={exp.type} inView={inView} delay={delay} />
            </div>
            <div />
          </>
        ) : (
          <>
            <div />
            <div className="flex items-start justify-center pt-6">
              <TimelineNode type={exp.type} inView={inView} delay={delay} />
            </div>
            <div
              className="exp-card-right min-w-0"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(50px)',
                filter: inView ? 'blur(0)' : 'blur(4px)',
                transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms, filter 600ms ease ${delay}ms`,
              }}
            >
              <CardInner exp={exp} colors={colors} />
            </div>
          </>
        )}
      </div>

      {/* Mobile layout — visible below lg */}
      <div className="flex lg:hidden gap-4">
        <div className="flex flex-col items-center flex-shrink-0">
          <TimelineNode type={exp.type} inView={inView} delay={delay} />
          <div className="w-px flex-1 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
        <div
          className="flex-1 min-w-0 pb-8"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            filter: inView ? 'blur(0)' : 'blur(4px)',
            transition: `opacity 500ms ease ${delay}ms, transform 500ms ease ${delay}ms, filter 500ms ease ${delay}ms`,
          }}
        >
          <CardInner exp={exp} colors={colors} />
        </div>
      </div>
    </>
  )
}

function CardInner({ exp, colors }: { exp: Experience; colors: typeof colorMap[keyof typeof colorMap] }) {
  return (
    <div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/[0.15] hover:shadow-[0_8px_40px_rgba(34,211,238,0.08)]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs font-medium ${colors.text}`}>{exp.period}</span>
          <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-gray-400">
            {exp.duration}
          </span>
        </div>

        <h3 className="font-space-grotesk text-lg sm:text-xl font-bold leading-snug text-white mb-1.5 group-hover:text-cyan-300 transition-colors duration-300">
          {exp.role}
        </h3>

        <p className={`text-sm font-semibold ${colors.text} mb-0.5`}>{exp.company}</p>
        {exp.location && (
          <p className="text-xs text-gray-500 mb-3">{exp.location}</p>
        )}
        {!exp.location && <div className="mb-3" />}

        <ul className="space-y-2 mb-4">
          {exp.highlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-300">
              <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-br ${colors.gradient}`} />
              <span className="min-w-0 overflow-wrap-break-word">{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {exp.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-gray-300 transition-colors duration-300 group-hover:border-white/[0.15] group-hover:text-gray-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ExperienceSection() {
  const experiences = useExperience()
  const { ref: headerRef, inView: headerInView } = useInViewOnce(0.3)
  const { ref: timelineRef, inView: timelineInView } = useInViewOnce(0.05)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  return (
    <section id="experience" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_50%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(59,130,246,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.12)_1px,transparent_1px)] [background-size:80px_80px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 sm:mb-18 text-center"
        >
          <span className="inline-block rounded-full border border-cyan-400/25 bg-cyan-500/15 px-4 py-1.5 text-sm font-medium text-cyan-300">
            Experience
          </span>
          <h2 className="mt-4 font-space-grotesk text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Where I&apos;ve{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">
              Worked & Built
            </span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Desktop vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 hidden lg:block -translate-x-1/2">
            <div className="relative h-full w-px">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/40 via-blue-500/25 to-transparent" />
              <div
                className="absolute inset-0 w-px bg-gradient-to-b from-cyan-400/60 via-blue-400/40 to-transparent"
                style={{
                  animation: reducedMotion ? 'none' : 'timeline-glow 3s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_70px_1fr] lg:gap-6 xl:gap-8">
            {experiences.map((exp, index) => (
              <ExperienceCard key={exp.id} exp={exp} index={index} inView={reducedMotion || timelineInView} />
            ))}
          </div>

          {/* Mobile single column */}
          <div className="lg:hidden">
            {experiences.map((exp, index) => (
              <ExperienceCard key={exp.id} exp={exp} index={index} inView={reducedMotion || timelineInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
