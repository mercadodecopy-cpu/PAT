import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-6xl font-bold">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Pagina nao encontrada</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        A pagina que voce esta procurando nao existe ou foi movida.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/">Voltar ao inicio</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/create">Criar roteiro</Link>
        </Button>
      </div>
    </div>
  )
}
