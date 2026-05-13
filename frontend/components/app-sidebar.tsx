'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  Activity,
  AlertTriangle,
  Network,
  Database,
  FileText,
  Settings,
  Users,
  BarChart3,
  Globe,
  Cpu, // <-- Sendo usado agora para os Agentes
  LogOut,
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'

const navigation = [
  { name: 'Visao Geral', href: '/dashboard', icon: Activity },
  { name: 'Eventos', href: '/dashboard/events', icon: FileText },
]

// Adicionando a aba de Agentes na seção de gerenciamento
const management = [
  { name: 'Whitelist', href: '/dashboard/whitelist', icon: ShieldCheck },
  { name: 'Agentes', href: '/dashboard/agents', icon: Cpu }, // <-- NOVO ITEM
  { name: 'Usuarios', href: '/dashboard/users', icon: Users },
  { name: 'Configuracoes', href: '/dashboard/settings', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">ThreatVision</h1>
          <p className="text-xs text-muted-foreground">SIEM Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Monitoramento
          </span>
        </div>
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href) && item.href !== '/dashboard' || (item.href === '/dashboard' && pathname === '/dashboard')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}

        <div className="px-3 mt-6 mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Administracao
          </span>
        </div>
        {management.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name || 'Usuario'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || 'usuario@email.com'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}