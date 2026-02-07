import { ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'

export default function AdvancedPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
      <Link
        href="/create"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos modos
      </Link>
      <Star className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold">Modo Advanced</h1>
      <p className="mt-4 text-muted-foreground">
        O modo completo com Metodo Myke aplicado esta em desenvolvimento. Em breve voce podera gerar
        roteiros de qualidade maxima com 6 inputs detalhados.
      </p>
    </div>
  )
}
