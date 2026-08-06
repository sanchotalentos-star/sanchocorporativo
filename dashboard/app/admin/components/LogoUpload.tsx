"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface LogoUploadProps {
  currentUrl: string | null;
  onSaved:    (url: string) => void;
}

export function LogoUpload({ currentUrl, onSaved }: LogoUploadProps) {
  const [status,    setStatus]    = useState<"idle" | "uploading" | "ok" | "error">("idle");
  const [message,   setMessage]   = useState("");
  const [preview,   setPreview]   = useState<string | null>(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setMessage("Apenas imagens PNG, JPG, SVG ou WebP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setMessage("Arquivo muito grande (máx 5 MB)");
      return;
    }

    setStatus("uploading");
    setMessage("Enviando...");

    // Pré-visualização local
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      // 1. Pede URL assinada ao servidor
      const res = await fetch("/api/upload", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          bucket:      "logos",
          filename:    file.name,
          contentType: file.type,
        }),
      });

      if (!res.ok) throw new Error("Erro ao preparar upload");
      const { signedUrl, publicUrl } = await res.json() as { signedUrl: string; publicUrl: string };

      // 2. Upload direto para o Supabase Storage
      const uploadRes = await fetch(signedUrl, {
        method:  "PUT",
        headers: { "Content-Type": file.type },
        body:    file,
      });

      if (!uploadRes.ok) throw new Error("Upload falhou");

      // 3. Salva a URL pública no banco
      const saveRes = await fetch("/api/config", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ logo_url: publicUrl }),
      });

      if (!saveRes.ok) throw new Error("Erro ao salvar URL da logo");

      setStatus("ok");
      setMessage("Logo salva com sucesso!");
      setPreview(publicUrl);
      onSaved(publicUrl);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Erro ao enviar logo");
    }
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div
        className="flex items-center justify-center rounded-2xl border-2 border-dashed overflow-hidden"
        style={{
          borderColor:     "rgba(233,30,140,.25)",
          backgroundColor: "rgba(233,30,140,.04)",
          height:          140,
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Logo atual"
            className="max-h-24 max-w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <Upload size={28} style={{ color: "var(--sancho-pink)" }} />
            <p className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
              Nenhuma logo cadastrada
            </p>
          </div>
        )}
      </div>

      {/* Drop / click area */}
      <div
        className="relative rounded-xl border cursor-pointer group transition-colors"
        style={{
          borderColor:     "rgba(255,255,255,.10)",
          backgroundColor: "rgba(255,255,255,.03)",
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) void handleFile(file);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <div className="flex flex-col items-center gap-2 py-6 px-4 text-center">
          {status === "uploading" ? (
            <Loader2 size={22} className="animate-spin" style={{ color: "var(--sancho-pink)" }} />
          ) : (
            <Upload size={22} style={{ color: "var(--sancho-pink)" }} />
          )}
          <p className="text-sm font-medium" style={{ color: "var(--sancho-gray-dark)" }}>
            Arraste a logo aqui ou clique para selecionar
          </p>
          <p className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
            PNG, JPG, SVG ou WebP — máx 5 MB
          </p>
        </div>
      </div>

      {/* Status message */}
      {status !== "idle" && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{
            backgroundColor: status === "ok"
              ? "rgba(16,185,129,.08)"
              : status === "error"
              ? "rgba(248,113,113,.08)"
              : "rgba(255,255,255,.04)",
            color: status === "ok"
              ? "var(--sancho-won)"
              : status === "error"
              ? "var(--sancho-lost)"
              : "var(--sancho-gray-mid)",
          }}
        >
          {status === "ok"       && <CheckCircle size={13} aria-hidden="true" />}
          {status === "error"    && <AlertCircle size={13} aria-hidden="true" />}
          {status === "uploading" && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
          {message}
        </div>
      )}
    </div>
  );
}
