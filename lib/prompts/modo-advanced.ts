import {
  getTemplateInstructions,
  getNichoInstructions,
  getTomInstructions,
  getPublicoInstructions,
  getObjetivoInstructions,
} from './helpers'

interface AdvancedInputs {
  titulo: string
  contexto?: string
  duracao: number
  nicho: string
  publico: string
  tom: string
  objetivo: string
  template: string
}

export function buildAdvancedPrompt(inputs: AdvancedInputs): string {
  const contextoBlock = inputs.contexto?.trim()
    ? `\nCONTEXTO / EXPECTATIVA DO CRIADOR: ${inputs.contexto.trim()}\n`
    : ''

  return `Gere um roteiro COMPLETO com as seguintes especificações:

TÍTULO/TEMA: ${inputs.titulo}${contextoBlock}
DURAÇÃO: ${inputs.duracao} minutos
NICHO: ${inputs.nicho}
PÚBLICO-ALVO: ${inputs.publico}
TOM: ${inputs.tom}
OBJETIVO: ${inputs.objetivo}
FORMATO DE OUTPUT: ${inputs.template}

INSTRUÇÕES DO MODO ADVANCED:
- Aplique o Método Myke COMPLETO (abertura provocativa, contraste emocional, estrutura narrativa com arcos, fechamento com impacto)
- Estrutura detalhada com 5-8 seções bem desenvolvidas
- Cada seção deve ter: objetivo claro, transição suave, e contribuição para o arco narrativo geral
- Inclua: TÍTULO SUGERIDO provocativo, DESCRIÇÃO SEO otimizada, CAPÍTULOS com timestamps
- ${getNichoInstructions(inputs.nicho)}
- ${getTomInstructions(inputs.tom)}
- ${getPublicoInstructions(inputs.publico)}
- ${getObjetivoInstructions(inputs.objetivo)}

FORMATO DE SAÍDA:
${getTemplateInstructions(inputs.template)}

Gere o roteiro agora.`
}
