import { notFound } from "next/navigation"
import { 
  Clock, 
  MapPin, 
  GraduationCap, 
  Star, 
  CheckCircle2, 
  ArrowLeft,
  BookOpen
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// 1. DADOS ATUALIZADOS (Incluindo todos os cursos dos seus logs)
const cursosData = {
  saude: [
    { nome: "Medicina", duracao: "6 anos", modalidade: "Presencial", campus: "Campus Central", nota: 5, destaque: true, descricao: "Formação médica completa com foco em humanização e tecnologia de ponta." },
    { nome: "Enfermagem", duracao: "4 anos", modalidade: "Presencial", campus: "Campus Saúde", nota: 4, destaque: false, descricao: "Prepare-se para atuar na assistência, gestão e pesquisa em saúde." },
    { nome: "Psicologia", duracao: "5 anos", modalidade: "Presencial", campus: "Campus Saúde", nota: 5, destaque: false, descricao: "Estudo do comportamento humano e processos mentais para atuação clínica e social." },
  ],
  exatas: [
    { nome: "Engenharia de Software", duracao: "4 anos", modalidade: "Presencial/EAD", campus: "Campus Tecnologia", nota: 5, destaque: true, descricao: "Foco em arquitetura de sistemas, desenvolvimento ágil e gestão de projetos tecnológicos." },
    { nome: "Arquitetura", duracao: "5 anos", modalidade: "Presencial", campus: "Campus Tecnologia", nota: 4, destaque: false, descricao: "Planejamento e design de espaços urbanos e edificações sustentáveis." },
  ],
  humanas: [
    { nome: "Direito", duracao: "5 anos", modalidade: "Presencial", campus: "Campus Central", nota: 5, destaque: true, descricao: "Base sólida para advocacia, magistratura e alta performance em concursos públicos." },
    { nome: "Administração", duracao: "4 anos", modalidade: "Presencial/EAD", campus: "Campus Central", nota: 4, destaque: false, descricao: "Gestão estratégica de negócios, recursos humanos e finanças corporativas." },
  ],
}

function slugify(nome: string) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim()
}

interface RouteParams {
  params: Promise<{ slug: string }>
}

export default async function CursoPage({ params }: RouteParams) {
  const { slug } = await params

  // Une todas as categorias em um único array para busca
  const todosCursos = [
    ...cursosData.saude,
    ...cursosData.exatas,
    ...cursosData.humanas,
  ]

  const curso = todosCursos.find((c) => slugify(c.nome) === slug)

  if (!curso) return notFound()

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Banner de Cabeçalho */}
      <div className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4">
          <Link href="/cursos">
            <Button variant="ghost" className="mb-6 text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Cursos
            </Button>
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none">
              Graduação
            </Badge>
            {curso.destaque && (
              <Badge className="bg-yellow-500 text-black border-none">
                <Star className="mr-1 h-3 w-3 fill-current" /> Destaque
              </Badge>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{curso.nome}</h1>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" /> Sobre o Curso
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {curso.descricao}
              </p>
              
              <Separator className="my-8" />
              
              <h3 className="text-xl font-medium mb-6">O que você vai encontrar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Laboratórios de última geração",
                  "Corpo docente especializado",
                  "Parcerias com empresas do setor",
                  "Projetos de extensão e pesquisa"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-muted/50 p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-6">Informações Rápidas</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Duração</p>
                    <p className="font-medium">{curso.duracao}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Modalidade</p>
                    <p className="font-medium">{curso.modalidade}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Localização</p>
                    <p className="font-medium">{curso.campus}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Nota MEC</p>
                    <p className="font-medium">Conceito {curso.nota}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-8 h-12 text-lg">
                Inscrever-se no Vestibular
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const todosCursos = [
    ...cursosData.saude,
    ...cursosData.exatas,
    ...cursosData.humanas,
  ]

  return todosCursos.map((curso) => ({
    slug: slugify(curso.nome),
  }))
}