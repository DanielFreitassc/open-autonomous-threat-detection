"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Percent,
  CreditCard,
  HelpCircle,
  AlertCircle
} from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

const cronograma = [
  { data: "01/04 a 31/05", evento: "Inscrições abertas", status: "atual" },
  { data: "15/06", evento: "Prova presencial", status: "futuro" },
  { data: "20/06", evento: "Divulgação do gabarito", status: "futuro" },
  { data: "25/06", evento: "Resultado final", status: "futuro" },
  { data: "01/07 a 15/07", evento: "Matrículas", status: "futuro" },
  { data: "01/08", evento: "Início das aulas", status: "futuro" },
]

const beneficios = [
  {
    icon: Percent,
    titulo: "Bolsas de até 100%",
    descricao: "Programas de bolsa por mérito acadêmico e condição socioeconômica",
  },
  {
    icon: CreditCard,
    titulo: "Financiamento próprio",
    descricao: "Parcelamento facilitado direto com a universidade",
  },
  {
    icon: GraduationCap,
    titulo: "Nota do ENEM",
    descricao: "Use sua nota do ENEM para ingressar sem fazer prova",
  },
  {
    icon: FileText,
    titulo: "Transferência externa",
    descricao: "Aceite de créditos de outras instituições",
  },
]

const faq = [
  {
    pergunta: "Quais documentos preciso para me inscrever?",
    resposta: "Para inscrição, você precisa de RG, CPF, comprovante de residência e histórico escolar do Ensino Médio (ou declaração de cursando para alunos do 3º ano).",
  },
  {
    pergunta: "Posso usar minha nota do ENEM?",
    resposta: "Sim! Aceitamos notas do ENEM dos últimos 5 anos. A nota mínima varia de acordo com o curso escolhido. Consulte o edital para mais detalhes.",
  },
  {
    pergunta: "Como funciona o programa de bolsas?",
    resposta: "Oferecemos bolsas de mérito acadêmico (baseada na nota do vestibular) e bolsas socioeconômicas (mediante comprovação de renda). Os percentuais variam de 25% a 100%.",
  },
  {
    pergunta: "Qual a taxa de inscrição?",
    resposta: "A taxa de inscrição é de R$ 120,00. Candidatos de baixa renda podem solicitar isenção mediante comprovação.",
  },
  {
    pergunta: "Onde será realizada a prova?",
    resposta: "A prova será realizada em todos os nossos campus e em polos de aplicação em cidades parceiras. O local será informado no cartão de confirmação de inscrição.",
  },
  {
    pergunta: "Posso mudar de curso após aprovado?",
    resposta: "Sim, após o primeiro semestre é possível solicitar transferência interna para outro curso, sujeito à disponibilidade de vagas e aproveitamento acadêmico.",
  },
]

export default function VestibularPage() {
  const [curso, setCurso] = useState("")
  const [modalidade, setModalidade] = useState("")

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-primary py-16 text-primary-foreground lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-amber-500 text-white">
              <Calendar className="mr-1 h-3 w-3" />
              Inscrições Abertas
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Vestibular 2026
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/80">
              Sua jornada de sucesso começa aqui. Inscreva-se no vestibular da UniVida 
              e transforme seu futuro com uma educação de excelência.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <a href="#inscricao">
                  Fazer inscrição
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20">
                <a href="#edital">
                  Consultar edital
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Cronograma */}
      <section className="border-b bg-card py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">Cronograma do Processo Seletivo</h2>
          <div className="grid gap-4 md:grid-cols-6">
            {cronograma.map((item, index) => (
              <div
                key={index}
                className={`relative rounded-lg border p-4 text-center ${
                  item.status === "atual" 
                    ? "border-amber-400 bg-amber-50" 
                    : "border-border bg-background"
                }`}
              >
                {item.status === "atual" && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white">
                    Em andamento
                  </Badge>
                )}
                <div className="mt-2 text-sm font-semibold text-primary">{item.data}</div>
                <div className="mt-1 text-sm text-muted-foreground">{item.evento}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Vantagens de estudar na UniVida</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Oferecemos diversas formas de ingresso e benefícios para você realizar o sonho da graduação
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {beneficios.map((item) => (
              <Card key={item.titulo} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{item.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{item.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário de Inscrição */}
      <section id="inscricao" className="bg-secondary/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold">Faça sua inscrição</h2>
              <p className="text-muted-foreground">
                Preencha o formulário abaixo para iniciar sua inscrição no Vestibular 2026
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dados do Candidato</CardTitle>
                <CardDescription>
                  Informe seus dados para prosseguir com a inscrição
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="nome">Nome completo</FieldLabel>
                      <Input id="nome" placeholder="Digite seu nome completo" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="email">E-mail</FieldLabel>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </Field>
                  </FieldGroup>

                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                      <Input id="cpf" placeholder="000.000.000-00" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
                      <Input id="telefone" placeholder="(00) 00000-0000" />
                    </Field>
                  </FieldGroup>

                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>Curso desejado</FieldLabel>
                      <Select value={curso} onValueChange={setCurso}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o curso" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medicina">Medicina</SelectItem>
                          <SelectItem value="direito">Direito</SelectItem>
                          <SelectItem value="eng-software">Engenharia de Software</SelectItem>
                          <SelectItem value="administracao">Administração</SelectItem>
                          <SelectItem value="psicologia">Psicologia</SelectItem>
                          <SelectItem value="odontologia">Odontologia</SelectItem>
                          <SelectItem value="arquitetura">Arquitetura e Urbanismo</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Modalidade de ingresso</FieldLabel>
                      <Select value={modalidade} onValueChange={setModalidade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vestibular">Vestibular tradicional</SelectItem>
                          <SelectItem value="enem">Nota do ENEM</SelectItem>
                          <SelectItem value="transferencia">Transferência externa</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>

                  <div className="rounded-lg border border-amber-400/50 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800">Taxa de inscrição: R$ 120,00</p>
                        <p className="text-amber-700">
                          O pagamento será gerado após o preenchimento completo do formulário.
                          Candidatos de baixa renda podem solicitar isenção.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Continuar inscrição
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Edital */}
      <section id="edital" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold">Edital e Documentos</h2>
              <p className="text-muted-foreground">
                Consulte todos os documentos oficiais do processo seletivo
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="group cursor-pointer transition-all hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary">Edital Completo</h3>
                    <p className="text-sm text-muted-foreground">PDF - 2.5 MB</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer transition-all hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary">Manual do Candidato</h3>
                    <p className="text-sm text-muted-foreground">PDF - 1.8 MB</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer transition-all hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary">Programa das Provas</h3>
                    <p className="text-sm text-muted-foreground">PDF - 800 KB</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer transition-all hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary">Provas Anteriores</h3>
                    <p className="text-sm text-muted-foreground">ZIP - 15 MB</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <HelpCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h2 className="mb-4 text-3xl font-bold">Perguntas Frequentes</h2>
              <p className="text-muted-foreground">
                Tire suas dúvidas sobre o processo seletivo
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faq.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.pergunta}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.resposta}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 text-center">
              <p className="mb-4 text-muted-foreground">
                Ainda tem dúvidas? Entre em contato conosco
              </p>
              <Button asChild variant="outline">
                <Link href="/contato">
                  Fale conosco
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-primary py-16 text-white lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Não perca essa oportunidade!
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-white/90">
            As inscrições encerram em breve. Garanta sua vaga em uma das melhores universidades do país.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Bolsas de até 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Aceita ENEM</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Financiamento próprio</span>
            </div>
          </div>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <a href="#inscricao">
              Inscreva-se agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
