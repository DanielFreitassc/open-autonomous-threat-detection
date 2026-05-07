"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Building2,
  GraduationCap,
} from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

const contatos = [
  {
    icon: Phone,
    titulo: "Telefone",
    info: "(11) 99999-9999",
    descricao: "Segunda a sexta, 8h às 20h",
  },
  {
    icon: Mail,
    titulo: "E-mail",
    info: "contato@univida.edu.br",
    descricao: "Respondemos em até 24h",
  },
  {
    icon: MessageSquare,
    titulo: "WhatsApp",
    info: "(11) 99999-9999",
    descricao: "Atendimento automático 24h",
  },
]

const campus = [
  {
    nome: "Campus Central",
    endereco: "Av. Universitária, 1000 - Centro",
    cidade: "São Paulo - SP",
    cep: "01310-100",
    telefone: "(11) 3333-1000",
  },
  {
    nome: "Campus Saúde",
    endereco: "Rua da Medicina, 500 - Vila Médica",
    cidade: "São Paulo - SP",
    cep: "01320-200",
    telefone: "(11) 3333-2000",
  },
  {
    nome: "Campus Tecnologia",
    endereco: "Av. da Inovação, 200 - Tech Park",
    cidade: "São Paulo - SP",
    cep: "01330-300",
    telefone: "(11) 3333-3000",
  },
]

export default function ContatoPage() {
  const [assunto, setAssunto] = useState("")

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-primary py-16 text-primary-foreground lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Fale Conosco
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Estamos aqui para ajudar. Entre em contato conosco e tire todas as suas dúvidas.
            </p>
          </div>
        </div>
      </section>

      {/* Canais de Contato */}
      <section className="border-b bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {contatos.map((item) => (
              <div key={item.titulo} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.titulo}</h3>
                  <p className="text-primary">{item.info}</p>
                  <p className="text-sm text-muted-foreground">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário e Mapa */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Formulário */}
            <div>
              <h2 className="mb-6 text-2xl font-bold">Envie sua mensagem</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Formulário de Contato</CardTitle>
                  <CardDescription>
                    Preencha os campos abaixo e entraremos em contato o mais breve possível
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <FieldGroup className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="nome">Nome completo</FieldLabel>
                        <Input id="nome" placeholder="Digite seu nome" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="email">E-mail</FieldLabel>
                        <Input id="email" type="email" placeholder="seu@email.com" />
                      </Field>
                    </FieldGroup>

                    <FieldGroup className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
                        <Input id="telefone" placeholder="(00) 00000-0000" />
                      </Field>
                      <Field>
                        <FieldLabel>Assunto</FieldLabel>
                        <Select value={assunto} onValueChange={setAssunto}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o assunto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vestibular">Vestibular</SelectItem>
                            <SelectItem value="cursos">Informações sobre cursos</SelectItem>
                            <SelectItem value="financeiro">Financeiro</SelectItem>
                            <SelectItem value="secretaria">Secretaria acadêmica</SelectItem>
                            <SelectItem value="estagio">Estágios e carreiras</SelectItem>
                            <SelectItem value="outros">Outros assuntos</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </FieldGroup>

                    <Field>
                      <FieldLabel htmlFor="mensagem">Mensagem</FieldLabel>
                      <Textarea
                        id="mensagem"
                        placeholder="Digite sua mensagem aqui..."
                        rows={5}
                      />
                    </Field>

                    <Button type="submit" className="w-full" size="lg">
                      Enviar mensagem
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Informações */}
            <div>
              <h2 className="mb-6 text-2xl font-bold">Horário de Atendimento</h2>
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Segunda a Sexta</span>
                        <span className="text-muted-foreground">8h às 20h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Sábado</span>
                        <span className="text-muted-foreground">8h às 14h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Domingo e Feriados</span>
                        <span className="text-muted-foreground">Fechado</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h2 className="mb-6 text-2xl font-bold">Setores Específicos</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Secretaria Acadêmica</h4>
                      <p className="text-sm text-muted-foreground">secretaria@univida.edu.br</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Financeiro</h4>
                      <p className="text-sm text-muted-foreground">financeiro@univida.edu.br</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Ouvidoria</h4>
                      <p className="text-sm text-muted-foreground">ouvidoria@univida.edu.br</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus */}
      <section className="bg-secondary/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Nossos Campus</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Visite-nos em um de nossos campus e conheça nossa infraestrutura
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {campus.map((item) => (
              <Card key={item.nome}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {item.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-muted-foreground">
                    <p>{item.endereco}</p>
                    <p>{item.cidade}</p>
                    <p>CEP: {item.cep}</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Phone className="h-4 w-4" />
                    <span>{item.telefone}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Ver no mapa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="h-[400px] bg-muted">
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Mapa interativo seria carregado aqui
            </p>
            <p className="text-sm text-muted-foreground">
              (Integração com Google Maps ou similar)
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
