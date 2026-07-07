export const IDENTIDADE_KEY = 'identidade_marca_v1'

export interface IdentidadeStored {
  pilares: {
    publicoAlvo:    { reflexao: string; analise: string; analiseLocked: boolean; status: string }
    proposta:       { reflexao: string; analise: string; analiseLocked: boolean; status: string }
    storytelling:   { reflexao: string; analise: string; analiseLocked: boolean; status: string }
    formatoProduto: { reflexao: string; analise: string; analiseLocked: boolean; status: string }
  }
  diferenciais: string[]
}

export function getIdentidade(): IdentidadeStored | null {
  try {
    const raw = localStorage.getItem(IDENTIDADE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const PILAR_LABELS: Record<string, string> = {
  publicoAlvo:    'Para Quem Você Fala',
  proposta:       'O Que Você Entrega de Diferente',
  storytelling:   'Sua História que Conecta',
  formatoProduto: 'Como Você Chega ao Mercado',
}
