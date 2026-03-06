'use client'

import { useState, useMemo } from 'react'
import {
  RefreshCw,
  Filter,
  Search,
  AlertTriangle,
  Shield,
  Activity,
  Cpu,
  Globe,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MiniStatsGrid } from '@/components/mini-stats'
import { EventsChart } from '@/components/events-chart'
import { SeverityChart } from '@/components/severity-chart'
import { TopSources } from '@/components/top-sources'
import { EventsTable } from '@/components/events-table'
import { generateMockAnomalies, calculateStats } from '@/lib/mock-anomalies'
import type { Anomaly } from '@/types'

export default function DashboardPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>(() => generateMockAnomalies(100))
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredAnomalies = useMemo(() => {
    return anomalies.filter((anomaly) => {
      const matchesSearch =
        searchTerm === '' ||
        anomaly.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anomaly.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anomaly.source.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === 'ALL' || anomaly.type === typeFilter
      const matchesStatus = statusFilter === 'ALL' || anomaly.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [anomalies, searchTerm, typeFilter, statusFilter])

  const stats = useMemo(() => calculateStats(anomalies), [anomalies])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setAnomalies(generateMockAnomalies(100))
      setIsRefreshing(false)
    }, 1000)
  }

  const miniStats = [
    {
      label: 'Total de Eventos',
      value: stats.total,
      change: 12,
      icon: <Activity className="w-5 h-5 text-primary" />,
      iconBgClass: 'bg-primary/10',
    },
    {
      label: 'Alertas Criticos',
      value: stats.critical,
      change: 8,
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      iconBgClass: 'bg-red-500/10',
    },
    {
      label: 'Em Investigacao',
      value: stats.investigating,
      change: -5,
      icon: <Search className="w-5 h-5 text-yellow-400" />,
      iconBgClass: 'bg-yellow-500/10',
    },
    {
      label: 'Ativos Monitorados',
      value: '1,247',
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      iconBgClass: 'bg-blue-500/10',
    },
    {
      label: 'Origens Ativas',
      value: '38',
      icon: <Globe className="w-5 h-5 text-green-400" />,
      iconBgClass: 'bg-green-500/10',
    },
    {
      label: 'Ultimo Scan',
      value: '2min',
      icon: <Clock className="w-5 h-5 text-slate-400" />,
      iconBgClass: 'bg-slate-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Visao Geral</h1>
          <p className="text-sm text-muted-foreground">
            Monitoramento de seguranca em tempo real com Machine Learning
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-400">Sistema Online</span>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm" className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      <MiniStatsGrid stats={miniStats} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EventsChart events={anomalies} />
        </div>
        <div>
          <SeverityChart stats={stats} />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos por ID, descricao ou fonte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] bg-card border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  <SelectItem value="CRITICAL">Critico</SelectItem>
                  <SelectItem value="HIGH">Alto</SelectItem>
                  <SelectItem value="MEDIUM">Medio</SelectItem>
                  <SelectItem value="LOW">Baixo</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-card border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="NEW">Novo</SelectItem>
                  <SelectItem value="INVESTIGATING">Investigando</SelectItem>
                  <SelectItem value="RESOLVED">Resolvido</SelectItem>
                  <SelectItem value="DISMISSED">Descartado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <EventsTable events={filteredAnomalies} pageSize={10} />
        </div>
        <div>
          <TopSources events={anomalies} />
        </div>
      </div>
    </div>
  )
}
