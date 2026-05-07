import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Trophy, 
  Building2, 
  Microscope,
  ArrowRight,
  CheckCircle,
  Star,
  Calendar
} from "lucide-react"

const cursos = [
  {
    nome: "Medicina",
    duracao: "6 anos",
    modalidade: "Presencial",
    destaque: true,
    href: "/cursos/medicina",
  },
  {
    nome: "Direito",
    duracao: "5 anos",
    modalidade: "Presencial",
    destaque: true,
    href: "/cursos/direito",
  },
  {
    nome: "Engenharia de Software",
    duracao: "4 anos",
    modalidade: "Presencial/EAD",
    destaque: false,
    href: "/cursos/engenharia-software",
  },
  {
    nome: "Administração",
    duracao: "4 anos",
    modalidade: "Presencial/EAD",
    destaque: false,
    href: "/cursos/administracao",
  },
  {
    nome: "Psicologia",
    duracao: "5 anos",
    modalidade: "Presencial",
    destaque: false,
    href: "/cursos/psicologia",
  },
  {
    nome: "Arquitetura e Urbanismo",
    duracao: "5 anos",
    modalidade: "Presencial",
    destaque: false,
    href: "/cursos/arquitetura",
  },
]

const diferenciais = [
  {
    icon: Building2,
    titulo: "Infraestrutura Moderna",
    descricao: "Laboratórios equipados, bibliotecas completas e espaços de convivência.",
  },
  {
    icon: Users,
    titulo: "Corpo Docente Qualificado",
    descricao: "Professores mestres e doutores com experiência de mercado.",
  },
  {
    icon: Microscope,
    titulo: "Pesquisa e Inovação",
    descricao: "Programas de iniciação científica e parcerias com empresas.",
  },
  {
    icon: Trophy,
    titulo: "Reconhecimento MEC",
    descricao: "Cursos avaliados com nota máxima pelo Ministério da Educação.",
  },
]

const noticias = [
  {
    titulo: "Vestibular 2026 com inscrições abertas",
    data: "15 de Abril, 2026",
    categoria: "Vestibular",
  },
  {
    titulo: "UniVida conquista prêmio de melhor infraestrutura",
    data: "10 de Abril, 2026",
    categoria: "Institucional",
  },
  {
    titulo: "Novo laboratório de inteligência artificial",
    data: "05 de Abril, 2026",
    categoria: "Inovação",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-amber-500 text-white hover:bg-amber-600">
              Vestibular 2026 - Inscrições Abertas
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-balance">Transforme seu futuro com uma educação de excelência</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
              Há mais de 50 anos formando profissionais de sucesso. 
              Descubra o curso ideal para sua carreira na UniVida.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href="/vestibular">
                  Inscreva-se no Vestibular
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full border-white/50 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                <Link href="/cursos">
                  Conheça nossos cursos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="border-b bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">50+</div>
              <div className="mt-1 text-sm text-muted-foreground">Anos de história</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">15.000+</div>
              <div className="mt-1 text-sm text-muted-foreground">Alunos matriculados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">60+</div>
              <div className="mt-1 text-sm text-muted-foreground">Cursos oferecidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">95%</div>
              <div className="mt-1 text-sm text-muted-foreground">Empregabilidade</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos em Destaque */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Cursos em Destaque
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Conheça alguns dos nossos cursos mais procurados e descubra qual combina com seu perfil profissional.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cursos.map((curso) => (
              <Card key={curso.nome} className="group transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    {curso.destaque && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                        <Star className="mr-1 h-3 w-3" />
                        Destaque
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4 group-hover:text-primary">{curso.nome}</CardTitle>
                  <CardDescription>
                    Duração: {curso.duracao} • {curso.modalidade}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={curso.href}>
                      Saiba mais
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href="/cursos">
                Ver todos os cursos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="bg-secondary/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Por que escolher a UniVida?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Nossa universidade oferece uma experiência educacional completa, 
              preparando você para os desafios do mercado de trabalho.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {diferenciais.map((item) => (
              <div key={item.titulo} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.titulo}</h3>
                <p className="text-sm text-muted-foreground">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Vestibular */}
      <section className="bg-primary py-16 text-white lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-white/20 text-white">
              <Calendar className="mr-1 h-3 w-3" />
              Provas em Junho/2026
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Vestibular 2026
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Inscrições abertas para o processo seletivo. 
              Garanta sua vaga em uma das melhores universidades do país.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/vestibular">
                  Inscreva-se agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20">
                <Link href="/vestibular#edital">
                  Consulte o edital
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Bolsas de até 100%
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Financiamento próprio
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Aceita nota do ENEM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notícias */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                Últimas Notícias
              </h2>
              <p className="text-muted-foreground">
                Fique por dentro das novidades da UniVida
              </p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/noticias">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {noticias.map((noticia, index) => (
              <Card key={index} className="group cursor-pointer transition-all hover:shadow-lg">
                <CardHeader>
                  <Badge variant="outline" className="w-fit">
                    {noticia.categoria}
                  </Badge>
                  <CardTitle className="line-clamp-2 group-hover:text-primary">
                    {noticia.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {noticia.data}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline">
              <Link href="/noticias">
                Ver todas as notícias
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="bg-secondary/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              O que nossos alunos dizem
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Histórias de sucesso de quem escolheu a UniVida para sua formação
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  {'"A UniVida me proporcionou uma formação completa e me preparou para o mercado de trabalho. Hoje atuo em uma multinacional graças à base sólida que recebi."'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    MC
                  </div>
                  <div>
                    <div className="font-medium">Maria Clara</div>
                    <div className="text-sm text-muted-foreground">Engenharia de Software, 2024</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  {'"Os professores são extremamente dedicados e a infraestrutura é de primeiro mundo. Recomendo a todos que buscam uma educação de qualidade."'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    PS
                  </div>
                  <div>
                    <div className="font-medium">Pedro Santos</div>
                    <div className="text-sm text-muted-foreground">Direito, 2023</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  {'"A residência médica da UniVida é reconhecida nacionalmente. Me formei preparada para enfrentar qualquer desafio na minha carreira."'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    AO
                  </div>
                  <div>
                    <div className="font-medium">Ana Oliveira</div>
                    <div className="text-sm text-muted-foreground">Medicina, 2022</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <BookOpen className="mx-auto mb-6 h-12 w-12" />
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Comece sua jornada acadêmica
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
              Não perca a oportunidade de estudar em uma das melhores universidades do país. 
              Faça sua inscrição agora e transforme seu futuro.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/vestibular">
                  Inscreva-se no Vestibular
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20">
                <Link href="/contato">
                  Fale conosco
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
