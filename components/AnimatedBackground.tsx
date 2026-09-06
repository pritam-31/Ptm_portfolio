'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{
      x: number
      y: number
      dx: number
      dy: number
      size: number
      opacity: number
      hue: number
    }> = []
    let wireframes: Array<{
      x: number
      y: number
      dx: number
      dy: number
      size: number
      angle: number
      rotation: number
      opacity: number
      color: string
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initParticles = () => {
      particles = []
      wireframes = []
      const count = Math.min(130, Math.floor((window.innerWidth * window.innerHeight) / 12000))
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          hue: Math.random() > 0.72 ? 168 : 204,
        })
      }

      const wireframeCount = Math.min(10, Math.max(5, Math.floor(window.innerWidth / 220)))
      for (let i = 0; i < wireframeCount; i++) {
        wireframes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.18,
          dy: (Math.random() - 0.5) * 0.18,
          size: 24 + Math.random() * 34,
          angle: Math.random() * Math.PI,
          rotation: (Math.random() - 0.5) * 0.008,
          opacity: 0.16 + Math.random() * 0.24,
          color: Math.random() > 0.5 ? '#1d4ed8' : '#7c3aed',
        })
      }
    }

    const draw = () => {
      const time = performance.now() * 0.001
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const grid = 96
      const drift = (time * 18) % grid
      ctx.save()
      ctx.strokeStyle = 'rgba(29, 78, 216, 0.12)'
      ctx.lineWidth = 1
      for (let x = -grid + drift; x < canvas.width + grid; x += grid) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = -grid + drift * 0.55; y < canvas.height + grid; y += grid) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
      ctx.restore()

      wireframes.forEach((shape) => {
        shape.x += shape.dx
        shape.y += shape.dy
        shape.angle += shape.rotation

        if (shape.x < -shape.size) shape.x = canvas.width + shape.size
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size

        ctx.save()
        ctx.translate(shape.x, shape.y)
        ctx.rotate(shape.angle)
        ctx.strokeStyle = shape.color === '#7c3aed'
          ? `rgba(124, 58, 237, ${shape.opacity})`
          : `rgba(14, 165, 233, ${shape.opacity})`
        ctx.lineWidth = 1
        ctx.shadowBlur = 16
        ctx.shadowColor = shape.color
        ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size)
        ctx.beginPath()
        ctx.moveTo(-shape.size / 2, -shape.size / 2)
        ctx.lineTo(shape.size / 2, shape.size / 2)
        ctx.moveTo(shape.size / 2, -shape.size / 2)
        ctx.lineTo(-shape.size / 2, shape.size / 2)
        ctx.stroke()
        ctx.restore()
      })
      
      particles.forEach((particle, i) => {
        particle.x += particle.dx
        particle.y += particle.dy
        
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.shadowBlur = 12
        ctx.shadowColor = particle.hue === 168 ? '#22d3ee' : '#3b82f6'
        ctx.fillStyle = particle.hue === 168
          ? `rgba(34, 211, 238, ${particle.opacity})`
          : `rgba(59, 130, 246, ${particle.opacity})`
        ctx.fill()
        ctx.shadowBlur = 0
        
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x
          const dy = particles[j].y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })
      
      animationId = requestAnimationFrame(draw)
    }

    resize()
    initParticles()
    draw()

    const handleResize = () => {
      resize()
      initParticles()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.62 }}
    />
  )
}
