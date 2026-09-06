import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import TechStack from '@/components/TechStack'
import SkillsSection from '@/components/SkillsSection'
import AboutSection from '@/components/AboutSection'
import AnimatedBackground from '@/components/AnimatedBackground'
import ProjectsShowcase from '@/components/ProjectsShowcase'
import ExperienceSection from '@/components/ExperienceSection'
import EducationSection from '@/components/EducationSection'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <AnimatedBackground />
      <Navbar />
      <Hero />
      <Services />
      <SkillsSection />
      <TechStack />
      <ProjectsShowcase />
      <ExperienceSection />
      <EducationSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </main>
  )
}
