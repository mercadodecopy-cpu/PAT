'use client'

import { Loader2 } from 'lucide-react'

interface GeneratingStateProps {
  streamedText: string
}

export function GeneratingState({ streamedText }: GeneratingStateProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="text-lg font-medium">Gerando seu roteiro...</p>
      </div>

      <p className="text-sm text-muted-foreground">
        A IA esta aplicando os 200+ principios destilados ao seu roteiro. Isso pode levar alguns
        minutos.
      </p>

      {streamedText && (
        <div className="rounded-lg border bg-muted/50 p-6 max-h-[500px] overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground mb-3">Preview em tempo real:</p>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {streamedText}
          </pre>
        </div>
      )}
    </div>
  )
}
