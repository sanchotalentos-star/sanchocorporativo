// app/api/metas/[mes]/route.ts
// GET /api/metas/:mes  — retorna metas de um mês (formato: YYYY-MM)
// PUT /api/metas/:mes  — cria ou atualiza metas de um mês (upsert)
//
// Fallback: se o mês não tiver registro no banco, retorna os valores default
// de config/metas.ts para não quebrar o dashboard.

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase-server";
import { METAS_MENSAIS } from "@/config/metas";

const MES_REGEX = /^\d{4}-\d{2}$/;

/** Converte "YYYY-MM" para o primeiro dia do mês "YYYY-MM-01" */
function mesToDate(mes: string): string {
  return `${mes}-01`;
}

/** Valores padrão vindos de config/metas.ts — usados quando mês sem registro */
function defaultMetas(mes: string) {
  return {
    mes:                    mesToDate(mes),
    palestras_eventos:      METAS_MENSAIS.palestras.metaEventos,
    palestras_valor:        METAS_MENSAIS.palestras.faturamentoEsperado,
    apresentacoes_eventos:  METAS_MENSAIS.apresentacoes.metaEventos,
    apresentacoes_valor:    METAS_MENSAIS.apresentacoes.faturamentoEsperado,
    publicidades_contratos: METAS_MENSAIS.publicidades.metaContratos,
    publicidades_valor:     METAS_MENSAIS.publicidades.faturamentoEsperado,
    prospeccoes_dia:        METAS_MENSAIS.operacional.prospeccoesporDia,
    contatos_dia:           METAS_MENSAIS.operacional.contatosDiarios,
    agendamentos_semana:    METAS_MENSAIS.operacional.agendamentosPorSemana,
    fechamentos_semana:     METAS_MENSAIS.operacional.fechamentosPorSemana,
    reunioes_semana:        METAS_MENSAIS.operacional.reunioesComercaisPorSemana,
    propostas_semana:       METAS_MENSAIS.operacional.propostasFechadasPorSemana,
    novos_clientes_mes:     METAS_MENSAIS.operacional.novosClientesPorMes,
    isDefault:              true,  // flag para o front saber que é valor default
  };
}

export async function GET(
  _request: Request,
  { params }: { params: { mes: string } }
) {
  const { mes } = params;
  if (!MES_REGEX.test(mes)) {
    return NextResponse.json({ error: "Formato inválido. Use YYYY-MM" }, { status: 400 });
  }

  try {
    const { data, error } = await db()
      .from("metas_mensais")
      .select("*")
      .eq("mes", mesToDate(mes))
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json(defaultMetas(mes));
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao buscar metas";
    // Em caso de erro (ex: Supabase não configurado), retorna defaults
    return NextResponse.json(defaultMetas(mes));
  }
}

const MetasSchema = z.object({
  palestras_eventos:      z.number().int().min(0).optional(),
  palestras_valor:        z.number().min(0).optional(),
  apresentacoes_eventos:  z.number().int().min(0).optional(),
  apresentacoes_valor:    z.number().min(0).optional(),
  publicidades_contratos: z.number().int().min(0).optional(),
  publicidades_valor:     z.number().min(0).optional(),
  prospeccoes_dia:        z.number().int().min(0).optional(),
  contatos_dia:           z.number().int().min(0).optional(),
  agendamentos_semana:    z.number().int().min(0).optional(),
  fechamentos_semana:     z.number().int().min(0).optional(),
  reunioes_semana:        z.number().int().min(0).optional(),
  propostas_semana:       z.number().int().min(0).optional(),
  novos_clientes_mes:     z.number().int().min(0).optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: { mes: string } }
) {
  const { mes } = params;
  if (!MES_REGEX.test(mes)) {
    return NextResponse.json({ error: "Formato inválido. Use YYYY-MM" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json() as unknown;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = MetasSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { data, error } = await db()
      .from("metas_mensais")
      .upsert({ mes: mesToDate(mes), ...parsed.data })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao salvar metas";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
