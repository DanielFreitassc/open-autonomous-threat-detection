'use client'

import { useEffect, useState } from 'react'
import { X, Server, Activity, ShieldAlert, Clock, Code, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getEventById, addWhitelistRule } from '@/lib/api'
import type { Anomaly } from '@/types'

interface EventDetailsSidebarProps {
  eventId: string | null
  onClose: () => void
}

export function EventDetailsSidebar({ eventId, onClose }: EventDetailsSidebarProps) {
  const [event, setEvent] = useState<Anomaly | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Função ligada ao botão de falso positivo do Sidebar:
  const handleWhitelist = async () => {
    if(!event) return;
    
    try {
      await addWhitelistRule({
        eventId: event.id, // <-- NOVO CAMPO PASSADO AQUI
        endpoint: event.endpoint || '/',
        statusCode: String(event.statusCode) || '200',
        bodySize: String((event as any).bodySize) || '0'
      })
      alert('Adicionado à Whitelist com sucesso!');
      onClose(); // Fecha a gaveta após o sucesso
    } catch (error) {
      console.error('Erro ao adicionar à whitelist:', error)
      alert('Erro ao marcar como falso positivo.')
    }
  }

  useEffect(() => {
    if (!eventId) {
      setEvent(null)
      return
    }

    const loadEvent = async () => {
      setIsLoading(true)
      try {
        const data = await getEventById(eventId)
        setEvent(data)
      } catch (error) {
        console.error('Erro ao buscar detalhes do evento:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [eventId])

  if (!eventId) return null

  return (
    <>
      {/* Overlay Escuro */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Menu Lateral */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Detalhes do Evento</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <p>Carregando informações...</p>
            </div>
          ) : event ? (
            <div className="space-y-6">
              
              {/* Status Header */}
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    event.type === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    event.type === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }`}>
                    {event.type}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                <h3 className="font-medium text-foreground mt-2">{event.description}</h3>
                <p className="text-sm text-muted-foreground mt-1 break-all">ID: {event.id}</p>
              </div>

              {/* Informações da Requisição */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Activity className="w-4 h-4 text-primary" />
                  Requisição HTTP
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm bg-background p-3 rounded border border-border">
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Rota Acessada</span>
                    <span className="font-mono break-all">{event.endpoint || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Status Code</span>
                    <span className="font-mono">{event.statusCode || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Tamanho (Bytes)</span>
                    <span className="font-mono">{event.bodySize || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">IP de Origem</span>
                    <span className="font-mono">{event.clientIp || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Informações do Sistema */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Server className="w-4 h-4 text-primary" />
                  Ambiente
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm bg-background p-3 rounded border border-border">
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Host Alvo</span>
                    <span className="font-mono">{event.affectedAssets[0] || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Serviço</span>
                    <span className="font-mono">{event.source || 'N/A'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block text-xs mb-1">Motor de Detecção</span>
                    <span className="font-mono">{event.mlModel || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Raw Log */}
              {event.rawLog && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <Code className="w-4 h-4 text-primary" />
                    Log Original (Raw)
                  </h4>
                  <div className="bg-[#1e1e1e] p-3 rounded border border-border overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
                      {event.rawLog}
                    </pre>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="pt-4 border-t border-border flex gap-3">
                {/* Botão com onClick chamando a função */}
                <Button 
                  variant="outline" 
                  className="w-full text-foreground hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30 transition-colors"
                  onClick={handleWhitelist}
                >
                  Marcar Falso Positivo
                </Button>
              </div>

            </div>
          ) : (
            <div className="text-center text-muted-foreground mt-10">Evento não encontrado.</div>
          )}
        </div>
      </div>
    </>
  )
}