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
    const [deals, stages] = await Promise.all([getDeals(), getStages()]);

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
    "Abordado",
    "Respondeu",
    "Em conversa",
    "Proposta enviada",
    "Fechado",
    "Pós-evento",
    "Reativação",
  ];

  const pipeline = [
    { name: "Abordado",         count: 18, pct: 0.32 },
    { name: "Respondeu",        count: 12, pct: 0.21 },
    { name: "Em conversa",      count: 9,  pct: 0.16 },
    { name: "Proposta enviada", count: 7,  pct: 0.12 },
    { name: "Fechado",          count: 5,  pct: 0.09 },
    { name: "Pós-evento",       count: 3,  pct: 0.05 },
    { name: "Reativação",       count: 3,  pct: 0.05 },
  ];

  const weekly = [
    { label: "07/07", abertos: 6,  ganhos: 2 },
    { label: "14/07", abertos: 8,  ganhos: 3 },
    { label: "21/07", abertos: 10, ganhos: 2 },
    { label: "28/07", abertos: 7,  ganhos: 4 },
    { label: "04/08", abertos: 9,  ganhos: 3 },
  ];

  const deals = [
    { id: "1", name: "[Palestra] Tech Summit 2026",      contact: "Ana Lima",       stage: "Proposta enviada", value: 18000, createdAt: "2026-07-10T10:00:00Z", daysOpen: 27, isStale: true  },
    { id: "2", name: "[Apresentação] Fórum RH Nacional", contact: "Carlos Mendes",  stage: "Em conversa",      value: 12000, createdAt: "2026-07-22T14:00:00Z", daysOpen: 15, isStale: false },
    { id: "3", name: "[Publicidade] Marca Viva Moda",    contact: "Fernanda Costa", stage: "Abordado",         value:  8000, createdAt: "2026-07-28T09:00:00Z", daysOpen:  9, isStale: false },
    { id: "4", name: "[Palestra] Liderança Feminina",    contact: "Julia Torres",   stage: "Respondeu",        value: 22000, createdAt: "2026-07-30T11:00:00Z", daysOpen:  7, isStale: false },
    { id: "5", name: "[Apresentação] Awards Night",      contact: "Pedro Alves",    stage: "Em conversa",      value: 15000, createdAt: "2026-08-01T15:00:00Z", daysOpen:  5, isStale: false },
    { id: "6", name: "[Creator] Campanha Verão 2027",    contact: "Mariana Ramos",  stage: "Proposta enviada", value: 11000, createdAt: "2026-07-18T08:00:00Z", daysOpen: 19, isStale: true  },
    { id: "7", name: "[Palestra] Congresso Educação",    contact: "Ricardo Pinto",  stage: "Reativação",       value:  9500, createdAt: "2026-06-20T16:00:00Z", daysOpen: 47, isStale: true  },
  ];

  return {
    kpis: { abertos: 57, ganhos: 14, perdidos: 8, conversao: 0.197 },
    pipeline,
    weekly,
    deals,
    revenue:   { palestras: 38000, apresentacoes: 26000, publicidades: 32000 },
    events:    { palestras: 3, apresentacoes: 2, publicidades: 2 },
    stages,
    updatedAt: new Date().toISOString(),
    isMock:    true,
  };
}
