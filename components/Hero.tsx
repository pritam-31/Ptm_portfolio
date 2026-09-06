'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import ThreeScene from './ThreeScene'
import { useSiteContent } from '@/lib/content-api'

const PHOTO_SRC = 'https://github.com/pritam-31.png?size=512'

export default function Hero() {
  const [photoFailed, setPhotoFailed] = useState(false)
  const hero = useSiteContent().hero

  const photo = photoFailed ? (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/25 via-slate-900 to-blue-600/25">
      <span className="font-space-grotesk text-5xl font-bold text-white">PP</span>
    </div>
  ) : (
    <img
      src={PHOTO_SRC}
      alt="Pritam Padhan"
      onError={() => setPhotoFailed(true)}
      className="h-full w-full object-cover"
    />
  )

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/82 via-black/52 to-slate-950/20" />

      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 flex justify-center lg:hidden"
            >
              <div className="relative">
                <div className="absolute -inset-3 animate-[tech-orbit_24s_linear_infinite] rounded-full border-2 border-dashed border-cyan-400/25" />
                <div className="h-28 w-28 sm:h-36 sm:w-36 overflow-hidden rounded-full border-2 border-cyan-400/40 bg-slate-900 shadow-[0_0_35px_rgba(34,211,238,0.35)]">
                  {photo}
                </div>
              </div>
            </motion.div>

            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="inline-block px-4 py-1.5 bg-cyan-500/15 text-cyan-300 rounded-full text-sm font-medium mb-6 border border-cyan-400/25">
              {hero.badge}
            </motion.span>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="font-space-grotesk text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              <span className="mb-4 block text-2xl sm:text-3xl md:text-4xl font-semibold text-white/95">
                {hero.greeting}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">
                  {hero.name}
                </span>
              </span>
              {hero.titleLine1}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">{hero.titleAccent}</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="text-xl text-gray-300 mb-8 max-w-2xl">
              {hero.description}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex flex-wrap gap-4">
              <Link href="/contact" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full font-medium transition-all hover:shadow-2xl hover:shadow-cyan-500/25 text-lg">
                View My Work
              </Link>
              <Link href="/about" className="px-8 py-4 border border-gray-600 hover:border-cyan-300 text-white rounded-full font-medium transition-all hover:bg-white/5">
                More About Me
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl xl:h-72 xl:w-72" />
              <div
                className="tech-orbit-ring absolute h-80 w-80 rounded-full border border-dashed border-cyan-300/25 xl:h-96 xl:w-96"
                style={{ animationDuration: '40s' }}
              />
              <div className="absolute h-[17rem] w-[17rem] rounded-full border border-cyan-400/15 xl:h-[20rem] xl:w-[20rem]" />
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-2 border-white/10 bg-slate-900 shadow-[0_0_50px_rgba(34,211,238,0.25)] xl:h-80 xl:w-80">
                {photo}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}