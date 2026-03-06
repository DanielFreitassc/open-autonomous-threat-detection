'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
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

interface EventsTableProps {
  events: Anomaly[]
  pageSize?: number
}

const typeConfig = {
  CRITICAL: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bgClass: 'bg-red-500/10 text-red-400 border-red-500/30',
  },
  HIGH: {
    icon: AlertTriangle,
    color: 'text-orange-400',
    bgClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  },
  MEDIUM: {
    icon: AlertCircle,
    color: 'text-yellow-400',
    bgClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  },
  LOW: {
    icon: Info,
    color: 'text-blue-400',
    bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  INFO: {
    icon: Info,
    color: 'text-slate-400',
    bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  },
}

const statusConfig = {
  NEW: { label: 'Novo', class: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  INVESTIGATING: { label: 'Investigando', class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  RESOLVED: { label: 'Resolvido', class: 'bg-green-500/10 text-green-400 border-green-500/30' },
  DISMISSED: { label: 'Descartado', class: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
}

export function EventsTable({ events, pageSize = 10 }: EventsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(events.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedEvents = events.slice(startIndex, startIndex + pageSize)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[100px] text-muted-foreground">Severidade</TableHead>
              <TableHead className="w-[140px] text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Descricao</TableHead>
              <TableHead className="w-[150px] text-muted-foreground">Fonte</TableHead>
              <TableHead className="w-[140px] text-muted-foreground">Timestamp</TableHead>
              <TableHead className="w-[110px] text-muted-foreground">Status</TableHead>
              <TableHead className="w-[80px] text-muted-foreground text-right">Conf.</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEvents.map((event) => {
              const config = typeConfig[event.type]
              const status = statusConfig[event.status]
              const Icon = config.icon
              return (
                <TableRow
                  key={event.id}
                  className="border-border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon className={cn('w-4 h-4', config.color)} />
                      <Badge variant="outline" className={cn('text-xs font-medium', config.bgClass)}>
                        {event.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {event.id}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <span className="text-sm text-foreground truncate block">
                      {event.description}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {event.source}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {formatDate(event.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', status.class)}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-medium text-foreground">{event.confidence}%</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>Investigar</DropdownMenuItem>
                        <DropdownMenuItem>Marcar como resolvido</DropdownMenuItem>
                        <DropdownMenuItem>Descartar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1} a {Math.min(startIndex + pageSize, events.length)} de{' '}
          {events.length} eventos
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Proximo
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
