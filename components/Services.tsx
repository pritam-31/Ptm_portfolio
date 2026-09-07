'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { WriteUnderline } from './ManimEffects'
import { 
  Cpu, 
  Globe, 
  Smartphone, 
  Box, 
  Sparkles, 
  Shield,
  Zap,
  Code
} from 'lucide-react'
import ServiceCard from './ServiceCard'

const services = [
  {
    icon: Globe,
    title: 'Full-Stack Development',
    description: 'MERN applications, responsive interfaces, REST APIs, authentication, and end-to-end feature delivery.',
    color: 'blue'
  },
  {
    icon: Code,
    title: 'Programming & DSA',
    description: 'C++, C, Python, data structures, algorithms, OOP, complexity analysis, and problem solving.',
    color: 'purple'
  },
  {
    icon: Cpu,
    title: 'Biomedical AI',
    description: 'LLM and MedGemma-4B vision-language workflows, fine-tuning, evaluation, and clinical insight interfaces.',
    color: 'green'
  },
  {
    icon: Box,
    title: 'Databases & Backend',
    description: 'MongoDB and MySQL schema design, queries, joins, Express.js APIs, and modular backend architecture.',
    color: 'orange'
  },
  {
    icon: Sparkles,
    title: 'Testing & Debugging',
    description: 'Unit and integration testing, code reviews, root-cause debugging, and validation workflows.',
    color: 'pink'
  },
  {
    icon: Shield,
    title: 'Cloud & Deployment',
    description: 'AWS fundamentals and hands-on deployment experience with Vercel, Netlify, Render, and GitHub.',
    color: 'red'
  },
  {
    icon: Zap,
    title: 'Agile Collaboration',
    description: 'Requirements gathering, Scrum-style delivery, stakeholder updates, documentation, and handoff.',
    color: 'yellow'
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'React Native and Expo cross-platform apps, Android development, Firebase, REST APIs, and AI-powered mobile features.',
    color: 'teal'
  }
]

export default function Services() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section id="services" className="py-24 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-space-grotesk text-4xl md:text-5xl font-bold text-white mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Capabilities</span>
          </h2>
          <WriteUnderline className="mt-4 mx-auto w-40" />
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            The engineering toolkit I use to turn ideas into working products
          </p>
        </motion.div>

        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
