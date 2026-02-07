import { MessageCircle, Zap, Star, Target } from 'lucide-react'
import { ModeCard } from '@/components/ModeCard'

export default function CreatePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Como voce quer criar hoje?</h1>
        <p className="mt-3 text-muted-foreground">
          Escolha o modo de geracao que melhor se adapta ao que voce precisa.
        </p>
      </div>

      <div className="grid gap-4">
        <ModeCard
          icon={<MessageCircle className="h-6 w-6" />}
          title="Modo Livre"
          description="Conversacional - Faco perguntas, voce responde. Ideal para iniciantes."
          badge="Em breve"
          href="/create/livre"
          disabled
        />
        <ModeCard
          icon={<Zap className="h-6 w-6" />}
          title="Modo Quick"
          description="Rapido - 3 inputs, resultado em 2-3 minutos. Teste ideias rapidamente."
          href="/create/quick"
        />
        <ModeCard
          icon={<Star className="h-6 w-6" />}
          title="Modo Advanced"
          description="Completo - Metodo Myke aplicado. Qualidade maxima com 6 inputs."
          href="/create/advanced"
        />
        <ModeCard
          icon={<Target className="h-6 w-6" />}
          title="Modo Expert"
          description="Controle total - Customizacao maxima para criadores experientes."
          href="/create/expert"
        />
      </div>
    </div>
  )
}
