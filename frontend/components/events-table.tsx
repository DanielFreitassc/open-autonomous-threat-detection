'use client'

import {
  AlertTriangle,
  AlertCircle,
  Info,
  Eye,
  MoreHorizontal,
  CheckCircle2
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Anomaly } from '@/types/index'
import { cn } from '@/lib/utils'

import { addWhitelistRule } from '@/lib/api'

interface EventsTableProps {
  events: Anomaly[]
  pageSize?: number
  onRowClick?: (id: string) => void
  onRefresh?: () => void // <-- NOVO: Propriedade para avisar o pai que precisa recarregar
}

const typeConfig = {
  CRITICAL: { icon: AlertTriangle, color: 'text-red-400', bgClass: 'bg-red-500/10 text-red-400 border-red-500/30' },
  HIGH: { icon: AlertTriangle, color: 'text-orange-400', bgClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  MEDIUM: { icon: AlertCircle, color: 'text-yellow-400', bgClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  LOW: { icon: Info, color: 'text-blue-400', bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  INFO: { icon: Info, color: 'text-slate-400', bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
}

const statusConfig = {
  NEW: { label: 'Novo', class: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  INVESTIGATING: { label: 'Investigando', class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  RESOLVED: { label: 'Resolvido', class: 'bg-green-500/10 text-green-400 border-green-500/30' },
  DISMISSED: { label: 'Descartado', class: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
}

export function EventsTable({ events, onRowClick, onRefresh }: EventsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).format(date)
  }

  const getSafeTypeConfig = (type: string) => typeConfig[type as keyof typeof typeConfig] || typeConfig['INFO']
  const getSafeStatusConfig = (status: string) => statusConfig[status as keyof typeof statusConfig] || statusConfig['NEW']

  const handleMarkFalsePositive = async (event: Anomaly) => {
    try {
      const rule = {
        eventId: event.id,
        endpoint: event.endpoint || '/',
        statusCode: event.statusCode ? String(event.statusCode) : '200',
        bodySize: (event as any).bodySize ? String((event as any).bodySize) : '0' 
      }
      
      await addWhitelistRule(rule)
      
      alert(`✅ Rota ${rule.endpoint} (Status ${rule.statusCode}) adicionada à Whitelist com sucesso! O Agente IA passará a ignorá-la.`)
      
      // <-- NOVO: Chama a função do pai para recarregar a tabela
      if (onRefresh) {
        onRefresh()
      }
      
    } catch (error) {
      console.error('Erro ao adicionar à whitelist:', error)
      alert('❌ Ocorreu um erro ao tentar marcar como falso positivo.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[110px] text-muted-foreground">Severidade</TableHead>
              <TableHead className="w-[140px] text-muted-foreground">Timestamp</TableHead>
              <TableHead className="text-muted-foreground">Descrição</TableHead>
              <TableHead className="text-muted-foreground">Rota</TableHead>
              <TableHead className="w-[90px] text-muted-foreground text-center">Status HTTP</TableHead>
              <TableHead className="w-[130px] text-muted-foreground">Fonte</TableHead>
              <TableHead className="w-[100px] text-muted-foreground">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Nenhum evento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => {
                const config = getSafeTypeConfig(event.type)
                const status = getSafeStatusConfig(event.status)
                const Icon = config.icon

                return (
                  <TableRow
                    key={event.id}
                    onClick={() => onRowClick && onRowClick(event.id)}
                    className={cn("border-border transition-colors", onRowClick ? "cursor-pointer hover:bg-muted/50" : "")}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className={cn('w-4 h-4', config.color)} />
                        <Badge variant="outline" className={cn('text-[10px] font-medium', config.bgClass)}>
                          {event.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {formatDate(event.timestamp)}
                    </TableCell>
                    <TableCell className="max-w-[250px]">
                      <span className="text-sm text-foreground truncate block" title={event.description}>
                        {event.description}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[150px]" title={event.endpoint}>
                      {event.endpoint || 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      {event.statusCode ? (
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-mono font-medium",
                          event.statusCode.startsWith('4') || event.statusCode.startsWith('5') 
                            ? "bg-red-500/10 text-red-400" 
                            : "bg-green-500/10 text-green-400"
                        )}>
                          {event.statusCode}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {event.source}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-[10px]', status.class)}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onRowClick && onRowClick(event.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handleMarkFalsePositive(event)}
                            className="text-green-500 focus:text-green-500"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Descartar (Falso Positivo)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}