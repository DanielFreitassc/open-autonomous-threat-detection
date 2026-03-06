'use client'

import { AlertTriangle, AlertCircle, Info, Shield, Clock, Server, Brain } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Anomaly } from '@/types/index'
import { cn } from '@/lib/utils'

const typeConfig = {
  CRITICAL: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  HIGH: {
    icon: AlertTriangle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  MEDIUM: {
    icon: AlertCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  LOW: {
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  INFO: {
    icon: Info,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
    badgeClass: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  },
}

const statusConfig = {
  NEW: { label: 'Novo', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  INVESTIGATING: { label: 'Investigando', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  RESOLVED: { label: 'Resolvido', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
  DISMISSED: { label: 'Descartado', class: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
}

interface AnomalyCardProps {
  anomaly: Anomaly
}

export function AnomalyCard({ anomaly }: AnomalyCardProps) {
  const config = typeConfig[anomaly.type]
  const status = statusConfig[anomaly.status]
  const Icon = config.icon

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <Card className={cn('border transition-all hover:shadow-lg', config.borderColor, config.bgColor)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={cn('p-2 rounded-lg', config.bgColor)}>
              <Icon className={cn('w-5 h-5', config.color)} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{anomaly.id}</span>
                <Badge variant="outline" className={config.badgeClass}>
                  {anomaly.type}
                </Badge>
                <Badge variant="outline" className={status.class}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm font-medium leading-tight">{anomaly.description}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-foreground">{anomaly.confidence}%</div>
            <div className="text-xs text-muted-foreground">confianca</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span className="truncate">{anomaly.source}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(anomaly.timestamp)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Server className="w-3.5 h-3.5" />
            <span>{anomaly.affectedAssets.length} ativo(s)</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="w-3.5 h-3.5" />
            <span className="truncate">{anomaly.mlModel}</span>
          </div>
        </div>
        {anomaly.affectedAssets.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {anomaly.affectedAssets.map((asset) => (
              <Badge key={asset} variant="secondary" className="text-xs font-mono">
                {asset}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
