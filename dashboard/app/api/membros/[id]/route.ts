// app/api/membros/[id]/route.ts
// PUT    /api/membros/:id  — atualiza membro
// DELETE /api/membros/:id  — desativa membro (soft delete)

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase-server";

const UpdateSchema = z.object({
  nome:       z.string().min(1).optional(),
  email:      z.string().email().nullable().optional(),
  foto_url:   z.string().url().nullable().optional(),
  funcao:     z.string().nullable().optional(),
  rd_user_id: z.string().nullable().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let body: unknown;
  try {
    body = await request.json() as unknown;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { data, error } = await db()
      .from("membros")
      .update(parsed.data)
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao atualizar membro";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await db()
      .from("membros")
      .update({ ativo: false })
      .eq("id", params.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao remover membro";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
