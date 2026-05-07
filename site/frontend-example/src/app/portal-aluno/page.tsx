"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  GraduationCap, 
  Lock, 
  User, 
  ArrowRight,
  HelpCircle,
  Smartphone
} from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export default function PortalAlunoPage() {
  const [ra, setRa] = useState("")
  const [senha, setSenha] = useState("")

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Portal do Aluno</h1>
            <p className="text-muted-foreground">
              Acesse sua área restrita
            </p>
          </div>

          {/* Formulário de Login */}
          <Card>
            <CardHeader>
              <CardTitle>Entrar</CardTitle>
              <CardDescription>
                Utilize seu RA e senha para acessar o portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <Field>
                  <FieldLabel htmlFor="ra">RA (Registro Acadêmico)</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="ra"
                      placeholder="Digite seu RA"
                      className="pl-10"
                      value={ra}
                      onChange={(e) => setRa(e.target.value)}
                    />
                  </div>
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="senha">Senha</FieldLabel>
                    <Link
                      href="/portal-aluno/recuperar-senha"
                      className="text-sm text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Digite sua senha"
                      className="pl-10"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </div>
                </Field>

                <div className="flex items-center space-x-2">
                  <Checkbox id="lembrar" />
                  <label
                    htmlFor="lembrar"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Lembrar meus dados
                  </label>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Entrar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Links úteis */}
          <div className="mt-6 space-y-4">
            <Card className="bg-secondary/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">App UniVida</h4>
                  <p className="text-sm text-muted-foreground">
                    Baixe nosso aplicativo para celular
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Precisa de ajuda?</h4>
                  <p className="text-sm text-muted-foreground">
                    <Link href="/contato" className="text-primary hover:underline">
                      Entre em contato com o suporte
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Primeiro acesso */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Primeiro acesso?{" "}
              <Link href="/portal-aluno/primeiro-acesso" className="text-primary hover:underline">
                Clique aqui para cadastrar sua senha
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
