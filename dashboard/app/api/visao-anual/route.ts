// app/api/visao-anual/route.ts
// Retorna meta + realizado para cada mês do ano corrente (2026)
// Cruza metas_mensais (meta definida) com historico_mes (resultado real manual)
// e complementa com dados do RD Station CRM (deals ganhos) quando não há registro manual

import { NextResponse }   from "next/server";
import { db }             from "@/lib/supabase-server";
import { METAS_MENSAIS }  from "@/config/metas";
import { getWonDealsYTD } from "@/lib/rdcrm";
import type { Deal }      from "@/lib/rdcrm";

const META_ANUAL = 2_000_000;

export interface MesRow {
  mes:        string;    // "2026-01"
  label:      string;    // "Jan"
  meta:       number;
  realizado:  number;
  isFuture:   boolean;
  isCurrent:  boolean;
  fonte:      "manual" | "crm" | "vazio";   // origem do valor realizado
}

export interface VisaoAnualData {
  ano:        number;
  meta_anual: number;
  ytd:        number;
  ytd_pct:    number;
  meses:      MesRow[];
}

const LABELS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

export async function GET() {
  const now    = new Date();
  const ano    = now.getFullYear();
  const mesAtual = now.getMonth(); // 0-indexed

  // Default mensal fallback
  const defaultMeta =
    METAS_MENSAIS.palestras.faturamentoEsperado +
    METAS_MENSAIS.apresentacoes.faturamentoEsperado +
    METAS_MENSAIS.publicidades.faturamentoEsperado;

  // Fallback rápido (sem Supabase)
  const fallback = (): VisaoAnualData => ({
    ano,
    meta_anual: META_ANUAL,
    ytd: 0,
    ytd_pct: 0,
    meses: LABELS.map((label, i) => ({
      mes:       `${ano}-${String(i + 1).padStart(2, "0")}`,
      label,
      meta:      defaultMeta,
      realizado: 0,
      isFuture:  i > mesAtual,
      isCurrent: i === mesAtual,
      fonte:     "vazio" as const,
    })),
  });

  // Helper: agrega deals ganhos por mês usando updated_at
  function crmPorMes(deals: Deal[]): Record<string, number> {
    const map: Record<string, number> = {};
    for (const d of deals) {
      const ref = d.updated_at ?? d.created_at;
      if (!ref) continue;
      const key = ref.slice(0, 7);
      if (!key.startsWith(String(ano))) continue;
      const valor = (d.amount_montly ?? 0) + (d.amount_unique ?? 0) + (d.amount_recurrent ?? 0);
      map[key] = (map[key] ?? 0) + valor;
    }
    return map;
  }

  try {
    const client = db();
    const inicioAno = `${ano}-01-01`;
    const fimAno    = `${ano}-12-31`;

    // Busca metas mensais, histórico manual e deals ganhos CRM em paralelo
    const [{ data: metas }, { data: historico }, wonDeals] = await Promise.all([
      client
        .from("metas_mensais")
        .select("mes, palestras_valor, apresentacoes_valor, publicidades_valor")
        .gte("mes", inicioAno)
        .lte("mes", fimAno),
      client
        .from("historico_mes")
        .select("mes, faturamento_palestras, faturamento_apresentacoes, faturamento_publicidades")
        .gte("mes", inicioAno)
        .lte("mes", fimAno),
      getWonDealsYTD().catch(() => []),   // silencia falha do CRM
    ]);

    // Indexa por mês (ex: "2026-08")
    const metaMap: Record<string, number> = {};
    for (const m of metas ?? []) {
      const key = String(m.mes).slice(0, 7);
      metaMap[key] = Number(m.palestras_valor ?? 0)
                   + Number(m.apresentacoes_valor ?? 0)
                   + Number(m.publicidades_valor ?? 0);
    }

    // Histórico manual (verdade do usuário)
    const manualMap: Record<string, number> = {};
    for (const h of historico ?? []) {
      const key = String(h.mes).slice(0, 7);
      manualMap[key] = Number(h.faturamento_palestras     ?? 0)
                     + Number(h.faturamento_apresentacoes ?? 0)
                     + Number(h.faturamento_publicidades  ?? 0);
    }

    // CRM — usado quando não há registro manual para o mês
    const crmMap = crmPorMes(wonDeals);

    const meses: MesRow[] = LABELS.map((label, i) => {
      const key  = `${ano}-${String(i + 1).padStart(2, "0")}`;
      const meta = metaMap[key] ?? defaultMeta;

      let realizado: number;
      let fonte: MesRow["fonte"];

      if (key in manualMap) {
        realizado = manualMap[key];
        fonte     = "manual";
      } else if (key in crmMap) {
        realizado = crmMap[key];
        fonte     = "crm";
      } else {
        realizado = 0;
        fonte     = "vazio";
      }

      return {
        mes:  key,
        label,
        meta,
        realizado,
        isFuture:  i > mesAtual,
        isCurrent: i === mesAtual,
        fonte,
      };
    });

    const ytd = meses
      .filter((m) => !m.isFuture)
      .reduce((sum, m) => sum + m.realizado, 0);

    return NextResponse.json({
      ano,
      meta_anual: META_ANUAL,
      ytd,
      ytd_pct: (ytd / META_ANUAL) * 100,
      meses,
    } as VisaoAnualData);

  } catch {
    return NextResponse.json(fallback());
  }
}
