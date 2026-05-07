import { notFound } from "next/navigation"

// 1. Dados dos cursos (Idealmente viriam de uma API ou Banco)
const cursosData = {
  saude: [
    { 
      nome: "Medicina", 
      duracao: "6 anos", 
      modalidade: "Presencial", 
      campus: "Campus Central", 
      nota: 5, 
      destaque: true, 
      descricao: "Formação médica completa com foco em humanização e tecnologia de ponta." 
    },
    { 
      nome: "Enfermagem", 
      duracao: "4 anos", 
      modalidade: "Presencial", 
      campus: "Campus Saúde", 
      nota: 4, 
      destaque: false, 
      descricao: "Prepare-se para atuar na assistência, gestão e pesquisa em saúde." 
    },
    { 
      nome: "Psicologia", 
      duracao: "5 anos", 
      modalidade: "Presencial", 
      campus: "Campus Saúde", 
      nota: 5, 
      destaque: false, 
      descricao: "Estudo do comportamento humano e processos mentais para atuação clínica e social." 
    },
  ],
  exatas: [
    { 
      nome: "Engenharia de Software", 
      duracao: "4 anos", 
      modalidade: "Presencial/EAD", 
      campus: "Campus Tecnologia", 
      nota: 5, 
      destaque: true, 
      descricao: "Foco em arquitetura de sistemas, desenvolvimento ágil e gestão de projetos tecnológicos." 
    },
    { 
      nome: "Arquitetura", 
      duracao: "5 anos", 
      modalidade: "Presencial", 
      campus: "Campus Tecnologia", 
      nota: 4, 
      destaque: false, 
      descricao: "Planejamento e design de espaços urbanos e edificações sustentáveis." 
    },
  ],
  humanas: [
    { 
      nome: "Direito", 
      duracao: "5 anos", 
      modalidade: "Presencial", 
      campus: "Campus Central", 
      nota: 5, 
      destaque: true, 
      descricao: "Base sólida para advocacia, magistratura e alta performance em concursos públicos." 
    },
    { 
      nome: "Administração", 
      duracao: "4 anos", 
      modalidade: "Presencial/EAD", 
      campus: "Campus Central", 
      nota: 4, 
      destaque: false, 
      descricao: "Gestão estratégica de negócios, recursos humanos e finanças corporativas." 
    },
  ],
}

// 2. Função de Slugify robusta
function slugify(nome: string) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s-]/g, "")       // Remove caracteres especiais
    .replace(/\s+/g, "-")           // Substitui espaços por hifens
    .trim()
}

// 3. Tipagem dos parâmetros
interface RouteParams {
  params: Promise<{ slug: string }>
}

// 4. Server Component (Ajustado para Next.js 14/15)
export default async function CursoPage({ params }: RouteParams) {
  // No Next.js 15, params é uma Promise
  const { slug } = await params

  if (!slug) return notFound()

  const todosCursos = [
    ...cursosData.saude,
    ...cursosData.exatas,
    ...cursosData.humanas,
  ]

  // Procura o curso comparando o slug gerado na hora com o slug da URL
  const curso = todosCursos.find((c) => slugify(c.nome) === slug)

  if (!curso) return notFound()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold text-primary">{curso.nome}</h1>
        
        <p className="mb-8 text-xl text-muted-foreground">
          {curso.descricao}
        </p>

        <div className="grid gap-4 rounded-xl border p-6 bg-card text-card-foreground shadow-sm">
          <h2 className="text-lg font-semibold border-b pb-2">Informações do Curso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Duração:</strong> {curso.duracao}</p>
            <p><strong>Modalidade:</strong> {curso.modalidade}</p>
            <p><strong>Campus:</strong> {curso.campus}</p>
            <p><strong>Nota MEC:</strong> <span className="text-yellow-500">{"★".repeat(curso.nota)}</span> ({curso.nota})</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 5. Opcional: Gerar caminhos estáticos para performance (SEO)
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