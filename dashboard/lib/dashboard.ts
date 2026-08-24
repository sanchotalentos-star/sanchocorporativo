// lib/dashboard.ts
// Funções de agregação e transformação de dados para o dashboard

import type { Deal, DealStage } from "./rdcrm";

// ─── Helpers: identifica negócios por etapa OU pelo boolean do RD CRM ─────────

export function isWon(d: Deal): boolean {
  return d.win === true || d.deal_stage?.name === "Realizado";
}

export function isLost(d: Deal): boolean {
  return d.hold === true || d.deal_stage?.name === "Perdido";
}

export function isActive(d: Deal): boolean {
  return !isWon(d) && !isLost(d);
}

// ─── Tipos de saída ───────────────────────────────────────────────────────────

export interface KpiData {
  abertos:    number;
  ganhos:     number;
  perdidos:   number;
  conversao:  number; // 0–1
  valorGanho: number; // R$ total dos negócios ganhos
}

export interface StageCount {
  name:     string;
  count:    number;
  pct:      number;
  value:    number;  // R$ total na etapa
  isWon?:   boolean; // etapa final positiva (Realizado)
  isLost?:  boolean; // etapa final negativa (Perdido)
}

export interface WeeklyPoint {
  label:   string; // ex: "06/06"
  abertos: number;
  ganhos:  number;
}

export interface DealRow {
  id:          string;
  name:        string;
  contact:     string;
  responsible: string;  // agente responsável (user.name no RD CRM)
  stage:       string;
  value:       number;
  createdAt:   string | null;
  daysOpen:    number;
  isStale:     boolean; // > 15 dias sem movimento (só deals ativos)
  isWon:       boolean;
  isLost:      boolean;
}

export interface RevenueByArea {
  palestras:     number;
  apresentacoes: number;
  publicidades:  number;
}

export interface EventsByArea {
  palestras:     number;
  apresentacoes: number;
  publicidades:  number;
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export function groupByStatus(deals: Deal[]): KpiData {
  const ganhos  = deals.filter(isWon);
  const perdidos = deals.filter(isLost).length;
  const abertos  = deals.filter(isActive).length;
  const total    = ganhos.length + abertos;

  const valorGanho = ganhos.reduce((sum, d) =>
    sum + (d.amount ?? 0) + (d.amount_unique ?? 0) + (d.amount_montly ?? 0) + (d.amount_recurrent ?? 0), 0);

  return {
    abertos,
    ganhos:    ganhos.length,
    perdidos,
    conversao: total > 0 ? ganhos.length / total : 0,
    valorGanho,
  };
}

// ─── Pipeline por etapa — inclui TODAS as etapas, Realizado e Perdido ─────────

// Ordem preferida das etapas neste CRM
const STAGE_ORDER = [
  "Arquitetura de Relacionamento",
  "Prospecção Ativa",
  "Prospecção",
  "Prospect (5 dias)",
  "Prospect",
  "Negociação",
  "Pós Venda",
  "Combo de Evento",
  "Realizado",
  "Perdido",
];

export function groupByStage(
  deals: Deal[],
  stages: DealStage[],
): StageCount[] {
  const counts: Record<string, number> = {};
  const values: Record<string, number> = {};

  for (const deal of deals) {
    const stageName = deal.deal_stage?.name ?? "Sem etapa";
    counts[stageName] = (counts[stageName] ?? 0) + 1;
    values[stageName] = (values[stageName] ?? 0)
      + (deal.amount ?? 0)
      + (deal.amount_unique ?? 0)
      + (deal.amount_montly ?? 0)
      + (deal.amount_recurrent ?? 0);
  }

  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  // Ordem: usa a sequência retornada pelo endpoint /deals_stages se disponível
  let ordered: string[];
  if (stages.length > 0) {
    ordered = stages.map((s) => s.name).filter((n) => counts[n] !== undefined);
    // Adiciona etapas presentes nos deals mas ausentes no endpoint
    for (const name of Object.keys(counts)) {
      if (!ordered.includes(name)) ordered.push(name);
    }
  } else {
    ordered = STAGE_ORDER.filter((n) => counts[n] !== undefined);
    for (const name of Object.keys(counts)) {
      if (!ordered.includes(name)) ordered.push(name);
    }
  }

  return ordered.map((name) => ({
    name,
    count: counts[name] ?? 0,
    value: values[name] ?? 0,
    pct:   total > 0 ? (counts[name] ?? 0) / total : 0,
    isWon:  name === "Realizado",
    isLost: name === "Perdido",
  }));
}

// ─── Evolução semanal (últimos 30 dias) ──────────────────────────────────────

export function groupByWeek(deals: Deal[]): WeeklyPoint[] {
  const now    = new Date();
  const points: WeeklyPoint[] = [];

  for (let i = 29; i >= 0; i -= 7) {
    const end   = new Date(now);
    end.setDate(now.getDate() - i);

    const start = new Date(end);
    start.setDate(end.getDate() - 6);

    const label = `${start.getDate().toString().padStart(2,"0")}/${
      (start.getMonth() + 1).toString().padStart(2,"0")
    }`;

    let abertos = 0;
    let ganhos  = 0;

    for (const deal of deals) {
      const created = deal.created_at ? new Date(deal.created_at) : null;
      if (!created) continue;

      if (created >= start && created <= end) {
        if (isWon(deal)) ganhos++;
        else if (isActive(deal)) abertos++;
      }
    }

    points.push({ label, abertos, ganhos });
  }

  return points;
}

// ─── Tabela de negociações — TODAS as etapas ─────────────────────────────────

export function buildDealRows(deals: Deal[]): DealRow[] {
  return deals.map((d) => {
    const won  = isWon(d);
    const lost = isLost(d);

    const value =
      (d.amount ?? 0) +
      (d.amount_unique ?? 0) +
      (d.amount_montly ?? 0) +
      (d.amount_recurrent ?? 0);

    const createdAt = d.created_at ?? null;
    const lastAct   = d.last_activity_at ?? createdAt;

    let daysOpen = 0;
    if (lastAct) {
      const diffMs = Date.now() - new Date(lastAct).getTime();
      daysOpen = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    const contact =
      d.contacts?.[0]?.name ??
      d.organization?.name ??
      "—";

    return {
      id:          d._id,
      name:        d.name,
      contact,
      responsible: d.user?.name ?? "—",
      stage:       d.deal_stage?.name ?? "Sem etapa",
      value,
      createdAt,
      daysOpen:    won || lost ? 0 : daysOpen,
      isStale:     !won && !lost && daysOpen > 15,
      isWon:       won,
      isLost:      lost,
    };
  });
}

// ─── Faturamento realizado por área ─────────────────────────────────────────

/**
 * Extrai receita por área a partir do nome do negócio.
 * Convenção de nomenclatura: "[Palestra] Nome do cliente"
 * Inclui todos os negócios na etapa "Realizado" (ou win=true).
 */
export function calcRevenueByArea(deals: Deal[]): RevenueByArea {
  const won = deals.filter(isWon);

  let palestras     = 0;
  let apresentacoes = 0;
  let publicidades  = 0;

  for (const d of won) {
    const name  = d.name.toLowerCase();
    const value =
      (d.amount ?? 0) +
      (d.amount_unique ?? 0) +
      (d.amount_montly ?? 0) +
      (d.amount_recurrent ?? 0);

    if (name.includes("palestra") || name.includes("palestrante")) {
      palestras += value;
    } else if (
      name.includes("apresenta") ||
      name.includes("apresentador") ||
      name.includes("mc ")
    ) {
      apresentacoes += value;
    } else if (
      name.includes("public") ||
      name.includes("conteúdo") ||
      name.includes("influenc") ||
      name.includes("creator")
    ) {
      publicidades += value;
    } else {
      // distribui igualmente quando não identificado
      palestras     += value / 3;
      apresentacoes += value / 3;
      publicidades  += value / 3;
    }
  }

  return { palestras, apresentacoes, publicidades };
}

// ─── Contagem de eventos fechados por área ───────────────────────────────────

export function calcEventsByArea(deals: Deal[]): EventsByArea {
  const won = deals.filter(isWon);
  let palestras = 0, apresentacoes = 0, publicidades = 0;

  for (const d of won) {
    const name = d.name.toLowerCase();
    if (name.includes("palestra")) palestras++;
    else if (name.includes("apresenta") || name.includes("mc ")) apresentacoes++;
    else if (name.includes("public") || name.includes("creator")) publicidades++;
    else palestras++; // fallback
  }

  return { palestras, apresentacoes, publicidades };
}
