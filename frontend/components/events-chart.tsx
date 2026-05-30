'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { EventStatsCountResponseDto } from '@/types/index' // Ajuste o caminho conforme seu projeto

interface EventsChartProps {
  stats: EventStatsCountResponseDto[]
}

export function EventsChart({ stats }: EventsChartProps) {
  // Apenas formata o timestamp que veio do backend para exibir a string de hora no gráfico
  const chartData = useMemo(() => {
    if (!stats || stats.length === 0) return [];

    return stats.map((stat) => {
      const date = new Date(stat.timestamp)
      return {
        ...stat,
        hour: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }
    })
  }, [stats])

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Eventos nas Últimas 24 Horas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="hour"
                stroke="#666"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#666"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="critical"
                name="Crítico"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorCritical)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="high"
                name="Alto"
                stroke="#f97316"
                fillOpacity={1}
                fill="url(#colorHigh)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="medium"
                name="Médio"
                stroke="#eab308"
                fillOpacity={1}
                fill="url(#colorMedium)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="low"
                name="Baixo"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorLow)"
                stackId="1"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}