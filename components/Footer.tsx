import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} RoteiroIA. Todos os direitos
          reservados.
        </p>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/termos" className="hover:underline">
            Termos
          </Link>
          <Link href="/privacidade" className="hover:underline">
            Privacidade
          </Link>
        </nav>
      </div>
    </footer>
  )
}
