'use client'

import { useEffect, useRef, useState } from 'react'
import { markPhotoAnimationPlayed, shouldPlayPhotoAnimation, whenSplashDone } from '@/lib/splash-state'

type Particle = {
  x: number
  y: number
  tx: number
  ty: number
  size: number
  color: string
  delay: number
  seed: number
}

export default function ParticlePhoto({ src, onError }: { src: string; onError?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(() => !shouldPlayPhotoAnimation())
  const settledRef = useRef(false)
  const loadedRef = useRef(false)
  const splashReadyRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!shouldPlayPhotoAnimation()) {
      return () => {}
    }

    let animId = 0
    let particles: Particle[] = []
    let started = false

    const tryReveal = () => {
      if (settledRef.current && loadedRef.current) setRevealed(true)
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      loadedRef.current = true
      tryRun()
    }
    img.onerror = () => onError?.()
    img.src = src

    const assemble = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      const w = Math.max(2, Math.round(rect.width))
      const h = Math.max(2, Math.round(rect.height))
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      const off = document.createElement('canvas')
      off.width = canvas.width
      off.height = canvas.height
      const octx = off.getContext('2d', { willReadFrequently: true })
      if (!octx) return

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      octx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh)
      const data = octx.getImageData(0, 0, canvas.width, canvas.height).data

      const radius = Math.min(canvas.width, canvas.height) / 2
      const targetCount = 2400
      const step = Math.max(5, Math.round(Math.sqrt((Math.PI * radius * radius) / targetCount)))
      const cx = canvas.width / 2
      const cy = canvas.height / 2

      particles = []
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const dx = x - cx
          const dy = y - cy
          if (dx * dx + dy * dy > radius * radius) continue
          const idx = (y * canvas.width + x) * 4
          const alpha = data[idx + 3] / 255
          if (alpha < 0.1) continue

          const angle = Math.random() * Math.PI * 2
          const dist = radius * (0.9 + Math.random() * 1.5)
          particles.push({
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
            tx: x,
            ty: y,
            size: Math.max(1, step * 0.5 * (0.6 + Math.random() * 0.9)),
            color: `rgba(${data[idx]},${data[idx + 1]},${data[idx + 2]},${alpha})`,
            delay: Math.random() * 0.7,
            seed: Math.random() * Math.PI * 2,
          })
        }
      }
    }

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const duration = 2600
      const start = now
      const render = (time: number) => {
        const elapsed = time - start
        let settledAll = true

        for (const p of particles) {
          const t = Math.max(0, Math.min(1, (elapsed - p.delay * 1000) / duration))
          const eased = 1 - Math.pow(1 - t, 3)
          const wobble = Math.sin(time * 0.0015 + p.seed) * 1.6 * (1 - t)
          const x = p.x + (p.tx - p.x) * eased + wobble
          const y = p.y + (p.ty - p.y) * eased

          ctx.globalAlpha = Math.min(1, t * 1.6 + 0.15)
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(x, y, p.size, 0, Math.PI * 2)
          ctx.fill()

          if (t < 1) settledAll = false
        }
        ctx.globalAlpha = 1

        if (settledAll) {
          started = false
          settledRef.current = true
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          tryReveal()
          return
        }
        animId = requestAnimationFrame(render)
      }
      animId = requestAnimationFrame(render)
    }

    const tryRun = () => {
      if (started || !splashReadyRef.current || !loadedRef.current) return
      if (canvas.getBoundingClientRect().width <= 0) return
      started = true
      markPhotoAnimationPlayed()
      settledRef.current = false
      setRevealed(false)
      assemble()
      animId = requestAnimationFrame(draw)
    }

    const unsub = whenSplashDone(() => {
      splashReadyRef.current = true
      tryRun()
    })

    const ro = new ResizeObserver(() => tryRun())
    ro.observe(canvas)

    return () => {
      started = false
      cancelAnimationFrame(animId)
      ro.disconnect()
      unsub()
    }
  }, [src, onError])

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Pritam Padhan"
        onLoad={() => {
          loadedRef.current = true
          if (settledRef.current) setRevealed(true)
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${revealed ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}