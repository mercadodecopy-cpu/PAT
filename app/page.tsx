import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Roteiros de Video YouTube{' '}
          <span className="text-primary">com IA</span>
        </h1>
        <p className="max-w-[600px] text-lg text-muted-foreground">
          Crie roteiros profissionais baseados em 200+ principios destilados de
          analises de roteiros excepcionais. Da ideia ao roteiro completo em
          minutos.
        </p>
        <div className="flex gap-4">
          <Link href="/signup">
            <Button size="lg">Comecar agora</Button>
          </Link>
          <Link href="#como-funciona">
            <Button variant="outline" size="lg">
              Como funciona
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Como funciona</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Defina seu video',
              desc: 'Escolha o nicho, duracao, tom e estilo do seu roteiro. A IA se adapta ao seu contexto.',
            },
            {
              step: '2',
              title: 'IA gera o roteiro',
              desc: 'Nossa IA aplica 200+ principios para criar um roteiro otimizado para retencao e engajamento.',
            },
            {
              step: '3',
              title: 'Revise e publique',
              desc: 'Edite, ajuste detalhes e use o roteiro finalizado para criar seu video.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col items-center gap-4 rounded-lg border p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Por que RoteiroIA?
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: '200+ principios',
              desc: 'Base de conhecimento destilada de analises profundas de roteiros de alta performance.',
            },
            {
              title: '6 nichos cobertos',
              desc: 'Crime, ciencia, historia, transformacao pessoal, laboratorio e projetos epicos.',
            },
            {
              title: '4 modos de geracao',
              desc: 'Do modo livre ao expert, cada nivel oferece mais controle e personalizacao.',
            },
            {
              title: '6 templates de formato',
              desc: 'Padrao, screenplay, bullets, timestamps, markdown ou minimalista.',
            },
            {
              title: 'Metodo Myke integrado',
              desc: 'Filosofia propria de criacao que prioriza autenticidade sobre formulas prontas.',
            },
            {
              title: 'Adaptado ao Brasil',
              desc: 'Referencias culturais, exemplos e linguagem adaptados a realidade brasileira.',
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-lg border p-6">
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-3xl font-bold">Pronto para comecar?</h2>
        <p className="mb-8 text-muted-foreground">
          Crie sua conta gratuita e gere seu primeiro roteiro hoje.
        </p>
        <Link href="/signup">
          <Button size="lg">Criar conta gratuita</Button>
        </Link>
      </section>
    </div>
  )
}
