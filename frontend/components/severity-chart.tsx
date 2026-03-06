'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnomalyStats } from '@/types'

interface SeverityChartProps {
  stats: AnomalyStats
}

const COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#64748b',
}

export function SeverityChart({ stats }: SeverityChartProps) {
  const data = useMemo(
    () => [
      { name: 'Critico', value: stats.critical, color: COLORS.critical },
      { name: 'Alto', value: stats.high, color: COLORS.high },
      { name: 'Medio', value: stats.medium, color: COLORS.medium },
      { name: 'Baixo', value: stats.low, color: COLORS.low },
      { name: 'Info', value: stats.info, color: COLORS.info },
    ].filter((item) => item.value > 0),
    [stats]
  )

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Distribuicao por Severidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
