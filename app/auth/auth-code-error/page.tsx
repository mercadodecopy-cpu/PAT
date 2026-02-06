import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Erro na autenticacao</h1>
        <p className="text-muted-foreground">
          Nao foi possivel completar o login. Tente novamente.
        </p>
        <Link
          href="/login"
          className="inline-block underline text-primary"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}
