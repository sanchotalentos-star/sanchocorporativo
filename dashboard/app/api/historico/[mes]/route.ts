// app/api/historico/[mes]/route.ts
// GET /api/historico/:mes  — resultado real de um mês
// PUT /api/historico/:mes  — registra/atualiza resultado real de um mês

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase-server";

const MES_REGEX = /^\d{4}-\d{2}$/;

function mesToDate(mes: string): string {
  return `${mes}-01`;
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
      .from("historico_mes")
      .select("*")
      .eq("mes", mesToDate(mes))
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json(null);
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao buscar histórico";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

const HistoricoSchema = z.object({
  ganhos:                    z.number().int().min(0).optional(),
  perdidos:                  z.number().int().min(0).optional(),
  faturamento_palestras:     z.number().min(0).optional(),
  faturamento_apresentacoes: z.number().min(0).optional(),
  faturamento_publicidades:  z.number().min(0).optional(),
  eventos_palestras:         z.number().int().min(0).optional(),
  eventos_apresentacoes:     z.number().int().min(0).optional(),
  contratos_publicidades:    z.number().int().min(0).optional(),
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

  const parsed = HistoricoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { data, error } = await db()
      .from("historico_mes")
      .upsert({
        mes:        mesToDate(mes),
        ...parsed.data,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao salvar histórico";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
