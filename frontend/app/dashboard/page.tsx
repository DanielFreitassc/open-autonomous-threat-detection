'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  RefreshCw,
  Filter,
  Search,
  AlertTriangle,
  Activity,
  Cpu,
  Globe,
  Clock,
  ChevronLeft,
  ChevronRight
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

// Importando a nova função de busca paginada da API
import { getPaginatedEvents } from '@/lib/api'
import { calculateStats } from '@/lib/mock-anomalies' 
import type { Anomaly } from '@/types'

export default function DashboardPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Controles de Paginação
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10 // Puxando 10 itens por página conforme o padrão do seu Spring Boot

  // Função centralizada para buscar dados da API
  const fetchData = async (pageToFetch: number) => {
    try {
      const response = await getPaginatedEvents(pageToFetch, pageSize)
      setAnomalies(response.anomalies)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
      setCurrentPage(response.currentPage)
    } catch (error) {
      console.error('Erro ao buscar incidentes da API:', error)
    }
  }

  // Hook disparado ao abrir a tela ou quando a página mudar
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      await fetchData(currentPage)
      setIsLoading(false)
    }
    loadInitialData()
  }, [currentPage])

  // Botão de recarregar
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData(currentPage)
    setIsRefreshing(false)
  }

  // Filtro de busca na tabela
  const filteredAnomalies = useMemo(() => {
    return anomalies.filter((anomaly) => {
      const matchesSearch =
        searchTerm === '' ||
        anomaly.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anomaly.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (anomaly.endpoint && anomaly.endpoint.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = typeFilter === 'ALL' || anomaly.type === typeFilter
      const matchesStatus = statusFilter === 'ALL' || anomaly.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [anomalies, searchTerm, typeFilter, statusFilter])

  const stats = useMemo(() => calculateStats(anomalies), [anomalies])

  const miniStats = [
    {
      label: 'Total de Eventos',
      value: totalElements, // Exibe o total real de registros no banco de dados
      change: 0,
      icon: <Activity className="w-5 h-5 text-primary" />,
      iconBgClass: 'bg-primary/10',
    },
    {
      label: 'Alertas Criticos',
      value: stats.critical || 0,
      change: 0,
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      iconBgClass: 'bg-red-500/10',
    },
    {
      label: 'Em Investigacao',
      value: stats.investigating || 0,
      change: 0,
      icon: <Search className="w-5 h-5 text-yellow-400" />,
      iconBgClass: 'bg-yellow-500/10',
    },
    {
      label: 'Ativos Monitorados',
      value: '1', 
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      iconBgClass: 'bg-blue-500/10',
    },
    {
      label: 'Origens Ativas',
      value: '1', 
      icon: <Globe className="w-5 h-5 text-green-400" />,
      iconBgClass: 'bg-green-500/10',
    },
    {
      label: 'Ultimo Scan',
      value: 'Agora', 
      icon: <Clock className="w-5 h-5 text-slate-400" />,
      iconBgClass: 'bg-slate-500/10',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Sincronizando com o Banco de Dados...</p>
        </div>
      </div>
    )
  }

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
                placeholder="Buscar eventos por ID, Rota ou Descricao..."
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
          
          <EventsTable events={filteredAnomalies} pageSize={pageSize} />

          {/* Controles de Paginação */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-muted-foreground">
              Mostrando página {currentPage + 1} de {totalPages || 1} ({totalElements} registros totais)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0 || isRefreshing}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages - 1 || isRefreshing}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Próxima <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

        </div>
        <div>
          <TopSources events={anomalies} />
        </div>
      </div>
    </div>
  )
}