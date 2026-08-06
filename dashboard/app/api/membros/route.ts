// app/api/membros/route.ts
// GET  /api/membros  — lista membros ativos
// POST /api/membros  — cria novo membro

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase-server";

export async function GET() {
  try {
    const { data, error } = await db()
      .from("membros")
      .select("*")
      .eq("ativo", true)
      .order("nome");

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao buscar membros";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

const CreateSchema = z.object({
  nome:       z.string().min(1),
  email:      z.string().email().nullable().optional(),
  foto_url:   z.string().url().nullable().optional(),
  funcao:     z.string().nullable().optional(),
  rd_user_id: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json() as unknown;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { data, error } = await db()
      .from("membros")
      .insert({ ...parsed.data, ativo: true })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao criar membro";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
