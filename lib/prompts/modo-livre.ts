/**
 * Prompt builder para o Modo Livre (Chat Guiado).
 *
 * Recebe o historico da conversa e retorna o prompt para a IA.
 * A IA guia o usuario com perguntas e no final gera o roteiro.
 */

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * System prompt para o chat guiado.
 * Instrui a IA a coletar informacoes antes de gerar.
 */
export function buildLivreChatSystemPrompt(): string {
  return `Voce e um assistente especializado em criar roteiros de video para YouTube.

Seu trabalho e guiar o usuario com perguntas curtas e objetivas para coletar as informacoes necessarias antes de gerar o roteiro. Seja amigavel e direto.

## Fluxo de perguntas (siga esta ordem):

1. **Tema/Titulo**: Pergunte sobre o que sera o video
2. **Duracao**: Pergunte a duracao estimada em minutos
3. **Tom**: Pergunte o tom desejado (serio, conversacional, provocativo, epico, etc)
4. **Instrucoes extras**: Pergunte se ha algo especifico que o usuario quer incluir (opcional - aceite "nao" ou "pular")

## Regras:
- Faca UMA pergunta por vez, nunca varias de uma vez
- Respostas curtas (1-3 frases)
- Quando tiver todas as informacoes, responda EXATAMENTE com o marcador:
  [PRONTO_PARA_GERAR]
  Seguido de um resumo JSON com os dados coletados no formato:
  {"titulo": "...", "duracao": N, "tom": "...", "instrucoes": "..."}
- NAO gere o roteiro voce mesmo — apenas colete os dados
- Se o usuario quiser pular uma pergunta, use valores padrao razoaveis
- Responda sempre em portugues brasileiro`
}

/**
 * Converte as informacoes coletadas pelo chat em um prompt para geracao.
 */
export function buildLivreGeneratePrompt(dados: {
  titulo: string
  duracao: number
  tom: string
  instrucoes: string
}): string {
  return `Gere um roteiro de video YouTube com as seguintes especificacoes:

TITULO: ${dados.titulo}
DURACAO: ${dados.duracao} minutos
TOM: ${dados.tom}
${dados.instrucoes ? `INSTRUCOES ESPECIAIS: ${dados.instrucoes}` : ''}

Formato: texto corrido com secoes claras. Use o Metodo Myke e os 200+ principios destilados.
Comece com um hook poderoso. Crie arcos de tensao. Termine com um fechamento memoravel.`
}
