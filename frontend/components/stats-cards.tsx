'use client'

import { AlertTriangle, AlertCircle, Info, Activity, Search, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { AnomalyStats } from '@/types/index'
import { cn } from '@/lib/utils'

interface StatsCardsProps {
  stats: AnomalyStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total de Anomalias',
      value: stats.total,
      icon: Activity,
      color: 'text-foreground',
      bgColor: 'bg-muted',
    },
    {
      label: 'Criticas',
      value: stats.critical,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Altas',
      value: stats.high,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Medias',
      value: stats.medium,
      icon: AlertCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Baixas',
      value: stats.low,
      icon: Info,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Novas',
      value: stats.newCount,
      icon: Activity,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      label: 'Em Investigacao',
      value: stats.investigating,
      icon: Search,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Resolvidas',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', card.bgColor)}>
                  <Icon className={cn('w-4 h-4', card.color)} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="text-xs text-muted-foreground">{card.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
