'use client'

import { motion } from 'framer-motion'

/**
 * Manim-style "Write" / "Create" animation.
 * Animates an SVG path being drawn from its start to end.
 */
export function WritePath({
  d,
  stroke = '#22d3ee',
  strokeWidth = 1.5,
  duration = 1.8,
  delay = 0.3,
  opacity = 0.4,
  className = '',
}: {
  d: string
  stroke?: string
  strokeWidth?: number
  duration?: number
  delay?: number
  opacity?: number
  className?: string
}) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 600 600"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="manim-write-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <motion.path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ opacity }}
      />
    </svg>
  )
}

/**
 * Manim-style heading underline that "writes" itself in from the left.
 */
export function WriteUnderline({
  className = '',
  delay = 0.2,
}: {
  className?: string
  delay?: number
}) {
  return (
    <motion.span
      aria-hidden
      className={`block origin-left h-[2px] w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}
