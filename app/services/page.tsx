import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Services from '@/components/Services'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Capabilities | Pritam Padhan',
  description: 'Explore Pritam Padhan\'s capabilities across full-stack development, AI, databases, testing, and cloud deployment.',
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24">
        <Services />
      </div>
      <Footer />
    </main>
  )
}
