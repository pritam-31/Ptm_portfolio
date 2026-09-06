'use client'

import { MapPin, Phone, Mail, Link2 } from 'lucide-react'
import { useSiteContent } from '@/lib/content-api'

export default function ContactInfo() {
  const content = useSiteContent()

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Location',
      details: [content.contact.location, 'India'],
    },
    {
      icon: Phone,
      title: 'Phone',
      details: [content.contact.phone],
    },
    {
      icon: Mail,
      title: 'Email',
      details: [content.contact.email],
    },
    {
      icon: Link2,
      title: 'Profiles',
      details: ['linkedin.com/in/pritampadhan', 'github.com/pritam-31'],
    },
  ]

  return (
    <div className="lg:col-span-1 space-y-4">
      {contactInfo.map((info, index) => (
        <div
          key={index}
          className="p-6 rounded-xl bg-white/5 border border-gray-800 hover:border-blue-500/30 transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <info.icon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-gray-400 text-sm">{detail}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}