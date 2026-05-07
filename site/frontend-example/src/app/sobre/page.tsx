import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  GraduationCap, 
  Target, 
  Eye, 
  Heart,
  Building2,
  BookOpen,
  Microscope,
  Users,
  ArrowRight,
  Award,
  Globe,
  Lightbulb
} from "lucide-react"

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a história, missão e valores da UniVida Universidade.",
}

const timeline = [
  { ano: "1974", evento: "Fundação da UniVida como faculdade isolada" },
  { ano: "1985", evento: "Transformação em Centro Universitário" },
  { ano: "1998", evento: "Reconhecimento como Universidade pelo MEC" },
  { ano: "2005", evento: "Inauguração do Campus Saúde" },
  { ano: "2015", evento: "Expansão com Campus Tecnologia" },
  { ano: "2024", evento: "50 anos de história e excelência" },
]

const infraestrutura = [
  {
    icon: Building2,
    titulo: "5 Campus",
    descricao: "Espalhados pela região metropolitana",
  },
  {
    icon: BookOpen,
    titulo: "8 Bibliotecas",
    descricao: "Mais de 500 mil títulos disponíveis",
  },
  {
    icon: Microscope,
    titulo: "120+ Laboratórios",
    descricao: "Equipamentos de última geração",
  },
  {
    icon: Users,
    titulo: "15.000 Alunos",
    descricao: "Comunidade acadêmica diversa",
  },
]

const valores = [
  {
    icon: Award,
    titulo: "Excelência",
    descricao: "Compromisso com a qualidade em tudo que fazemos",
  },
  {
    icon: Heart,
    titulo: "Humanização",
    descricao: "Formação integral do ser humano",
  },
  {
    icon: Lightbulb,
    titulo: "Inovação",
    descricao: "Busca constante por novas soluções",
  },
  {
    icon: Globe,
    titulo: "Responsabilidade Social",
    descricao: "Compromisso com a comunidade",
  },
]

export default function SobrePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-primary py-16 text-primary-foreground lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Sobre a UniVida
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Há mais de 50 anos transformando vidas através da educação de qualidade
            </p>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Nossa História</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Fundada em 1974, a UniVida nasceu do sonho de um grupo de educadores 
                  que acreditavam no poder transformador da educação. O que começou como 
                  uma pequena faculdade com apenas dois cursos, hoje é uma das maiores 
                  universidades particulares do país.
                </p>
                <p>
                  Ao longo de cinco décadas, formamos mais de 100 mil profissionais que 
                  hoje atuam em diversas áreas do conhecimento, contribuindo para o 
                  desenvolvimento da sociedade brasileira e internacional.
                </p>
                <p>
                  Nossa trajetória é marcada pela busca constante por excelência acadêmica, 
                  inovação pedagógica e compromisso com a formação integral dos nossos alunos.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {item.ano.slice(2)}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="h-full w-0.5 bg-border" />
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="font-semibold">{item.ano}</div>
                    <div className="text-muted-foreground">{item.evento}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="bg-secondary/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Missão, Visão e Valores</h2>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Missão</h3>
                <p className="text-muted-foreground">
                  Formar profissionais competentes, éticos e comprometidos com o 
                  desenvolvimento sustentável da sociedade, por meio de ensino, 
                  pesquisa e extensão de qualidade.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Visão</h3>
                <p className="text-muted-foreground">
                  Ser reconhecida como uma universidade de referência nacional e 
                  internacional, destacando-se pela excelência acadêmica e pela 
                  formação de líderes transformadores.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Valores</h3>
                <p className="text-muted-foreground">
                  Ética, respeito à diversidade, compromisso social, inovação, 
                  sustentabilidade e excelência em todas as nossas ações.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {valores.map((valor) => (
              <div key={valor.titulo} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <valor.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-semibold">{valor.titulo}</h4>
                <p className="text-sm text-muted-foreground">{valor.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infraestrutura */}
      <section id="infraestrutura" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Infraestrutura</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Ambiente moderno e equipado para proporcionar a melhor experiência de aprendizado
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {infraestrutura.map((item) => (
              <Card key={item.titulo} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                    <item.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="mb-1 text-2xl font-bold">{item.titulo}</h3>
                  <p className="text-muted-foreground">{item.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-secondary/50 p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-2xl font-bold">Nossos Campus</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span><strong>Campus Central:</strong> Av. Universitária, 1000</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span><strong>Campus Saúde:</strong> Rua da Medicina, 500</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span><strong>Campus Tecnologia:</strong> Av. da Inovação, 200</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span><strong>Campus Engenharias:</strong> Rua dos Engenheiros, 300</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span><strong>Campus Negócios:</strong> Av. Empresarial, 150</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-bold">Recursos Disponíveis</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Laboratórios de informática com equipamentos modernos</li>
                  <li>• Clínicas-escola para cursos da saúde</li>
                  <li>• Núcleos de prática jurídica</li>
                  <li>• Empresa júnior e incubadora de startups</li>
                  <li>• Quadras poliesportivas e academia</li>
                  <li>• Restaurante universitário</li>
                  <li>• Estacionamento amplo</li>
                  <li>• Wi-Fi em todo o campus</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corpo Docente */}
      <section id="docentes" className="bg-secondary/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Corpo Docente</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Professores qualificados e experientes, comprometidos com a formação de excelência
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-2 text-4xl font-bold text-primary">85%</div>
                <p className="font-medium">Mestres e Doutores</p>
                <p className="text-sm text-muted-foreground">
                  Corpo docente altamente qualificado
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-2 text-4xl font-bold text-primary">500+</div>
                <p className="font-medium">Professores</p>
                <p className="text-sm text-muted-foreground">
                  Em todas as áreas do conhecimento
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-2 text-4xl font-bold text-primary">70%</div>
                <p className="font-medium">Dedicação Exclusiva</p>
                <p className="text-sm text-muted-foreground">
                  Foco total na educação
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Faça parte da nossa história
          </h2>
          <p className="mb-8 text-muted-foreground">
            Venha conhecer nossa estrutura e descubra como podemos ajudar a construir seu futuro
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/vestibular">
                Inscreva-se no Vestibular
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contato">
                Agende uma visita
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
