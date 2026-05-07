import Link from "next/link"
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react"
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo e descrição */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">UniVida</span>
                <span className="text-xs opacity-80">Universidade</span>
              </div>
            </Link>

            <p className="text-sm opacity-80">
              Formando profissionais de excelência há mais de 50 anos.
              Compromisso com a educação, pesquisa e inovação.
            </p>

            <div className="flex gap-4">
              <a href="#" className="opacity-80 transition-opacity hover:opacity-100" aria-label="Facebook">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 transition-opacity hover:opacity-100" aria-label="Instagram">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 transition-opacity hover:opacity-100" aria-label="LinkedIn">
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 transition-opacity hover:opacity-100" aria-label="YouTube">
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cursos" className="opacity-80 hover:opacity-100 hover:underline">Cursos</Link></li>
              <li><Link href="/vestibular" className="opacity-80 hover:opacity-100 hover:underline">Vestibular</Link></li>
              <li><Link href="/sobre" className="opacity-80 hover:opacity-100 hover:underline">Sobre a UniVida</Link></li>
              <li><Link href="/portal-aluno" className="opacity-80 hover:opacity-100 hover:underline">Portal do Aluno</Link></li>
              <li><Link href="/portal-professor" className="opacity-80 hover:opacity-100 hover:underline">Portal do Professor</Link></li>
              <li><Link href="/biblioteca" className="opacity-80 hover:opacity-100 hover:underline">Biblioteca</Link></li>
            </ul>
          </div>

          {/* Cursos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cursos Populares</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cursos/medicina" className="opacity-80 hover:opacity-100 hover:underline">Medicina</Link></li>
              <li><Link href="/cursos/direito" className="opacity-80 hover:opacity-100 hover:underline">Direito</Link></li>
              <li><Link href="/cursos/engenharia-software" className="opacity-80 hover:opacity-100 hover:underline">Engenharia de Software</Link></li>
              <li><Link href="/cursos/administracao" className="opacity-80 hover:opacity-100 hover:underline">Administração</Link></li>
              <li><Link href="/cursos/psicologia" className="opacity-80 hover:opacity-100 hover:underline">Psicologia</Link></li>
              <li><Link href="/cursos" className="font-medium hover:underline">Ver todos →</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span className="opacity-80">
                  Av. Universitária, 1000<br />
                  Bairro Centro - São Paulo, SP<br />
                  CEP: 01310-100
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <a href="tel:+5511999999999" className="opacity-80 hover:underline">
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <a href="mailto:contato@univida.edu.br" className="opacity-80 hover:underline">
                  contato@univida.edu.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <p className="opacity-80">
            © 2026 UniVida Universidade. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacidade" className="opacity-80 hover:underline">Política de Privacidade</Link>
            <Link href="/termos" className="opacity-80 hover:underline">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}