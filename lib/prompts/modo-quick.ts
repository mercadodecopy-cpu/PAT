import { getTemplateInstructions, getNichoInstructions } from './helpers'

interface QuickInputs {
  titulo: string
  contexto?: string
  duracao: number
  nicho: string
  template: string
}

export function buildQuickPrompt(inputs: QuickInputs): string {
  const contextoBlock = inputs.contexto?.trim()
    ? `\nCONTEXTO / EXPECTATIVA DO CRIADOR: ${inputs.contexto.trim()}\n`
    : ''

  return `Gere um roteiro com as seguintes especificações:

TÍTULO/TEMA: ${inputs.titulo}${contextoBlock}
DURAÇÃO: ${inputs.duracao} minutos
NICHO: ${inputs.nicho}
FORMATO DE OUTPUT: ${inputs.template}

INSTRUÇÕES DO MODO QUICK:
- Estrutura simples (3-5 seções)
- Método Myke PARCIAL (influência leve - use abertura provocativa e contraste emocional, mas sem aplicar todos os elementos)
- Foco em clareza e funcionalidade
- O roteiro deve ser utilizável IMEDIATAMENTE
- ${getNichoInstructions(inputs.nicho)}

FORMATO DE SAÍDA:
${getTemplateInstructions(inputs.template)}

Gere o roteiro agora.`
}
