"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, GraduationCap, Phone, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const cursos = [
  {
    title: "Engenharia de Software",
    href: "/cursos/engenharia-de-software",
    description: "Formação completa em desenvolvimento de sistemas e software.",
  },
  {
    title: "Administração",
    href: "/cursos/administracao",
    description: "Capacitação em gestão empresarial e liderança organizacional.",
  },
  {
    title: "Direito",
    href: "/cursos/direito",
    description: "Formação jurídica com foco na prática profissional.",
  },
  {
    title: "Medicina",
    href: "/cursos/medicina",
    description: "Excelência em formação médica e humanizada.",
  },
  {
    title: "Psicologia",
    href: "/cursos/psicologia",
    description: "Compreensão do comportamento humano e saúde mental.",
  },
  {
    title: "Arquitetura e Urbanismo",
    href: "/cursos/arquitetura",
    description: "Projeto e planejamento de espaços urbanos e edificações.",
  },
]

const institucional = [
  {
    title: "Sobre a UniVida",
    href: "/sobre",
    description: "Conheça nossa história, missão e valores.",
  },
  {
    title: "Infraestrutura",
    href: "/sobre#infraestrutura",
    description: "Laboratórios, bibliotecas e espaços de convivência.",
  },
  {
    title: "Corpo Docente",
    href: "/sobre#docentes",
    description: "Professores qualificados e experientes.",
  },
  {
    title: "Parcerias",
    href: "/sobre#parcerias",
    description: "Empresas e instituições parceiras.",
  },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="hidden border-b bg-primary text-primary-foreground md:block">
        <div className="container mx-auto flex items-center justify-between px-4 py-2 text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+5511999999999" className="flex items-center gap-2 hover:underline">
              <Phone className="h-4 w-4" />
              (11) 99999-9999
            </a>
            <a href="mailto:contato@univida.edu.br" className="flex items-center gap-2 hover:underline">
              <Mail className="h-4 w-4" />
              contato@univida.edu.br
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/portal-aluno" className="hover:underline">
              Portal do Aluno
            </Link>
            <Link href="/portal-professor" className="hover:underline">
              Portal do Professor
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">UniVida</span>
              <span className="text-xs text-muted-foreground">Universidade</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">
                    Início
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Cursos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                    {cursos.map((curso) => (
                      <ListItem
                        key={curso.title}
                        title={curso.title}
                        href={curso.href}
                      >
                        {curso.description}
                      </ListItem>
                    ))}
                    <li className="col-span-2">
                      <Link
                        href="/cursos"
                        className="flex w-full items-center justify-center rounded-md bg-secondary p-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                      >
                        Ver todos os cursos →
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Institucional</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {institucional.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/vestibular">
                    Vestibular
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/contato">
                    Contato
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button */}
          <div className="hidden items-center gap-4 lg:flex">
            <Button asChild variant="outline">
              <Link href="/vestibular">Inscreva-se</Link>
            </Button>
            <Button asChild>
              <Link href="/vestibular">Vestibular 2026</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-lg font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Início
                </Link>
                <Link
                  href="/cursos"
                  className="text-lg font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Cursos
                </Link>
                <Link
                  href="/sobre"
                  className="text-lg font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Sobre
                </Link>
                <Link
                  href="/vestibular"
                  className="text-lg font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Vestibular
                </Link>
                <Link
                  href="/contato"
                  className="text-lg font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Contato
                </Link>
                <hr className="my-4" />
                <Link
                  href="/portal-aluno"
                  className="text-muted-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Portal do Aluno
                </Link>
                <Link
                  href="/portal-professor"
                  className="text-muted-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Portal do Professor
                </Link>
                <hr className="my-4" />
                <Button asChild className="w-full">
                  <Link href="/vestibular" onClick={() => setIsOpen(false)}>
                    Vestibular 2026
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function ListItem({
  className,
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & { href: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
