'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
  index: number
}

const colorMap = {
  blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/20 hover:border-blue-500/50',
  purple: 'from-purple-600/20 to-purple-600/5 border-purple-500/20 hover:border-purple-500/50',
  green: 'from-green-600/20 to-green-600/5 border-green-500/20 hover:border-green-500/50',
  orange: 'from-orange-600/20 to-orange-600/5 border-orange-500/20 hover:border-orange-500/50',
  pink: 'from-pink-600/20 to-pink-600/5 border-pink-500/20 hover:border-pink-500/50',
  red: 'from-red-600/20 to-red-600/5 border-red-500/20 hover:border-red-500/50',
  yellow: 'from-yellow-600/20 to-yellow-600/5 border-yellow-500/20 hover:border-yellow-500/50',
  teal: 'from-teal-600/20 to-teal-600/5 border-teal-500/20 hover:border-teal-500/50',
}

const iconColorMap = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
  pink: 'text-pink-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  teal: 'text-teal-400',
}

const iconGradientMap = {
  blue: 'from-blue-500/20 to-blue-500/5',
  purple: 'from-purple-500/20 to-purple-500/5',
  green: 'from-green-500/20 to-green-500/5',
  orange: 'from-orange-500/20 to-orange-500/5',
  pink: 'from-pink-500/20 to-pink-500/5',
  red: 'from-red-500/20 to-red-500/5',
  yellow: 'from-yellow-500/20 to-yellow-500/5',
  teal: 'from-teal-500/20 to-teal-500/5',
}

const glowGradientMap = {
  blue: 'from-blue-500/20 to-transparent',
  purple: 'from-purple-500/20 to-transparent',
  green: 'from-green-500/20 to-transparent',
  orange: 'from-orange-500/20 to-transparent',
  pink: 'from-pink-500/20 to-transparent',
  red: 'from-red-500/20 to-transparent',
  yellow: 'from-yellow-500/20 to-transparent',
  teal: 'from-teal-500/20 to-transparent',
}

export default function ServiceCard({ icon: Icon, title, description, color, index }: ServiceCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative p-6 rounded-2xl bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
    >
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconGradientMap[color as keyof typeof iconGradientMap]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${iconColorMap[color as keyof typeof iconColorMap]}`} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-blue-400 text-sm font-medium inline-flex items-center gap-1">
            Learn More →
          </span>
        </div>
      </div>
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${glowGradientMap[color as keyof typeof glowGradientMap]} blur-xl rounded-2xl`} />
      </div>
    </motion.div>
  )
}
