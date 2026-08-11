// app/api/conquistas/route.ts
// GET  → lê progresso das metas estratégicas + financeiro YTD
// PUT  → salva progresso editado pelo admin

import { NextResponse } from "next/server";
import { z }            from "zod";
import { db }           from "@/lib/supabase-server";

// ── Valores default (fallback quando tabela ainda não existe) ─────────────────

const DEFAULT: ConquistasRow = {
  novos_palestrantes:   0,
  novos_criadores:      0,
  combos_eventos:       0,
  embaixadas:           0,
  agentes_comerciais:   0,
  inteligencia_mercado: 0,
  faturamento_ytd:      0,
};

export interface ConquistasRow {
  novos_palestrantes:   number;
  novos_criadores:      number;
  combos_eventos:       number;
  embaixadas:           number;
  agentes_comerciais:   number;
  inteligencia_mercado: number;
  faturamento_ytd:      number;
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const client = db();

    // Lê row principal
    const { data, error } = await client
      .from("conquistas_2026")
      .select("novos_palestrantes, novos_criadores, combos_eventos, embaixadas, agentes_comerciais, inteligencia_mercado, faturamento_ytd")
      .eq("id", "default")
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json(DEFAULT);

    // Complementa faturamento_ytd com soma do historico_mes (ano atual)
    const anoAtual = new Date().getFullYear();
    const inicioAno = `${anoAtual}-01-01`;
    const fimAno    = `${anoAtual}-12-31`;

    const { data: historico } = await client
      .from("historico_mes")
      .select("faturamento_palestras, faturamento_apresentacoes, faturamento_publicidades")
      .gte("mes", inicioAno)
      .lte("mes", fimAno);

    const ytdHistorico = (historico ?? []).reduce((sum, row) => {
      return sum
        + Number(row.faturamento_palestras      ?? 0)
        + Number(row.faturamento_apresentacoes  ?? 0)
        + Number(row.faturamento_publicidades   ?? 0);
    }, 0);

    // Usa o maior entre o valor manual e o calculado do historico
    const faturamento_ytd = Math.max(Number(data.faturamento_ytd ?? 0), ytdHistorico);

    return NextResponse.json({ ...data, faturamento_ytd } as ConquistasRow);
  } catch {
    return NextResponse.json(DEFAULT);
  }
}

// ── PUT ───────────────────────────────────────────────────────────────────────

const PutSchema = z.object({
  novos_palestrantes:   z.number().int().min(0).max(99).optional(),
  novos_criadores:      z.number().int().min(0).max(99).optional(),
  combos_eventos:       z.number().int().min(0).max(99).optional(),
  embaixadas:           z.number().int().min(0).max(99).optional(),
  agentes_comerciais:   z.number().int().min(0).max(99).optional(),
  inteligencia_mercado: z.number().int().min(0).max(99).optional(),
  faturamento_ytd:      z.number().min(0).optional(),
});

export async function PUT(request: Request) {
  try {
    const body   = await request.json() as unknown;
    const parsed = PutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const client = db();
    const payload = { id: "default", ...parsed.data, updated_at: new Date().toISOString() };

    const { error } = await client
      .from("conquistas_2026")
      .upsert(payload, { onConflict: "id" });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao salvar" },
      { status: 500 }
    );
  }
}
