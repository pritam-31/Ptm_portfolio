'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { CSSProperties } from 'react'
import {
  SiCplusplus,
  SiGithub,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTailwindcss,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import { IconType } from 'react-icons'

type TechItem = {
  icon: IconType
  name: string
  color: string
  ring: 1 | 2 | 3
}

const techStack: TechItem[] = [
  { icon: SiJavascript, name: 'JavaScript', color: '#F7DF1E', ring: 1 },
  { icon: SiCplusplus, name: 'C / C++', color: '#659AD2', ring: 1 },
  { icon: SiReact, name: 'React', color: '#61DAFB', ring: 1 },
  { icon: SiNextdotjs, name: 'Next.js', color: '#FFFFFF', ring: 1 },
  { icon: SiPython, name: 'Python', color: '#FFD343', ring: 2 },
  { icon: SiNodedotjs, name: 'Node.js', color: '#5FA04E', ring: 2 },
  { icon: SiTailwindcss, name: 'Tailwind', color: '#06B6D4', ring: 2 },
  { icon: SiMongodb, name: 'MongoDB', color: '#47A248', ring: 3 },
  { icon: SiGithub, name: 'Git / GitHub', color: '#E5E7EB', ring: 3 },
  { icon: SiMysql, name: 'MySQL', color: '#4479A1', ring: 3 },
  { icon: FaAws, name: 'AWS', color: '#FF9900', ring: 3 },
]

const ringSize = {
  1: 'h-40 w-40 sm:h-56 sm:w-56',
  2: 'h-64 w-64 sm:h-80 sm:w-80',
  3: 'h-[min(21rem,calc(100vw-2rem))] w-[min(21rem,calc(100vw-2rem))] sm:h-[30rem] sm:w-[30rem]',
}

const ringSpeed = {
  1: '22s',
  2: '34s',
  3: '46s',
}

const ringRadius = {
  1: '5rem',
  2: '8rem',
  3: 'min(10.5rem, calc((100vw - 2rem) / 2))',
}

export default function TechStack() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.9),rgba(8,13,28,0.76)_48%,rgba(0,0,0,0.92))]" />
      <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(59,130,246,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.22)_1px,transparent_1px)] [background-size:110px_110px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Engineering Toolkit</p>
          <h2 className="mb-5 font-space-grotesk text-3xl font-bold text-white md:text-5xl">
            One system for AI, full-stack, and software foundations
          </h2>
          <p className="max-w-xl text-lg leading-8 text-slate-300">
            Technologies I use across research prototypes, web applications, APIs, databases, and deployment workflows.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="relative mx-auto flex aspect-square w-full max-w-[34rem] items-center justify-center overflow-visible"
        >
          <div className="absolute h-28 w-28 rounded-full border border-cyan-300/25 bg-cyan-300/10 blur-2xl" />
          <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-cyan-300/30 bg-slate-950/90 shadow-2xl shadow-cyan-500/20">
            <SiPython className="h-12 w-12 text-cyan-300" />
          </div>

          {[1, 2, 3].map((ring) => {
            const ringKey = ring as 1 | 2 | 3
            const items = techStack.filter((tech) => tech.ring === ringKey)

            return (
              <div
                key={ring}
                className={`tech-orbit-ring absolute rounded-full border border-cyan-300/18 ${ringSize[ringKey]}`}
                style={{
                  '--orbit-radius': ringRadius[ringKey],
                  animationDuration: ringSpeed[ringKey],
                  animationDirection: ring === 2 ? 'reverse' : 'normal',
                } as CSSProperties}
              >
                {items.map((tech, index) => {
                  const angle = (360 / items.length) * index

                  return (
                    <div
                      key={tech.name}
                      className="tech-orbit-item group"
                      style={{ transform: `rotate(${angle}deg) translateX(var(--orbit-radius)) rotate(-${angle}deg)` }}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-slate-950/85 shadow-xl backdrop-blur transition group-hover:scale-110 sm:h-16 sm:w-16">
                        <tech.icon className="h-8 w-8 sm:h-9 sm:w-9" style={{ color: tech.color }} />
                      </div>
                      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/80 px-2 py-1 text-[11px] text-slate-200 opacity-0 transition group-hover:opacity-100">
                        {tech.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
