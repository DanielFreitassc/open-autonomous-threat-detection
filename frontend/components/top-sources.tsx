'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Anomaly } from '@/types/index'

interface TopSourcesProps {
  events: Anomaly[]
}

export function TopSources({ events }: TopSourcesProps) {
  const sources = useMemo(() => {
    const sourceCount = events.reduce((acc, event) => {
      acc[event.source] = (acc[event.source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const sorted = Object.entries(sourceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const maxCount = sorted[0]?.[1] || 1

    return sorted.map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / maxCount) * 100),
    }))
  }, [events])

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Top Fontes de Eventos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sources.map((source) => (
          <div key={source.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground truncate max-w-[180px]">{source.name}</span>
              <span className="text-muted-foreground font-mono">{source.count}</span>
            </div>
            <Progress value={source.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
