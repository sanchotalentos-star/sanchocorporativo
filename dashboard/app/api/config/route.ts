// app/api/config/route.ts
// GET /api/config  — retorna configurações da empresa
// PUT /api/config  — atualiza logo_url e/ou company_name

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase-server";
import type { ConfigRow } from "@/lib/supabase-types";

const DEFAULT_CONFIG: ConfigRow = {
  id:           "default",
  logo_url:     null,
  company_name: "Sancho Gestão de Carreira",
  updated_at:   new Date().toISOString(),
};

export async function GET() {
  try {
    const client = db();
    const { data, error } = await client
      .from("config")
      .select("*")
      .eq("id", "default")
      .single();

    if (error || !data) return NextResponse.json(DEFAULT_CONFIG);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(DEFAULT_CONFIG);
  }
}

const UpdateSchema = z.object({
  logo_url:     z.string().url().nullable().optional(),
  company_name: z.string().min(1).optional(),
});

export async function PUT(request: Request) {
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
    const client = db();
    const { data, error } = await client
      .from("config")
      .upsert({ id: "default", ...parsed.data, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao salvar config";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
