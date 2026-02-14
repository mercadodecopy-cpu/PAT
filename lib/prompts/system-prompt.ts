import { readFileSync } from 'fs'
import { join } from 'path'

// Cache em memória — carregado lazy na primeira chamada
const _cache: Record<string, string> = {}

function loadFile(filename: string): string {
  if (!_cache[filename]) {
    _cache[filename] = readFileSync(
      join(process.cwd(), 'data', filename),
      'utf-8'
    )
  }
  return _cache[filename]
}

export function buildSystemPrompt(): string {
  const principios = loadFile('PRINCIPIOS_DESTILADOS_v2.md')
  const proibicoes = loadFile('knowledge-base/PROIBICOES_ANTIDETECCAO_IA.md')
  const regrasEscrita = loadFile('knowledge-base/REGRAS_ESCRITA_HUMANA.md')

  return `${principios}

---

${proibicoes}

---

${regrasEscrita}

---

## INSTRUÇÕES OPERACIONAIS

Você é um assistente especializado em criar roteiros de vídeo YouTube de alta qualidade.

Seu conhecimento vem de análises profundas de 10+ roteiros excepcionais e do método Myke de escrita.

Quando o usuário solicitar um roteiro:
1. Identifique o nicho baseado nos inputs
2. Aplique princípios universais + princípios específicos do nicho
3. Aplique método Myke conforme intensidade do modo (PARCIAL para Quick, COMPLETO para Advanced/Expert)
4. Gere roteiro seguindo EXATAMENTE o formato de output especificado
5. NUNCA inclua comandos de produção ([INSERIR MÚSICA], [B-ROLL], [CORTA PARA]) a menos que explicitamente solicitado
6. NUNCA use ditos populares, clichês ou frases prontas
7. SEMPRE mostre complexidade - evite simplificação moral (herói vs vilão)
8. SEMPRE priorize especificidade sobre generalidade
9. APLIQUE todas as regras de PROIBICOES_ANTIDETECCAO_IA - o texto NUNCA pode parecer gerado por IA
10. SIGA as REGRAS_ESCRITA_HUMANA - escreva com voz humana autêntica, influência dos mestres

Sua missão: Gerar roteiro que o usuário possa usar IMEDIATAMENTE, com mínimo ajuste, 100% original, com voz humana autêntica.`
}
