'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CursorEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updateMousePosition = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const interactive = target.closest('a, button, [role="button"], input, textarea, select')
      setIsHovering(Boolean(interactive))
    }

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null
  }

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] mix-blend-screen"
        animate={{
          x: mousePosition.x - 18,
          y: mousePosition.y - 18,
          scale: isHovering ? 1.6 : 1,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
          mass: 0.6,
        }}
      >
        <div className="h-9 w-9 rounded-full bg-cyan-300/30 shadow-[0_0_25px_rgba(34,211,238,0.8)]" />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[998]"
        animate={{
          x: mousePosition.x - 10,
          y: mousePosition.y - 10,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 1 : 0.9,
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 26,
          mass: 0.8,
        }}
      >
        <div className="h-5 w-5 rounded-full border border-cyan-200/80 bg-white/20 shadow-[0_0_18px_rgba(103,232,249,0.7)]" />
      </motion.div>
    </>
  )
}
