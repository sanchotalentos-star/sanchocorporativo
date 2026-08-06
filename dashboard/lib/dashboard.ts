// lib/dashboard.ts
// Funções de agregação e transformação de dados para o dashboard

import type { Deal, DealStage } from "./rdcrm";

// ─── Tipos de saída ───────────────────────────────────────────────────────────

export interface KpiData {
  abertos:    number;
  ganhos:     number;
  perdidos:   number;
  conversao:  number; // 0–1
}

export interface StageCount {
  name:  string;
  count: number;
  pct:   number;
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
  stage:       string;
  value:       number;
  createdAt:   string | null;
  daysOpen:    number;
  isStale:     boolean; // > 15 dias sem movimento
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export function groupByStatus(deals: Deal[]): KpiData {
  const ganhos  = deals.filter((d) => d.win === true).length;
  const perdidos = deals.filter((d) => d.hold === true).length;
  const abertos  = deals.filter((d) => !d.win && !d.hold).length;
  const total    = ganhos + abertos;

  return {
    abertos,
    ganhos,
    perdidos,
    conversao: total > 0 ? ganhos / total : 0,
  };
}

// ─── Pipeline por etapa ───────────────────────────────────────────────────────

export function groupByStage(
  deals: Deal[],
  stages: DealStage[],
): StageCount[] {
  // stages param used to infer ordering by pipeline position
  void stages;

  const counts: Record<string, number> = {};

  for (const deal of deals) {
    if (deal.win || deal.hold) continue;
    const stageName = deal.deal_stage?.name ?? "Sem etapa";
    counts[stageName] = (counts[stageName] ?? 0) + 1;
  }

  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  // Ordena pela sequência do funil
  const playbook = [
    "Abordado",
    "Respondeu",
    "Em conversa",
    "Proposta enviada",
    "Fechado",
    "Pós-evento",
    "Reativação",
  ];

  const sorted = playbook
    .map((name) => ({ name, count: counts[name] ?? 0 }))
    .filter((s) => s.count > 0);

  // Adiciona etapas que existem no CRM mas não no playbook
  for (const [name, count] of Object.entries(counts)) {
    if (!sorted.find((s) => s.name === name)) {
      sorted.push({ name, count });
    }
  }

  return sorted.map((s) => ({
    ...s,
    pct: total > 0 ? s.count / total : 0,
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
        if (deal.win) ganhos++;
        else if (!deal.hold) abertos++;
      }
    }

    points.push({ label, abertos, ganhos });
  }

  return points;
}

// ─── Tabela de negociações ativas ────────────────────────────────────────────

export function buildDealRows(deals: Deal[]): DealRow[] {
  const active = deals.filter((d) => !d.win && !d.hold);

  return active.map((d) => {
    const value =
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
      id:        d._id,
      name:      d.name,
      contact,
      stage:     d.deal_stage?.name ?? "Sem etapa",
      value,
      createdAt,
      daysOpen,
      isStale:   daysOpen > 15,
    };
  });
}

// ─── Faturamento realizado (mock por etapa "Fechado") ────────────────────────

export interface RevenueByArea {
  palestras:     number;
  apresentacoes: number;
  publicidades:  number;
}

/**
 * Extrai receita por área a partir do nome do negócio.
 * Convenção de nomenclatura: "[Palestra] Nome do cliente"
 */
export function calcRevenueByArea(deals: Deal[]): RevenueByArea {
  const won = deals.filter((d) => d.win);

  let palestras     = 0;
  let apresentacoes = 0;
  let publicidades  = 0;

  for (const d of won) {
    const name  = d.name.toLowerCase();
    const value =
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

export interface EventsByArea {
  palestras:     number;
  apresentacoes: number;
  publicidades:  number;
}

export function calcEventsByArea(deals: Deal[]): EventsByArea {
  const won = deals.filter((d) => d.win);
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
