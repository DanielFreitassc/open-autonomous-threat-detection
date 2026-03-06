import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import { AuthProvider } from '@/contexts/auth-context'
import { ToastProvider } from '@/components/toast-provider'

import './globals.css'
import 'react-toastify/dist/ReactToastify.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'ThreatVision SIEM',
  description:
    'Sistema de Gerenciamento de Informacoes e Eventos de Seguranca com IA',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col items-center">
        <AuthProvider>
          <main className="w-full max-w-7xl flex-1 px-6 py-8">
            {children}
          </main>

          <ToastProvider />
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  )
}