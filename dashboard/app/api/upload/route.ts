// app/api/upload/route.ts
// POST /api/upload  — recebe o arquivo via FormData e faz upload no servidor
// para o Supabase Storage. Elimina a necessidade de signed URLs (que requerem
// service_role key). O arquivo passa pelo servidor Next.js (máx 5 MB).

import { NextResponse } from "next/server";
import { db } from "@/lib/supabase-server";

const ALLOWED_TYPES = new Set([
  "image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml",
]);

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file     = formData.get("file") as File | null;
    const bucket   = formData.get("bucket") as string | null;

    if (!file)   return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
    if (!bucket || !["logos", "fotos-membros"].includes(bucket))
      return NextResponse.json({ error: "Bucket inválido" }, { status: 400 });

    if (!ALLOWED_TYPES.has(file.type))
      return NextResponse.json({ error: "Tipo de arquivo não permitido" }, { status: 400 });

    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "Arquivo muito grande (máx 5 MB)" }, { status: 400 });

    // Lê os bytes do arquivo
    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);

    // Gera nome único
    const ext      = file.name.split(".").pop() ?? "png";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const client = db();

    // Upload direto pelo servidor
    const { error } = await client.storage
      .from(bucket)
      .upload(safeName, buffer, {
        contentType: file.type,
        upsert:      false,
      });

    if (error) throw error;

    // URL pública
    const { data: { publicUrl } } = client.storage
      .from(bucket)
      .getPublicUrl(safeName);

    return NextResponse.json({ publicUrl, path: safeName });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao fazer upload";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Next.js 14 App Router — sem bodyParser config necessário para FormData
