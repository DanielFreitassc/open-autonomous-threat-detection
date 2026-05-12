'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Pause
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
import { EventsTable } from '@/components/events-table'
import { getPaginatedEvents } from '@/lib/api'
import type { Anomaly } from '@/types'
import { EventDetailsSidebar } from '@/components/event-details-sidebar'

export default function EventsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Controles de Busca e Filtro
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [timeFilter, setTimeFilter] = useState<string>('ALL') // Filtro de tempo local
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10

  // Controle de Auto-Refresh
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(0) // 0 = Desativado (Manual)

  const fetchData = useCallback(async (pageToFetch: number, silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      // Como a sua API ainda não tem parâmetro de tempo (?time=15m), 
      // o filtro de tempo será feito no frontend na variável filteredAnomalies
      const response = await getPaginatedEvents(pageToFetch, pageSize)
      setAnomalies(response.anomalies)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
      setCurrentPage(response.currentPage)
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [pageSize])

  // Efeito inicial e mudança de página
  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage, fetchData])

  // Efeito para o Auto-Refresh
  useEffect(() => {
    if (autoRefreshInterval === 0) return

    const intervalId = setInterval(() => {
      fetchData(currentPage, true) // silent=true para não piscar a tela inteira
    }, autoRefreshInterval)

    return () => clearInterval(intervalId)
  }, [autoRefreshInterval, currentPage, fetchData])

  const handleManualRefresh = () => {
    setIsRefreshing(true)
    fetchData(currentPage, true)
  }

  // Lógica de Filtros (Busca, Severidade e Tempo)
  const filteredAnomalies = useMemo(() => {
    return anomalies.filter((anomaly) => {
      // 1. Busca por texto
      const matchesSearch =
        searchTerm === '' ||
        anomaly.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anomaly.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (anomaly.endpoint && anomaly.endpoint.toLowerCase().includes(searchTerm.toLowerCase()))

      // 2. Filtro de Severidade
      const matchesType = typeFilter === 'ALL' || anomaly.type === typeFilter

      // 3. Filtro de Tempo
      let matchesTime = true
      if (timeFilter !== 'ALL') {
        const eventDate = new Date(anomaly.timestamp).getTime()
        const now = new Date().getTime()
        const diffMinutes = (now - eventDate) / (1000 * 60)

        if (timeFilter === '15M') matchesTime = diffMinutes <= 15
        else if (timeFilter === '1H') matchesTime = diffMinutes <= 60
        else if (timeFilter === '24H') matchesTime = diffMinutes <= 1440
        else if (timeFilter === '7D') matchesTime = diffMinutes <= 10080
      }

      return matchesSearch && matchesType && matchesTime
    })
  }, [anomalies, searchTerm, typeFilter, timeFilter])

  return (
    <div className="space-y-6 relative">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Explorador de Eventos</h1>
          <p className="text-sm text-muted-foreground">
            Investigação detalhada de anomalias detectadas pelo modelo de Machine Learning.
          </p>
        </div>
        
        {/* Controles de Atualização */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card border border-border rounded-md px-2 py-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <Select 
              value={autoRefreshInterval.toString()} 
              onValueChange={(v) => setAutoRefreshInterval(Number(v))}
            >
              <SelectTrigger className="w-[130px] border-none shadow-none h-8 text-sm focus:ring-0">
                <SelectValue placeholder="Auto-Refresh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Manual (Off)</SelectItem>
                <SelectItem value="10000">A cada 10s</SelectItem>
                <SelectItem value="60000">A cada 1 min</SelectItem>
                <SelectItem value="120000">A cada 2 min</SelectItem>
                <SelectItem value="300000">A cada 5 min</SelectItem>
              </SelectContent>
            </Select>
            {autoRefreshInterval > 0 && (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-2" title="Auto-refresh ativo" />
            )}
          </div>

          <Button 
            onClick={handleManualRefresh} 
            disabled={isRefreshing} 
            variant="outline" 
            size="sm" 
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, Rota ou Descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[160px]">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todo o Histórico</SelectItem>
              <SelectItem value="15M">Últimos 15 min</SelectItem>
              <SelectItem value="1H">Última 1 hora</SelectItem>
              <SelectItem value="24H">Últimas 24 horas</SelectItem>
              <SelectItem value="7D">Últimos 7 dias</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Severidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas</SelectItem>
              <SelectItem value="CRITICAL">Crítico</SelectItem>
              <SelectItem value="HIGH">Alto</SelectItem>
              <SelectItem value="MEDIUM">Médio</SelectItem>
              <SelectItem value="LOW">Baixo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela de Eventos */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading && anomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Buscando eventos no banco de dados...</p>
          </div>
        ) : (
          <>
            <div className="p-1">
              <EventsTable 
                events={filteredAnomalies} 
                pageSize={pageSize} 
                onRowClick={(id) => setSelectedEventId(id)} 
              />
            </div>

            {/* Rodapé com Paginação da API */}
            <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
              <span className="text-sm text-muted-foreground">
                Mostrando página {currentPage + 1} de {totalPages || 1} 
                <span className="hidden sm:inline"> (Total de {totalElements} eventos detectados)</span>
              </span>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0 || isLoading}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="bg-background"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages - 1 || isLoading}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="bg-background"
                >
                  Próxima <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Renderiza o Sidebar se houver um ID selecionado */}
      <EventDetailsSidebar 
        eventId={selectedEventId} 
        onClose={() => setSelectedEventId(null)} 
      />
    </div>
  )
}