'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import {
  ArrowLeft,
  Loader2,
  UserCheck,
  UserX,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { User, PaginatedResponse } from '@/types'

export default function UsersPage() {
  const [activeUsers, setActiveUsers] = useState<User[]>([])
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [activeLoading, setActiveLoading] = useState(true)
  const [pendingLoading, setPendingLoading] = useState(true)
  const [activePage, setActivePage] = useState(0)
  const [pendingPage, setPendingPage] = useState(0)
  const [activeTotalPages, setActiveTotalPages] = useState(0)
  const [pendingTotalPages, setPendingTotalPages] = useState(0)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [processingUserId, setProcessingUserId] = useState<string | null>(null)

  const pageSize = 10

  const fetchActiveUsers = useCallback(async () => {
    setActiveLoading(true)
    try {
      const response = await api.get<PaginatedResponse<User>>('/users', {
        params: { page: activePage, size: pageSize },
      })
      setActiveUsers(response.data.content)
      setActiveTotalPages(response.data.totalPages)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Erro ao carregar usuarios ativos')
    } finally {
      setActiveLoading(false)
    }
  }, [activePage])

  const fetchPendingUsers = useCallback(async () => {
    setPendingLoading(true)
    try {
      const response = await api.get<PaginatedResponse<User>>('/users/pending', {
        params: { page: pendingPage, size: pageSize },
      })
      setPendingUsers(response.data.content)
      setPendingTotalPages(response.data.totalPages)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Erro ao carregar usuarios pendentes')
    } finally {
      setPendingLoading(false)
    }
  }, [pendingPage])

  useEffect(() => {
    fetchActiveUsers()
  }, [fetchActiveUsers])

  useEffect(() => {
    fetchPendingUsers()
  }, [fetchPendingUsers])

  const handleToggleStatus = async (user: User) => {
    setProcessingUserId(user.id)
    try {
      if (user.status === 'PENDING') {
        await api.post(`/users/${user.id}/activate`)
        toast.success('Usuario ativado com sucesso!')
      } else {
        await api.post(`/users/${user.id}/activate`)
        toast.success('Usuario desativado com sucesso!')
      }
      fetchActiveUsers()
      fetchPendingUsers()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Erro ao alterar status do usuario')
    } finally {
      setProcessingUserId(null)
    }
  }

  const handleDelete = async () => {
    if (!deletingUser) return
    setIsDeleting(true)
    try {
      await api.delete(`/users/${deletingUser.id}`)
      toast.success('Usuario removido com sucesso!')
      setDeletingUser(null)
      fetchActiveUsers()
      fetchPendingUsers()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Erro ao remover usuario')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setEditForm({ name: user.name, email: user.email, password: '' })
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return
    setIsSaving(true)
    try {
      const payload: { name: string; email: string; password?: string } = {
        name: editForm.name,
        email: editForm.email,
      }
      if (editForm.password) {
        payload.password = editForm.password
      }
      await api.patch(`/users/${editingUser.id}`, payload)
      toast.success('Usuario atualizado com sucesso!')
      setEditingUser(null)
      fetchActiveUsers()
      fetchPendingUsers()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Erro ao atualizar usuario')
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  const UserCard = ({ user, isPending = false }: { user: User; isPending?: boolean }) => (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-medium">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isPending ? 'secondary' : 'default'} className="text-xs">
                  {isPending ? 'Pendente' : 'Ativo'}
                </Badge>
                {user.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    Criado em: {formatDate(user.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleStatus(user)}
              disabled={processingUserId === user.id}
              title={isPending ? 'Ativar usuario' : 'Desativar usuario'}
            >
              {processingUserId === user.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPending ? (
                <UserCheck className="w-4 h-4 text-green-500" />
              ) : (
                <UserX className="w-4 h-4 text-yellow-500" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} title="Editar usuario">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeletingUser(user)}
              title="Remover usuario"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    loading,
  }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    loading: boolean
  }) => (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0 || loading}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        Pagina {currentPage + 1} de {Math.max(1, totalPages)}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1 || loading}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Gerenciamento de Usuarios</h2>
            <p className="text-muted-foreground">Gerencie os usuarios do sistema</p>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active" className="gap-2">
              <Users className="w-4 h-4" />
              Ativos ({activeUsers.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Pendentes ({pendingUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usuarios Ativos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : activeUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum usuario ativo encontrado.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeUsers.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                )}
                {activeTotalPages > 1 && (
                  <Pagination
                    currentPage={activePage}
                    totalPages={activeTotalPages}
                    onPageChange={setActivePage}
                    loading={activeLoading}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usuarios Pendentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : pendingUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum usuario pendente de aprovacao.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingUsers.map((user) => (
                      <UserCard key={user.id} user={user} isPending />
                    ))}
                  </div>
                )}
                {pendingTotalPages > 1 && (
                  <Pagination
                    currentPage={pendingPage}
                    totalPages={pendingTotalPages}
                    onPageChange={setPendingPage}
                    loading={pendingLoading}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Atualize as informacoes do usuario. Deixe a senha em branco para manter a atual.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Nova Senha (opcional)</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="Deixe em branco para manter"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o usuario {deletingUser?.name}? Esta acao nao pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removendo...
                </>
              ) : (
                'Remover'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
