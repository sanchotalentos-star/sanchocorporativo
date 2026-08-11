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
      // 1. Envia o arquivo para o servidor (FormData)
      const form = new FormData();
      form.append("file",   file);
      form.append("bucket", "logos");

      const res = await fetch("/api/upload", { method: "POST", body: form });

      if (!res.ok) {
        const { error } = await res.json() as { error?: string };
        throw new Error(error ?? "Erro ao fazer upload");
      }

      const { publicUrl } = await res.json() as { publicUrl: string };

      // 2. Salva a URL pública no banco
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
      {/* Preview — simula o fundo escuro do dashboard */}
      <div>
        <p className="text-xs mb-1.5" style={{ color: "var(--sancho-gray-mid)" }}>
          Preview (como aparece no dashboard)
        </p>
        <div
          className="flex items-center justify-center rounded-2xl overflow-hidden px-6"
          style={{
            backgroundColor: "#080808",
            border:          "1px solid rgba(255,255,255,.08)",
            height:          120,
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Logo atual"
              className="max-h-16 max-w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Upload size={24} style={{ color: "var(--sancho-pink)" }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,.3)" }}>
                Nenhuma logo carregada
              </p>
            </div>
          )}
        </div>
        <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,.25)" }}>
          💡 Para melhor resultado, use um arquivo PNG com fundo transparente — versão branca ou rosa.
        </p>
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
