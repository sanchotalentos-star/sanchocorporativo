import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export function getPercent(atual: number, meta: number): number {
  if (meta === 0) return 0
  return Math.min(Math.round((atual / meta) * 100), 100)
}

export function getStatusColor(percent: number): 'green' | 'yellow' | 'red' {
  if (percent >= 80) return 'green'
  if (percent >= 50) return 'yellow'
  return 'red'
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
