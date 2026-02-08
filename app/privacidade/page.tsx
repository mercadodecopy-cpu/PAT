import Link from 'next/link'

export default function PrivacidadePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Politica de Privacidade</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Ultima atualizacao: {new Date().toLocaleDateString('pt-BR')}
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Informacoes que Coletamos</h2>
          <p>Coletamos as seguintes informacoes quando voce utiliza o RoteiroIA:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong>Dados de conta:</strong> email e nome fornecidos no cadastro
            </li>
            <li>
              <strong>Dados de uso:</strong> roteiros gerados, modo utilizado, tokens consumidos e
              timestamps
            </li>
            <li>
              <strong>Dados tecnicos:</strong> informacoes basicas de navegador para funcionamento do
              servico
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Como Usamos seus Dados</h2>
          <p>Utilizamos suas informacoes para:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Fornecer e manter o servico de geracao de roteiros</li>
            <li>Gerenciar sua conta e limites de uso</li>
            <li>Melhorar a qualidade do servico com dados anonimizados</li>
            <li>Enviar comunicacoes importantes sobre o servico</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Armazenamento de Dados</h2>
          <p>
            Seus dados sao armazenados de forma segura utilizando Supabase (PostgreSQL) com
            criptografia em transito e em repouso. Seus roteiros sao protegidos por Row Level
            Security (RLS) — apenas voce tem acesso aos seus roteiros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Compartilhamento de Dados</h2>
          <p>
            Nao vendemos, alugamos ou compartilhamos suas informacoes pessoais com terceiros, exceto:
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Quando necessario para fornecer o servico (ex: processamento de IA via Anthropic)</li>
            <li>Quando exigido por lei ou ordem judicial</li>
            <li>Com seu consentimento explicito</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Processamento por IA</h2>
          <p>
            Os roteiros sao gerados utilizando a API da Anthropic (Claude). Os dados enviados para
            geracao incluem apenas as informacoes do formulario (titulo, nicho, etc.) e nao incluem
            dados pessoais como email ou nome. A Anthropic nao utiliza dados enviados via API para
            treinar seus modelos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Seus Direitos</h2>
          <p>Voce tem direito a:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Acessar seus dados pessoais armazenados</li>
            <li>Solicitar a correcao de dados incorretos</li>
            <li>Solicitar a exclusao de sua conta e dados</li>
            <li>Exportar seus roteiros a qualquer momento</li>
            <li>Revogar consentimento para comunicacoes opcionais</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Cookies</h2>
          <p>
            Utilizamos apenas cookies essenciais para autenticacao e funcionamento do servico. Nao
            utilizamos cookies de rastreamento ou publicidade.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Alteracoes nesta Politica</h2>
          <p>
            Podemos atualizar esta politica periodicamente. Alteracoes significativas serao
            comunicadas por email ou notificacao na plataforma com pelo menos 15 dias de
            antecedencia.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Contato</h2>
          <p>
            Para questoes sobre privacidade, entre em contato pelo email{' '}
            <span className="text-foreground">privacidade@roteiroia.com</span>.
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
