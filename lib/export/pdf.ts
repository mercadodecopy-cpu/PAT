import { jsPDF } from 'jspdf'
import type { Roteiro } from '@/types/database.types'

export function exportToPdf(roteiro: Roteiro) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pageWidth - margin * 2
  let y = margin

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  const titleLines = doc.splitTextToSize(roteiro.titulo_sugerido || roteiro.titulo, maxWidth)
  doc.text(titleLines, margin, y)
  y += titleLines.length * 8 + 4

  // Metadata line
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
  const meta = [
    `Modo: ${roteiro.modo.toUpperCase()}`,
    roteiro.nicho ? `Nicho: ${roteiro.nicho}` : null,
    roteiro.duracao_minutos ? `${roteiro.duracao_minutos} min` : null,
    `Template: ${roteiro.template}`,
  ]
    .filter(Boolean)
    .join('  |  ')
  doc.text(meta, margin, y)
  y += 6

  const createdAt = new Date(roteiro.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  doc.text(`Criado em ${createdAt}`, margin, y)
  y += 8

  // Description
  if (roteiro.descricao) {
    doc.setTextColor(80, 80, 80)
    doc.setFont('helvetica', 'italic')
    const descLines = doc.splitTextToSize(roteiro.descricao, maxWidth)
    doc.text(descLines, margin, y)
    y += descLines.length * 5 + 4
  }

  // Separator
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Content
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const content = roteiro.conteudo || ''
  const contentLines = doc.splitTextToSize(content, maxWidth)
  const lineHeight = 5

  for (const line of contentLines) {
    if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(line, margin, y)
    y += lineHeight
  }

  // Footer on last page
  y += 8
  if (y > doc.internal.pageSize.getHeight() - margin - 10) {
    doc.addPage()
    y = margin
  }
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Gerado por RoteiroIA — roteiroia.com', margin, doc.internal.pageSize.getHeight() - 10)

  // Download
  const filename = `roteiro-${roteiro.titulo.replace(/\s+/g, '-').toLowerCase()}.pdf`
  doc.save(filename)
}
