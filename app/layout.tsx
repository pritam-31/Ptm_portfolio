import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import CursorEffect from '@/components/CursorEffect'
import SplashScreen from '@/components/SplashScreen'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: 'Pritam Padhan | AI & Full-Stack Developer',
  description: 'Portfolio of Pritam Padhan, an Electronics & Communication Engineering undergraduate and full-stack developer.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SplashScreen />
          <CursorEffect />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
