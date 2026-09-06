import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import ContactInfo from '@/components/ContactInfo'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Pritam Padhan',
  description: 'Get in touch with Pritam Padhan about software engineering and AI internship opportunities.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-white mb-4">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Touch</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Have a project in mind? Let&apos;s talk about how we can build it together.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ContactInfo />

            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
