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
import type { Anomaly } from '@/types/index'

interface EventsChartProps {
  events: Anomaly[]
}

export function EventsChart({ events }: EventsChartProps) {
  const chartData = useMemo(() => {
    // 1. Cria a estrutura vazia das últimas 24 horas
    const last24Hours = Array.from({ length: 24 }, (_, i) => {
      const date = new Date()
      date.setHours(date.getHours() - (23 - i))
      date.setMinutes(0, 0, 0, 0) // Zera minutos, segundos e milissegundos para precisão
      return {
        hour: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: date.getTime(),
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        total: 0,
      }
    })

    // 2. Popula os buckets com os eventos
    events.forEach((event) => {
      // Arredonda a hora do evento para comparar com o bucket exato
      const eventDate = new Date(event.timestamp)
      eventDate.setMinutes(0, 0, 0, 0) 
      const eventHourTime = eventDate.getTime()

      // Encontra o bucket correspondente àquela hora exata com .find() em vez de loop
      const targetBucket = last24Hours.find(bucket => bucket.timestamp === eventHourTime)

      if (targetBucket) {
        targetBucket.total++
        if (event.type === 'CRITICAL') targetBucket.critical++
        else if (event.type === 'HIGH') targetBucket.high++
        else if (event.type === 'MEDIUM') targetBucket.medium++
        else if (event.type === 'LOW') targetBucket.low++
      }
    })

    return last24Hours
  }, [events])

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