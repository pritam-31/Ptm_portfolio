import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AboutSection from '@/components/AboutSection'
import EducationSection from '@/components/EducationSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Pritam Padhan | AI & Full-Stack Developer',
  description: 'Learn about Pritam Padhan, his education, engineering interests, and experience building AI and full-stack products.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24">
        <AboutSection />
        <EducationSection />
      </div>
      <Footer />
    </main>
  )
}
