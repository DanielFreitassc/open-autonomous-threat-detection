'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Importando as funções e tipagem da sua API
import { getPaginatedWhitelist, deleteWhitelistRule } from '@/lib/api'
import type { WhitelistRule } from '@/lib/api'

export default function WhitelistPage() {
  const [rules, setRules] = useState<WhitelistRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null) // Guarda o ID sendo deletado
  
  // Controles de Paginação
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10

  const fetchData = useCallback(async (pageToFetch: number, silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const response = await getPaginatedWhitelist(pageToFetch, pageSize)
      setRules(response.rules)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
      setCurrentPage(response.currentPage)
    } catch (error) {
      console.error('Erro ao buscar regras da Whitelist:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [pageSize])

  // Busca inicial e mudança de página
  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage, fetchData])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchData(currentPage, true)
  }

  const handleDelete = async (id: string, endpoint: string) => {
    const confirm = window.confirm(`Tem certeza que deseja remover a exceção para a rota ${endpoint}? Os eventos ignorados voltarão a aparecer como incidentes.`)
    if (!confirm) return

    setIsDeleting(id)
    try {
      await deleteWhitelistRule(id)
      // Recarrega a página atual para atualizar a tabela
      await fetchData(currentPage, true)
    } catch (error) {
      console.error('Erro ao deletar regra:', error)
      alert('Erro ao tentar remover a exceção do banco de dados.')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-500" />
            Whitelist (Falsos Positivos)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as rotas e assinaturas que foram marcadas como benignas e estão sendo ignoradas pelo SIEM.
          </p>
        </div>
        
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing} 
          variant="outline" 
          size="sm" 
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar Lista
        </Button>
      </div>

      {/* Tabela */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading && rules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Carregando exceções de segurança...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent bg-muted/20">
                  <TableHead className="w-[300px] text-muted-foreground">Rota / Endpoint</TableHead>
                  <TableHead className="w-[120px] text-muted-foreground text-center">Status HTTP</TableHead>
                  <TableHead className="w-[150px] text-muted-foreground">Tamanho (Bytes)</TableHead>
                  <TableHead className="text-muted-foreground">ID da Regra</TableHead>
                  <TableHead className="w-[100px] text-right text-muted-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <AlertCircle className="w-6 h-6" />
                        <p>Nenhuma exceção cadastrada na Whitelist.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  rules.map((rule) => (
                    <TableRow key={rule.id} className="border-border">
                      <TableCell className="font-mono text-sm text-foreground">
                        {rule.endpoint}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono">
                          {rule.statusCode}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {rule.bodySize}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[200px]" title={rule.id}>
                        {rule.id}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(rule.id, rule.endpoint)}
                          disabled={isDeleting === rule.id}
                          className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                          title="Remover exceção"
                        >
                          {isDeleting === rule.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Rodapé com Paginação da API */}
            {totalElements > 0 && (
              <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
                <span className="text-sm text-muted-foreground">
                  Página {currentPage + 1} de {totalPages || 1} 
                  <span className="hidden sm:inline"> ({totalElements} regras cadastradas)</span>
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
            )}
          </>
        )}
      </div>
    </div>
  )
}