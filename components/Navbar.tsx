'use client'

import { useState, useEffect, useCallback, type MouseEvent } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, Phone, ShieldCheck, X } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Skills', href: '/#skills' },
  { name: 'Experience', href: '/#experience' },
  { name: 'Education', href: '/#education' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      const target = document.getElementById(hash)
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
      }
    }
  }, [])

  const handleNavClick = useCallback((e: MouseEvent<HTMLAnchorElement>, href: string) => {
    const hashIndex = href.indexOf('#')
    if (hashIndex === -1) return
    const hash = href.slice(hashIndex + 1)
    if (!hash) return
    const target = document.getElementById(hash)
    if (!target) return
    e.preventDefault()
    setIsOpen(false)
    history.replaceState(null, '', `#${hash}`)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-lg border-b border-gray-800' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-space-grotesk text-xl font-bold text-white">
              Pritam
              <span className="text-blue-500"> Padhan</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="whitespace-nowrap text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/services"
              className="whitespace-nowrap text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Services
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 whitespace-nowrap text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              Admin
            </Link>
          </nav>

          <div className="hidden xl:flex items-center gap-3">
            <a
              href="tel:+916372516197"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-blue-400/20 bg-blue-500/15 px-4 py-2.5 text-sm font-semibold text-blue-100 transition hover:border-blue-300/50 hover:bg-blue-500/25"
            >
              <Phone className="h-4 w-4" />
              +91 6372516197
            </a>
            <Link
              href="/contact"
              className="whitespace-nowrap px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              Contact Me
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden text-white p-2"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="xl:hidden overflow-hidden bg-black/95 backdrop-blur-lg border-b border-gray-800"
      >
        <div className="px-4 py-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="block text-gray-300 hover:text-white transition-colors py-2"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/services"
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-white transition-colors py-2"
          >
            Services
          </Link>
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-white transition-colors py-2"
          >
            Admin Panel
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
          >
            Contact Me
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  )
}
