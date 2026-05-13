'use client'

import { useState, useEffect } from 'react'
import { Cpu, KeyRound, Shield, AlertCircle, CheckCircle2, Loader2, Server, UserPlus, LogIn, List, Edit2, Trash2 } from 'lucide-react'
import { 
  getPaginatedModules, 
  createModuleAccount, 
  updateModuleAccount, 
  deleteModuleAccount, 
  loginModule, 
  ModuleResponse,
  ModuleRequest
} from '@/lib/api' 
import { updateAgentToken } from '@/lib/agentApi' 

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'sync'>('list')
  const [modules, setModules] = useState<ModuleResponse[]>([])
  const [isLoadingModules, setIsLoadingModules] = useState(false)
  
  // Estados - Criar/Editar Conta
  const [editingId, setEditingId] = useState<string | null>(null)
  const [originalModule, setOriginalModule] = useState<ModuleResponse | null>(null) // Salva os dados originais para comparar no PATCH
  const [createName, setCreateName] = useState('')
  const [createUsername, setCreateUsername] = useState('')
  const [createPassword, setCreatePassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Estados - Sincronização
  const [syncUsername, setSyncUsername] = useState('')
  const [syncPassword, setSyncPassword] = useState('')
  const [masterSecret, setMasterSecret] = useState('')
  const [generatedToken, setGeneratedToken] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)

  // Feedback Global
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Carrega os módulos da API
  const loadModules = async () => {
    setIsLoadingModules(true)
    try {
      const data = await getPaginatedModules(0, 50)
      setModules(data.content)
    } catch (error) {
      console.error("Erro ao carregar módulos", error)
    } finally {
      setIsLoadingModules(false)
    }
  }

  // Recarrega sempre que entrar na aba de lista
  useEffect(() => {
    if (activeTab === 'list') loadModules()
  }, [activeTab])

  // Função 1: Salvar Conta (Criar ou Atualizar)
  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    try {
      if (editingId) {
        // Lógica de PATCH: Monta o payload APENAS com o que foi modificado
        const payload: Partial<ModuleRequest> = {}
        
        if (createName.trim() !== '' && createName !== originalModule?.name) {
          payload.name = createName
        }
        if (createUsername.trim() !== '' && createUsername !== originalModule?.username) {
          payload.username = createUsername
        }
        if (createPassword.trim() !== '') {
          payload.password = createPassword
        }

        // Se não houver nada no payload, aborta a requisição
        if (Object.keys(payload).length === 0) {
          setFeedback({ type: 'error', message: 'Nenhuma alteração foi detectada.' })
          setIsSaving(false)
          return
        }

        await updateModuleAccount(editingId, payload)
        setFeedback({ type: 'success', message: 'Módulo atualizado com sucesso!' })
      } else {
        // Lógica de POST: Envia todos os dados obrigatoriamente
        const payload: ModuleRequest = { 
          name: createName, 
          username: createUsername, 
          password: createPassword 
        }
        await createModuleAccount(payload)
        setFeedback({ type: 'success', message: 'Conta de serviço (Módulo) criada com sucesso!' })
      }
      
      // Limpa os dados e volta para a lista após sucesso
      setEditingId(null)
      setOriginalModule(null)
      setCreateName('')
      setCreateUsername('')
      setCreatePassword('')
      setTimeout(() => setActiveTab('list'), 1500)
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Erro ao salvar conta de serviço.' })
    } finally {
      setIsSaving(false)
    }
  }

  // Função 2: Deletar Conta
  const handleDeleteModule = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta de serviço?')) return
    
    try {
      await deleteModuleAccount(id)
      setFeedback({ type: 'success', message: 'Módulo excluído com sucesso!' })
      loadModules()
    } catch (error: any) {
      setFeedback({ type: 'error', message: 'Erro ao excluir módulo.' })
    }
  }

  // Prepara o formulário para edição
  const startEdit = (mod: ModuleResponse) => {
    setEditingId(mod.id)
    setOriginalModule(mod) // Salva para uso futuro no PATCH
    setCreateName(mod.name || '')
    setCreateUsername(mod.username)
    setCreatePassword('') // Deixa em branco para não sobreescrever acidentalmente
    setFeedback(null)
    setActiveTab('form')
  }

  // Reseta o formulário para criação
  const startCreate = () => {
    setEditingId(null)
    setOriginalModule(null)
    setCreateName('')
    setCreateUsername('')
    setCreatePassword('')
    setFeedback(null)
    setActiveTab('form')
  }

  // Função 3: Autenticar e Sincronizar Token
  const handleSyncAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSyncing(true)
    setFeedback(null)

    try {
      const authResponse = await loginModule({ username: syncUsername, password: syncPassword })
      const token = authResponse.token
      setGeneratedToken(token) 

      await updateAgentToken({ token: token, adminPassword: masterSecret })
      
      setFeedback({ type: 'success', message: 'Autenticação concluída e Agente sincronizado com o novo token!' })
      setSyncPassword('')
      setMasterSecret('')
    } catch (error: any) {
      if (error.response?.status === 401 && error.config.url.includes('/auth/login-modules')) {
        setFeedback({ type: 'error', message: 'Credenciais do módulo incorretas (Spring Boot).' })
      } else if (error.response?.status === 401) {
        setFeedback({ type: 'error', message: 'Master Secret incorreta (Acesso negado no Agente Python).' })
      } else {
        setFeedback({ type: 'error', message: 'Falha de comunicação. Verifique se o backend (8080) e o agente (5000) estão rodando.' })
      }
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Cpu className="w-8 h-8 text-primary" />
          Gerenciamento de Agentes (Módulos)
        </h1>
        <p className="text-muted-foreground">
          Crie contas de serviço dedicadas, gerencie acessos e sincronize credenciais com os agentes de IA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Painel Principal */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
            
            {/* Navegação por Abas */}
            <div className="flex border-b border-border bg-muted/30">
              <button 
                onClick={() => { setActiveTab('list'); setFeedback(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${activeTab === 'list' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="w-4 h-4" />
                Módulos
              </button>
              <button 
                onClick={startCreate}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${activeTab === 'form' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <UserPlus className="w-4 h-4" />
                {editingId ? 'Editar Módulo' : 'Novo Módulo'}
              </button>
              <button 
                onClick={() => { setActiveTab('sync'); setFeedback(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${activeTab === 'sync' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Server className="w-4 h-4" />
                Sincronizar Agente
              </button>
            </div>

            <div className="p-6">
              
              {/* ABA 1: LISTAGEM DE MÓDULOS */}
              {activeTab === 'list' && (
                <div className="animate-in fade-in space-y-4">
                  {isLoadingModules ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : modules.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      Nenhuma conta de serviço encontrada.
                    </div>
                  ) : (
                    <div className="rounded-md border border-border overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3">Nome</th>
                            <th className="px-4 py-3">Username</th>
                            <th className="px-4 py-3">Criado em</th>
                            <th className="px-4 py-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {modules.map((mod) => (
                            <tr key={mod.id} className="bg-background hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3 font-medium text-foreground">{mod.name}</td>
                              <td className="px-4 py-3 text-muted-foreground">{mod.username}</td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {new Date(mod.createdAt).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="px-4 py-3 text-right space-x-2">
                                <button 
                                  onClick={() => startEdit(mod)}
                                  className="text-blue-500 hover:text-blue-600 transition-colors"
                                  title="Editar Módulo"
                                >
                                  <Edit2 className="w-4 h-4 inline" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteModule(mod.id)}
                                  className="text-red-500 hover:text-red-600 transition-colors"
                                  title="Excluir Módulo"
                                >
                                  <Trash2 className="w-4 h-4 inline" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ABA 2: CRIAR/EDITAR CONTA DE SERVIÇO */}
              {activeTab === 'form' && (
                <form onSubmit={handleSaveModule} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Módulo</label>
                    <input
                      type="text"
                      required={!editingId}
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="Ex: Modulo de Log IA"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Username</label>
                      <input
                        type="text"
                        required={!editingId}
                        value={createUsername}
                        onChange={(e) => setCreateUsername(e.target.value)}
                        placeholder="Ex: agent-ia-01"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Senha</label>
                      <input
                        type="password"
                        required={!editingId} // A senha não é obrigatória na edição
                        value={createPassword}
                        onChange={(e) => setCreatePassword(e.target.value)}
                        placeholder={editingId ? "Deixe em branco para não alterar" : "Senha robusta"}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    {editingId && (
                      <button 
                        type="button" 
                        onClick={() => setActiveTab('list')}
                        className="bg-muted text-foreground hover:bg-muted/80 h-10 px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Cancelar
                      </button>
                    )}
                    <button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium flex items-center">
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingId ? 'Salvar Alterações' : 'Registrar Módulo')}
                    </button>
                  </div>
                </form>
              )}

              {/* ABA 3: SINCRONIZAR AGENTE */}
              {activeTab === 'sync' && (
                <form onSubmit={handleSyncAgent} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  
                  {/* Step 1: Credenciais do Spring */}
                  <div className="p-4 rounded-lg border border-border bg-background space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <LogIn className="w-4 h-4 text-blue-500" />
                      1. Credenciais do Módulo (Acesso à API CSIRT)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Username</label>
                        <input
                          type="text"
                          required
                          value={syncUsername}
                          onChange={(e) => setSyncUsername(e.target.value)}
                          placeholder="agent-ia-01"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Senha do Módulo</label>
                        <input
                          type="password"
                          required
                          value={syncPassword}
                          onChange={(e) => setSyncPassword(e.target.value)}
                          placeholder="••••••••"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Configuração do Agente Python */}
                  <div className="p-4 rounded-lg border border-border bg-background space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-500" />
                      2. Configuração do Agente (Porta 5000)
                    </h3>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Token JWT Gerado (Auto-preenchido)</label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          readOnly
                          value={generatedToken}
                          placeholder="O token aparecerá aqui após autenticar..."
                          className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 pl-10 text-sm text-muted-foreground cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Master Secret (ADMIN_PASSWORD do Agente)</label>
                      <input
                        type="password"
                        required
                        value={masterSecret}
                        onChange={(e) => setMasterSecret(e.target.value)}
                        placeholder="Senha definida na .env do Python"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button type="submit" disabled={isSyncing} className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium flex items-center">
                      {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Autenticar e Sincronizar Agente'}
                    </button>
                  </div>
                </form>
              )}

              {/* Feedback Mensagens */}
              {feedback && (
                <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
                  feedback.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />}
                  <p className="text-sm font-medium">{feedback.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações Laterais */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              Entendendo o Fluxo
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">1. Atualizações Individuais:</strong> Você pode atualizar apenas a senha, ou apenas o nome. O painel envia dinamicamente apenas o que você alterar, respeitando a arquitetura REST (`PATCH`).
              </li>
              <li>
                <strong className="text-foreground">2. Handshake:</strong> Ao sincronizar, o painel fará login no backend (Spring) em nome do agente para obter um Token válido.
              </li>
              <li>
                <strong className="text-foreground">3. Injeção Dinâmica:</strong> O Token gerado é enviado via REST para o Agente Python (Flask), que substitui a credencial na memória sem a necessidade de reiniciar o container.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}