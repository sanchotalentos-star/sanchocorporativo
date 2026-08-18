// app/api/rd-crm/ytd/route.ts
// GET /api/rd-crm/ytd
// Retorna o faturamento realizado por mês (deals ganhos no CRM) para o ano corrente
// Fonte: RD Station CRM — negociações com win=true no ano atual
// ⚠️  Nunca expõe o token — apenas server-side

import { NextResponse } from "next/server";
import { getWonDealsYTD } from "@/lib/rdcrm";
import type { Deal } from "@/lib/rdcrm";

export interface YtdMes {
  mes:       string;   // "2026-01"
  valor:     number;
  negociacoes: number;
}

export interface YtdResponse {
  ytd:     number;
  porMes:  YtdMes[];
  source:  "crm" | "mock";
}

function dealValue(d: Deal): number {
  // Soma os três campos de valor disponíveis
  return (
    (d.amount_montly    ?? 0) +
    (d.amount_unique    ?? 0) +
    (d.amount_recurrent ?? 0)
  );
}

function mesKey(dateStr: string | null | undefined): string | null {
  // Extrai "YYYY-MM" de uma string ISO como "2026-08-15T..."
  if (!dateStr) return null;
  return dateStr.slice(0, 7);
}

export async function GET() {
  const now = new Date();
  const ano = now.getFullYear();

  try {
    const deals = await getWonDealsYTD();

    // Agrega por mês usando updated_at (data do fechamento) como referência
    const mapValor: Record<string, number>      = {};
    const mapCount: Record<string, number>      = {};

    for (const deal of deals) {
      const key = mesKey(deal.updated_at) ?? mesKey(deal.created_at);
      if (!key || !key.startsWith(String(ano))) continue;

      const v = dealValue(deal);
      mapValor[key] = (mapValor[key] ?? 0) + v;
      mapCount[key] = (mapCount[key] ?? 0) + 1;
    }

    const mesesOrdenados = Object.keys(mapValor).sort();
    const porMes: YtdMes[] = mesesOrdenados.map((mes) => ({
      mes,
      valor:       mapValor[mes] ?? 0,
      negociacoes: mapCount[mes] ?? 0,
    }));

    const ytd = porMes.reduce((s, m) => s + m.valor, 0);

    return NextResponse.json({ ytd, porMes, source: "crm" } satisfies YtdResponse);

  } catch {
    // Sem token ou falha da API — retorna zeros sem expor o erro
    return NextResponse.json({ ytd: 0, porMes: [], source: "mock" } satisfies YtdResponse);
  }
}
