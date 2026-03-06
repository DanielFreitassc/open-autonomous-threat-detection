'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MiniStatProps {
  label: string
  value: string | number
  change?: number
  icon: React.ReactNode
  iconBgClass?: string
}

export function MiniStat({ label, value, change, icon, iconBgClass = 'bg-primary/10' }: MiniStatProps) {
  const getTrendIcon = () => {
    if (!change) return <Minus className="w-3 h-3 text-muted-foreground" />
    if (change > 0) return <TrendingUp className="w-3 h-3 text-red-400" />
    return <TrendingDown className="w-3 h-3 text-green-400" />
  }

  const getTrendColor = () => {
    if (!change) return 'text-muted-foreground'
    if (change > 0) return 'text-red-400'
    return 'text-green-400'
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={cn('p-2.5 rounded-lg', iconBgClass)}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 text-xs', getTrendColor())}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface MiniStatsGridProps {
  stats: {
    label: string
    value: string | number
    change?: number
    icon: React.ReactNode
    iconBgClass?: string
  }[]
}

export function MiniStatsGrid({ stats }: MiniStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <MiniStat key={stat.label} {...stat} />
      ))}
    </div>
  )
}
