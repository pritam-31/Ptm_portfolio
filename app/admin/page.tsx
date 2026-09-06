import AdminPanel from '@/components/AdminPanel'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel | Pritam Padhan',
  description: 'Upload and manage projects on the Pritam Padhan portfolio.',
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <AnimatedBackground />
      <Navbar />
      <AdminPanel />
      <Footer />
    </main>
  )
}
