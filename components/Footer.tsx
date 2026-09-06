'use client'

import Link from 'next/link'
import { useCallback, type MouseEvent } from 'react'
import { Hexagon, Mail, Phone, MapPin, ArrowUp } from 'lucide-react'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import { useSiteContent } from '@/lib/content-api'

const exploreLinks = [
  { name: 'About', href: '/about' },
  { name: 'Skills', href: '/#skills' },
  { name: 'Experience', href: '/#experience' },
  { name: 'Education', href: '/#education' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
]

const socialLinks = [
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/pritampadhan', label: 'LinkedIn' },
  { icon: FaGithub, href: 'https://github.com/pritam-31', label: 'GitHub' },
]

export default function Footer() {
  const content = useSiteContent()
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = useCallback((e: MouseEvent<HTMLAnchorElement>, href: string) => {
    const hashIndex = href.indexOf('#')
    if (hashIndex === -1) return
    const hash = href.slice(hashIndex + 1)
    if (!hash) return
    const target = document.getElementById(hash)
    if (!target) return
    e.preventDefault()
    history.replaceState(null, '', `#${hash}`)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <footer className="bg-black/90 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Hexagon className="w-8 h-8 text-blue-500" />
              <span className="font-space-grotesk text-xl font-bold text-white">
                Pritam<span className="text-blue-500"> Padhan</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md mb-6">
              {content.footer.tagline}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{content.contact.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>{content.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{content.contact.location}, India</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Pritam Padhan. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}