import {
  getTemplateInstructions,
  getNichoInstructions,
  getTomInstructions,
  getPublicoInstructions,
  getObjetivoInstructions,
} from './helpers'

interface ExpertInputs {
  titulo: string
  duracao: number
  nicho: string
  publico: string
  tom: string
  objetivo: string
  template: string
  autores_referencia?: string
  nivel_vocabulario?: string
  instrucoes_custom?: string
  referencias_texto?: string
}

export function buildExpertPrompt(inputs: ExpertInputs): string {
  const sections: string[] = []

  sections.push(`Gere um roteiro EXPERT com controle total sobre cada elemento:

ESPECIFICAÇÕES BÁSICAS:
- Título/Tema: ${inputs.titulo}
- Duração: ${inputs.duracao} minutos
- Nicho: ${inputs.nicho}
- Público-alvo: ${inputs.publico}
- Tom: ${inputs.tom}
- Objetivo: ${inputs.objetivo}
- Formato: ${inputs.template}`)

  sections.push(`INSTRUÇÕES DO MODO EXPERT:
- Aplique o Método Myke em sua forma MAIS COMPLETA e SOFISTICADA
- Estrutura com 6-10 seções profundamente desenvolvidas
- Cada seção com: objetivo narrativo, ponto emocional, transição estratégica
- Gere 3 OPÇÕES DE TÍTULO (com justificativa para cada)
- Gere DESCRIÇÃO SEO otimizada
- Gere CAPÍTULOS detalhados com timestamps
- ${getNichoInstructions(inputs.nicho)}
- ${getTomInstructions(inputs.tom)}
- ${getPublicoInstructions(inputs.publico)}
- ${getObjetivoInstructions(inputs.objetivo)}`)

  // Vocabulary level
  if (inputs.nivel_vocabulario && inputs.nivel_vocabulario !== 'intermediario') {
    const nivelMap: Record<string, string> = {
      simples: 'Use vocabulário SIMPLES e acessível. Frases curtas. Evite termos técnicos ou explique-os imediatamente.',
      avancado: 'Use vocabulário AVANÇADO e técnico. Termos especializados permitidos. Profundidade linguística elevada.',
    }
    sections.push(`NÍVEL DE VOCABULÁRIO:\n${nivelMap[inputs.nivel_vocabulario] || ''}`)
  }

  // Reference authors
  if (inputs.autores_referencia && inputs.autores_referencia.trim()) {
    sections.push(`AUTORES DE REFERÊNCIA: ${inputs.autores_referencia.trim()}
Escreva no ESTILO desses autores (modo de pensar e estruturar argumentos, NÃO citações diretas). Absorva a essência da forma como eles comunicam.`)
  }

  // Custom instructions
  if (inputs.instrucoes_custom && inputs.instrucoes_custom.trim()) {
    sections.push(`INSTRUÇÕES CUSTOMIZADAS DO USUÁRIO:
${inputs.instrucoes_custom.trim()}`)
  }

  // Reference materials
  if (inputs.referencias_texto && inputs.referencias_texto.trim()) {
    sections.push(`MATERIAIS DE REFERÊNCIA FORNECIDOS:
${inputs.referencias_texto.trim()}

Use esses materiais como inspiração estrutural e de conteúdo. NÃO copie — absorva e transforme.`)
  }

  sections.push(`FORMATO DE SAÍDA:
${getTemplateInstructions(inputs.template)}

Gere o roteiro agora.`)

  return sections.join('\n\n')
}
