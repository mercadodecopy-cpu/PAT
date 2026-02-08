import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/UserNav'
import { ThemeToggle } from '@/components/ThemeToggle'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">RoteiroIA</span>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/create">
                <Button variant="ghost" size="sm">
                  Criar Roteiro
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="ghost" size="sm">
                  Historico
                </Button>
              </Link>
              <ThemeToggle />
              <UserNav user={user} />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Criar conta</Button>
              </Link>
              <ThemeToggle />
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
