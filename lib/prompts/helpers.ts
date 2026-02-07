export function getTemplateInstructions(template: string): string {
  const instructions: Record<string, string> = {
    padrao:
      'Use formato TEXTO CORRIDO dividido em partes/seções com parágrafos. Inclua TÍTULO SUGERIDO, DESCRIÇÃO e CAPÍTULOS com timestamps no início, seguido do ROTEIRO completo.',
    screenplay:
      'Use formato SCREENPLAY audiovisual. FADE IN, indicações de cena (INT./EXT.), Narrador (V.O.) para texto falado. Inclua indicações visuais quando relevante.',
    bullets:
      'Use formato BULLET POINTS ESTRUTURADO. Cada seção tem: título, objetivo, pontos-chave em bullets, e texto sugerido.',
    timestamps:
      'Use formato TIMESTAMPS para teleprompter. Cada bloco com [MM:SS-MM:SS] NOME DA SEÇÃO seguido do texto a ser lido.',
    markdown:
      'Use formato MARKDOWN COMPLETO com headers (#, ##, ###), listas, negrito para ênfase. Inclua seções: Título, Descrição, Capítulos, Roteiro.',
    minimalista:
      'Use formato MINIMALISTA. Apenas o título e o texto puro do roteiro, zero formatação adicional, zero headers, zero timestamps.',
  }

  return instructions[template] || instructions.padrao
}

export function getNichoInstructions(nicho: string): string {
  const mappings: Record<string, string> = {
    'atletas-biografias':
      'Aplique princípios de "Atletas / Biografias de Superação": desconstrução do mito como gancho, origem traumática fundacional, revelação das sombras, legado ambíguo.',
    'crime-documentario':
      'Aplique princípios de "Crime Organizado / Documentário Criminal": abertura direta sem rodeios, disclaimer ético OBRIGATÓRIO, contextualização socioeconômica, linguagem factual, respeitar vítimas.',
    'educacao-cientifica':
      'Aplique princípios de "Educação Científica / Acidentes Industriais": abertura atmosférica, educar ANTES da tragédia, contextualizar falhas sistêmicas, especificidade técnica sem sensacionalismo.',
    'transformacao-pessoal':
      'Aplique princípios de "Transformação Pessoal": vulnerabilidade como gancho, jornada real com custos e dúvidas, não romantizar o processo, mostrar o antes/durante/depois.',
    'ciencia-experimental-raw':
      'Aplique princípios de "Ciência Experimental (Raw)": trial-and-error transparente, narração casual do processo, falhas são conteúdo, não é sobre o resultado mas sobre o caminho.',
    'ciencia-experimental-narrativo':
      'Aplique princípios de "Ciência Experimental (Narrativo)": narrativa envolvente sobre ciência, misturar entretenimento com educação, analogias visuais poderosas.',
    'animacao-mensagem-social':
      'Aplique princípios de "Animação com Mensagem Social": metáfora visual central, mensagem emerge da narrativa, não ser didático demais, deixar audiência conectar os pontos.',
    'ensaio-cinematografico':
      'Aplique princípios de "Ensaio Cinematográfico": estética acima de tudo, pausas e silêncio têm significado, cadência poética, provocação intelectual.',
    'educacao-visual-abstrata':
      'Aplique princípios de "Educação Visual Abstrata": conceitos abstratos tornados visuais, analogias físicas para ideias mentais, simplicidade na explicação de complexidade.',
    'historia-militar':
      'Aplique princípios de "História Militar": contextualização geopolítica, mapas e movimentos estratégicos, humanizar soldados individuais, escala vs detalhe pessoal.',
  }

  return mappings[nicho] || 'Aplique princípios universais.'
}

export function calculateCost(tokensInput: number, tokensOutput: number): number {
  // Claude Sonnet 4 pricing
  const inputCostPer1M = 3.0
  const outputCostPer1M = 15.0

  const inputCost = (tokensInput / 1_000_000) * inputCostPer1M
  const outputCost = (tokensOutput / 1_000_000) * outputCostPer1M

  return Number((inputCost + outputCost).toFixed(6))
}
