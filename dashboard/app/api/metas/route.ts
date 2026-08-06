// app/api/metas/route.ts
// GET /api/metas — lista todos os meses com metas registradas (mais recente primeiro)

import { NextResponse } from "next/server";
import { db } from "@/lib/supabase-server";

export async function GET() {
  try {
    const { data, error } = await db()
      .from("metas_mensais")
      .select("*")
      .order("mes", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao buscar metas";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
