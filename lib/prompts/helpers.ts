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
    // Populares
    'tecnologia-reviews':
      'Foque em análise honesta e detalhada. Mostre prós e contras reais, comparações práticas, e ajude o espectador a tomar uma decisão informada. Evite hype vazio.',
    'financas-investimentos':
      'Use dados concretos e exemplos reais. Contextualize riscos, não prometa resultados. Eduque sobre conceitos antes de recomendar estratégias. Disclaimer financeiro quando relevante.',
    'saude-bem-estar':
      'Baseie em evidências científicas. Não faça promessas milagrosas. Contextualize que cada corpo é diferente. Incentive buscar profissionais quando necessário.',
    'culinaria-gastronomia':
      'Narrativa sensorial e descritiva. Conte a história por trás do prato/ingrediente. Conecte comida com cultura, memória e identidade. Seja prático nas instruções.',
    'viagem-turismo':
      'Misture informação prática com narrativa imersiva. Mostre o lugar através dos sentidos. Inclua dicas reais, custos, e aspectos culturais. Evite parecer propaganda.',
    'games-esports':
      'Linguagem da comunidade gamer. Análise técnica quando relevante. Contextualize para não-gamers se necessário. Mostre o impacto cultural dos jogos.',
    'musica-analise':
      'Conecte técnica musical com emoção. Contextualize historicamente. Explique conceitos musicais de forma acessível. Mostre como a música reflete seu tempo.',
    'cinema-series':
      'Análise que vai além do resumo. Explore temas, simbolismo, direção, atuação. Conecte com contexto cultural. Evite spoilers desnecessários ou sinalize-os.',
    'empreendedorismo':
      'Histórias reais com custos e fracassos. Não romantize o processo. Dados concretos sobre mercado. Conselhos práticos, não motivacionais vazios.',
    'marketing-digital':
      'Estratégias acionáveis com exemplos reais. Mostre métricas e resultados concretos. Contextualize tendências. Seja honesto sobre o que funciona e o que não.',
    'psicologia-comportamento':
      'Base em pesquisa científica. Explique vieses e padrões comportamentais. Use exemplos do cotidiano. Não simplifique condições complexas.',
    'filosofia-reflexao':
      'Provocação intelectual sem pretensão. Conecte ideias abstratas com o cotidiano. Apresente múltiplas perspectivas. Deixe o espectador pensar, não dê respostas prontas.',
    'historia-geral':
      'Narrativa envolvente com precisão histórica. Humanize personagens históricos. Conecte passado com presente. Mostre múltiplas perspectivas sobre eventos.',
    'politica-geopolitica':
      'Análise equilibrada mostrando múltiplos lados. Contextualize historicamente. Use dados e fontes. Evite partidarismo. Explique complexidade sem simplificar.',
    'educacao-geral':
      'Clareza acima de tudo. Use analogias acessíveis. Estruture do simples ao complexo. Engaje com perguntas e exemplos práticos.',
    'humor-entretenimento':
      'Timing é tudo. Misture humor com insight genuíno. Subverta expectativas. Não force piadas. O humor deve servir a narrativa.',
    'moda-beleza':
      'Conecte estética com identidade e autoexpressão. Contextualize tendências historicamente. Seja inclusivo. Foque em estilo pessoal, não em regras rígidas.',
    'esportes-geral':
      'Narrativa que vai além das estatísticas. Humanize atletas. Contextualize momentos históricos. Mostre a emoção e o drama real do esporte.',
    'meio-ambiente-sustentabilidade':
      'Dados científicos concretos. Mostre impacto real sem catastrofismo paralisante. Apresente soluções práticas. Conecte global com local.',
    'religiao-espiritualidade':
      'Respeito e abertura. Contextualize historicamente. Não proselitize. Explore dimensões filosóficas e culturais. Mostre diversidade de perspectivas.',
    // Nichados
    'true-crime-misterios':
      'Construção de tensão gradual. Respeite vítimas SEMPRE. Fatos antes de especulações. Contextualize socialmente. Não glorifique criminosos.',
    'conspiracao-teorias':
      'Abordagem analítica e cética. Apresente evidências e contra-evidências. Não endosse teorias sem base. Explore o porquê as pessoas acreditam.',
    'espaco-astronomia':
      'Senso de escala e maravilhamento. Dados científicos precisos. Analogias para tornar números cósmicos compreensíveis. Conecte ciência com filosofia existencial.',
    'arqueologia-civilizacoes':
      'Narrativa de descoberta e mistério. Conecte civilizações antigas com o presente. Respeite culturas. Mostre o processo arqueológico.',
    'artes-marciais':
      'Filosofia além da técnica. Contextualize historicamente. Mostre disciplina e jornada. Respeite tradições de diferentes estilos.',
    'automobilismo-mecanica':
      'Paixão técnica acessível. Explique engenharia de forma visual. Conte histórias de corridas e inovações. Conecte com cultura e identidade.',
    'diy-projetos-manuais':
      'Instruções claras e sequenciais. Mostre erros e como corrigi-los. Celebre o processo manual. Inspire criatividade com materiais acessíveis.',
    'paranormal-sobrenatural':
      'Construa atmosfera. Apresente relatos sem julgamento mas com ceticismo saudável. Explore explicações científicas e culturais. Mantenha mistério.',
    'mitologia-lendas':
      'Narrativa épica e envolvente. Conecte mitos com verdades universais. Contextualize culturalmente. Mostre como mitos refletem a psique humana.',
    'matematica-logica':
      'Torne abstrato em visual. Use problemas do cotidiano. Celebre a elegância das soluções. Mostre a beleza e utilidade da matemática.',
    'outro':
      'Aplique princípios universais: clareza, especificidade, contraste emocional, estrutura a serviço do conteúdo. Adapte o tom ao tema proposto.',
  }

  return mappings[nicho] || 'Aplique princípios universais: clareza, especificidade, contraste emocional, e estrutura a serviço do conteúdo.'
}

export function calculateCost(tokensInput: number, tokensOutput: number): number {
  // Claude Sonnet 4 pricing
  const inputCostPer1M = 3.0
  const outputCostPer1M = 15.0

  const inputCost = (tokensInput / 1_000_000) * inputCostPer1M
  const outputCost = (tokensOutput / 1_000_000) * outputCostPer1M

  return Number((inputCost + outputCost).toFixed(6))
}
