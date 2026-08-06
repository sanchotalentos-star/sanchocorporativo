// app/api/upload/route.ts
// POST /api/upload  — gera URL assinada para upload direto no Supabase Storage
// Body: { bucket: "logos" | "fotos-membros", filename: string, contentType: string }
//
// O browser usa a URL assinada para fazer PUT direto no Storage sem passar o arquivo pelo servidor.

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/supabase-server";

const UploadSchema = z.object({
  bucket:      z.enum(["logos", "fotos-membros"]),
  filename:    z.string().min(1).max(200),
  contentType: z.string().regex(/^image\/(png|jpeg|jpg|webp|svg\+xml)$/),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json() as unknown;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = UploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { bucket, filename, contentType } = parsed.data;

  // Sanitiza o nome do arquivo e adiciona timestamp para evitar colisões
  const ext      = filename.split(".").pop() ?? "png";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  try {
    const client = db();

    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUploadUrl(safeName);

    if (error) throw error;

    // URL pública final (após o upload ser concluído)
    const { data: { publicUrl } } = client.storage
      .from(bucket)
      .getPublicUrl(safeName);

    return NextResponse.json({
      signedUrl:  data.signedUrl,
      token:      data.token,
      path:       data.path,
      publicUrl,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao gerar URL de upload";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
