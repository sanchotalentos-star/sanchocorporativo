// app/api/rd-crm/route.ts
// Route Handler server-side — proxy para o RD Station CRM
// ⚠️  O token RDCRM_TOKEN NUNCA é exposto ao client-side

import { NextResponse } from "next/server";
import { z } from "zod";
import { getDeals, getStages } from "@/lib/rdcrm";
import {
  groupByStatus,
  groupByStage,
  groupByWeek,
  buildDealRows,
  calcRevenueByArea,
  calcEventsByArea,
} from "@/lib/dashboard";

// Zod: parâmetros opcionais da query string
const QuerySchema = z.object({
  stage: z.string().optional(),
});

export async function GET(request: Request) {
  // Valida query params
  const { searchParams } = new URL(request.url);
  const parseResult = QuerySchema.safeParse(
    Object.fromEntries(searchParams.entries()),
  );

  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parseResult.error.flatten() },
      { status: 400 },
    );
  }

  // Verifica se o token está configurado
  if (!process.env.RDCRM_TOKEN) {
    // Retorna dados mock quando o token não está configurado
    return NextResponse.json(getMockData(), { status: 200 });
  }

  try {
    // Busca até 300 para cobrir todos os deals (CRM tem >200 registros)
    const [deals, stages] = await Promise.all([getDeals(300), getStages()]);

    const kpis     = groupByStatus(deals);
    const pipeline = groupByStage(deals, stages);
    const weekly   = groupByWeek(deals);
    const rows     = buildDealRows(deals);
    const revenue  = calcRevenueByArea(deals);
    const events   = calcEventsByArea(deals);

    // Filtro por etapa (opcional)
    const stageFilter = parseResult.data.stage;
    const filteredRows = stageFilter
      ? rows.filter((r) => r.stage === stageFilter)
      : rows;

    return NextResponse.json({
      kpis,
      pipeline,
      weekly,
      deals:    filteredRows,
      revenue,
      events,
      stages:   stages.map((s) => s.name),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.warn("[RD CRM API]", message);

    // Em desenvolvimento sem token, retorna mock
    return NextResponse.json(getMockData(), { status: 200 });
  }
}

// ─── Dados mock para desenvolvimento ─────────────────────────────────────────

function getMockData() {
  const stages = [
    "Prospecção Ativa",
    "Prospect (5 dias)",
    "Negociação",
    "Pós Venda",
    "Realizado",
    "Perdido",
  ];

  const pipeline = [
    { name: "Prospecção Ativa",  count: 58, value: 10000,   pct: 0.27, isWon: false, isLost: false },
    { name: "Prospect (5 dias)", count: 15, value: 55500,   pct: 0.07, isWon: false, isLost: false },
    { name: "Negociação",        count: 13, value: 222600,  pct: 0.06, isWon: false, isLost: false },
    { name: "Pós Venda",         count:  7, value: 195500,  pct: 0.03, isWon: false, isLost: false },
    { name: "Realizado",         count: 57, value: 644520,  pct: 0.27, isWon: true,  isLost: false },
    { name: "Perdido",           count: 53, value: 1069600, pct: 0.25, isWon: false, isLost: true  },
  ];

  const weekly = [
    { label: "07/07", abertos: 6,  ganhos: 0 },
    { label: "14/07", abertos: 8,  ganhos: 0 },
    { label: "21/07", abertos: 10, ganhos: 0 },
    { label: "28/07", abertos: 7,  ganhos: 0 },
    { label: "04/08", abertos: 9,  ganhos: 0 },
  ];

  const deals = [
    { id: "1",  name: "Rubens Leite - CMTE. Alex Bacana",   contact: "Alex Bacana",    responsible: "Configure RDCRM_TOKEN", stage: "Negociação",       value: 30000,  createdAt: "2026-07-10T10:00:00Z", daysOpen: 14, isStale: false, isWon: false, isLost: false },
    { id: "2",  name: "Aeroclube de Erechim",               contact: "Aeroclube",      responsible: "Configure RDCRM_TOKEN", stage: "Prospecção Ativa", value: 10000,  createdAt: "2026-08-01T14:00:00Z", daysOpen:  3, isStale: false, isWon: false, isLost: false },
    { id: "3",  name: "Antonio Alves",                      contact: "Antonio Alves",  responsible: "Configure RDCRM_TOKEN", stage: "Prospect (5 dias)",value: 10000,  createdAt: "2026-07-28T09:00:00Z", daysOpen:  9, isStale: false, isWon: false, isLost: false },
    { id: "4",  name: "VICTA Lançamento Jasmim",            contact: "Victa Eng.",     responsible: "Configure RDCRM_TOKEN", stage: "Realizado",        value:  5000,  createdAt: "2026-06-10T11:00:00Z", daysOpen:  0, isStale: false, isWon: true,  isLost: false },
    { id: "5",  name: "Evento Hangar 1 - CMTE. César Neto", contact: "Hangar 1",       responsible: "Configure RDCRM_TOKEN", stage: "Realizado",        value: 10000,  createdAt: "2026-07-01T15:00:00Z", daysOpen:  0, isStale: false, isWon: true,  isLost: false },
    { id: "6",  name: "Divulgação SQD Mi...",               contact: "Ecoa Influência",responsible: "Configure RDCRM_TOKEN", stage: "Pós Venda",        value: 85000,  createdAt: "2026-07-18T08:00:00Z", daysOpen:  6, isStale: false, isWon: false, isLost: false },
    { id: "7",  name: "Coquetel Grupo Marsom",              contact: "Beach Park",     responsible: "Configure RDCRM_TOKEN", stage: "Realizado",        value:  2000,  createdAt: "2026-05-20T16:00:00Z", daysOpen:  0, isStale: false, isWon: true,  isLost: false },
    { id: "8",  name: "Aeroclube do Rio Grande do Sul",     contact: "Aeroclube RS",   responsible: "Configure RDCRM_TOKEN", stage: "Perdido",          value:     0,  createdAt: "2026-04-15T10:00:00Z", daysOpen:  0, isStale: false, isWon: false, isLost: true  },
    { id: "9",  name: "Aeroclube do Paraná",                contact: "Aeroclube PR",   responsible: "Configure RDCRM_TOKEN", stage: "Perdido",          value:     0,  createdAt: "2026-04-20T10:00:00Z", daysOpen:  0, isStale: false, isWon: false, isLost: true  },
  ];

  return {
    kpis:     { abertos: 93, ganhos: 57, perdidos: 53, conversao: 0.38, valorGanho: 644520 },
    pipeline,
    weekly,
    deals,
    revenue:  { palestras: 0, apresentacoes: 0, publicidades: 0 },
    events:   { palestras: 0, apresentacoes: 0, publicidades: 0 },
    stages,
    updatedAt: new Date().toISOString(),
    isMock:    true,
  };
}
