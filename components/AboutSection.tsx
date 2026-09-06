'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useSiteContent } from '@/lib/content-api'
import { contentIcon } from '@/lib/content-icons'

export default function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const about = useSiteContent().about
  const stats = about.stats.map((stat) => ({ ...stat, icon: contentIcon(stat.icon) }))
  const values = about.values.map((value) => ({ ...value, icon: contentIcon(value.icon) }))

  return (
    <section className="py-24 bg-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20 mb-4">
              {about.badge}
            </span>
            
            <h2 className="font-space-grotesk text-4xl md:text-5xl font-bold text-white mb-6">
              {about.heading}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 block">
                {about.headingAccent}
              </span>
            </h2>

            <p className="text-gray-300 text-lg mb-6">
              {about.paragraph1}
            </p>

            <p className="text-gray-400 mb-8">
              {about.paragraph2}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 border border-gray-800 rounded-xl p-4 text-center hover:border-blue-500/30 transition-colors"
                >
                  <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">What I Bring</h3>
            
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group flex gap-4 p-6 rounded-xl bg-white/5 border border-gray-800 hover:border-blue-500/30 transition-all hover:bg-white/10 cursor-pointer"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                    {value.title}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
