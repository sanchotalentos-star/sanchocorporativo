// lib/formatters.ts
// Funções de formatação para o Dashboard Sancho

// ── Moeda ────────────────────────────────────────────────────────────────────

/**
 * Formata um número como moeda BRL.
 * @example formatBRL(120000) → "R$ 120.000,00"
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formata um número como moeda BRL compacta (k / M).
 * @example formatBRLCompact(120000) → "R$ 120k"
 */
export function formatBRLCompact(value: number): string {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1).replace(".", ",")}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(0)}k`;
  }
  return formatBRL(value);
}

// ── Data ─────────────────────────────────────────────────────────────────────

/**
 * Formata uma data ISO para DD/MM/AAAA.
 * @example formatDate("2026-06-19T10:00:00Z") → "19/06/2026"
 */
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR", {
    day:   "2-digit",
    month: "2-digit",
    year:  "numeric",
  });
}

/**
 * Formata data e hora: "19/06/2026 às 10:57"
 */
export function formatDateTime(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("pt-BR");
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${date} às ${time}`;
}

// ── Dias em aberto ───────────────────────────────────────────────────────────

/**
 * Calcula quantos dias se passaram desde uma data ISO até hoje.
 */
export function calcDaysOpen(isoDate: string | null | undefined): number {
  if (!isoDate) return 0;
  const created = new Date(isoDate);
  if (isNaN(created.getTime())) return 0;
  const diffMs = Date.now() - created.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// ── Percentual ───────────────────────────────────────────────────────────────

/**
 * Formata número como percentual: 0.754 → "75.4%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// ── Timestamp legível ─────────────────────────────────────────────────────────

/**
 * Retorna string "Atualizado às HH:MM de DD/MM/AAAA"
 */
export function formatUpdateTimestamp(date: Date = new Date()): string {
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const day  = date.toLocaleDateString("pt-BR");
  return `Atualizado às ${time} de ${day}`;
}
