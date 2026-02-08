import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx'
import { saveAs } from 'file-saver'
import type { Roteiro } from '@/types/database.types'

export async function exportToDocx(roteiro: Roteiro) {
  const createdAt = new Date(roteiro.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const meta = [
    `Modo: ${roteiro.modo.toUpperCase()}`,
    roteiro.nicho ? `Nicho: ${roteiro.nicho}` : null,
    roteiro.duracao_minutos ? `Duracao: ${roteiro.duracao_minutos} min` : null,
    `Template: ${roteiro.template}`,
  ]
    .filter(Boolean)
    .join('  |  ')

  // Build content paragraphs from roteiro text
  const contentParagraphs = (roteiro.conteudo || '')
    .split('\n')
    .map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 22, // 11pt
              font: 'Calibri',
            }),
          ],
          spacing: { after: 120 },
        })
    )

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch
          },
        },
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: roteiro.titulo_sugerido || roteiro.titulo,
                bold: true,
                size: 36, // 18pt
                font: 'Calibri',
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),

          // Metadata
          new Paragraph({
            children: [
              new TextRun({
                text: meta,
                size: 20, // 10pt
                color: '888888',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 80 },
          }),

          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: `Criado em ${createdAt}`,
                size: 20,
                color: '888888',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 200 },
          }),

          // Description
          ...(roteiro.descricao
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: roteiro.descricao,
                      italics: true,
                      size: 22,
                      color: '555555',
                      font: 'Calibri',
                    }),
                  ],
                  spacing: { after: 200 },
                }),
              ]
            : []),

          // Separator
          new Paragraph({
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            },
            spacing: { after: 300 },
          }),

          // Content
          ...contentParagraphs,

          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: 'Gerado por RoteiroIA — roteiroia.com',
                size: 16, // 8pt
                color: 'AAAAAA',
                font: 'Calibri',
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { before: 600 },
          }),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const filename = `roteiro-${roteiro.titulo.replace(/\s+/g, '-').toLowerCase()}.docx`
  saveAs(blob, filename)
}
