import Link from 'next/link'

export default function TermosPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Termos de Uso</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Ultima atualizacao: {new Date().toLocaleDateString('pt-BR')}
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Aceitacao dos Termos</h2>
          <p>
            Ao acessar e utilizar o RoteiroIA, voce concorda com estes Termos de Uso. Se nao
            concordar com algum destes termos, nao utilize o servico.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Descricao do Servico</h2>
          <p>
            O RoteiroIA e uma plataforma que utiliza inteligencia artificial para gerar roteiros de
            video. O servico e fornecido &quot;como esta&quot;, sem garantias de que o conteudo
            gerado sera adequado para todos os fins.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Contas de Usuario</h2>
          <p>
            Voce e responsavel por manter a seguranca de sua conta e senha. O RoteiroIA nao se
            responsabiliza por acessos nao autorizados decorrentes da sua falha em proteger suas
            credenciais.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Uso Aceitavel</h2>
          <p>Voce concorda em nao utilizar o servico para:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Gerar conteudo ilegal, difamatorio ou que viole direitos de terceiros</li>
            <li>Tentar sobrecarregar ou interferir na infraestrutura do servico</li>
            <li>Revender ou redistribuir o servico sem autorizacao</li>
            <li>Contornar limitacoes de uso do seu plano</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Propriedade Intelectual</h2>
          <p>
            Os roteiros gerados pela IA sao de sua propriedade. No entanto, o RoteiroIA se reserva o
            direito de usar dados anonimizados e agregados para melhorar o servico. A plataforma, seu
            codigo e a base de conhecimento sao propriedade do RoteiroIA.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Planos e Pagamentos</h2>
          <p>
            O RoteiroIA oferece planos gratuitos e pagos. Os limites de uso variam conforme o plano
            contratado. Reservamo-nos o direito de alterar precos e limites com aviso previo de 30
            dias.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Limitacao de Responsabilidade</h2>
          <p>
            O RoteiroIA nao se responsabiliza por danos diretos, indiretos ou consequenciais
            decorrentes do uso do servico. O conteudo gerado por IA deve ser revisado pelo usuario
            antes da publicacao.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Modificacoes dos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. Alteracoes
            significativas serao comunicadas por email ou notificacao na plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Contato</h2>
          <p>
            Para duvidas sobre estes Termos de Uso, entre em contato pelo email{' '}
            <span className="text-foreground">contato@roteiroia.com</span>.
          </p>
        </section>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          &larr; Voltar para o inicio
        </Link>
      </div>
    </div>
  )
}
