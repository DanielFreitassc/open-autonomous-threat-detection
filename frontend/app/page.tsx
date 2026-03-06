'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Shield, Loader2 } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
      <div className="p-4 bg-primary/10 rounded-2xl">
        <Shield className="w-12 h-12 text-primary" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold">ThreatVision</h1>
        <p className="text-muted-foreground">Sistema de Analise de Ameacas com IA</p>
      </div>
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  )
}
