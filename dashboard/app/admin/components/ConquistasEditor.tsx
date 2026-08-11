"use client";

// ── ConquistasEditor ──────────────────────────────────────────────────────────
// Painel admin para atualizar os contadores das metas estratégicas 2026
// e o faturamento YTD (caso queira registrar um valor manual como referência).

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { ConquistasRow } from "@/app/api/conquistas/route";

type Status = "idle" | "saving" | "ok" | "error";

const CAMPOS: {
  key: keyof ConquistasRow;
  label: string;
  meta: string;
  grupo: string;
  isMoney?: boolean;
}[] = [
  // Novos Agenciados
  { key: "novos_palestrantes",   label: "Palestrantes / Apresentadores assinados", meta: "meta: 3",  grupo: "⭐ Novos Agenciados" },
  { key: "novos_criadores",      label: "Criadores de Conteúdo assinados",         meta: "meta: 2",  grupo: "⭐ Novos Agenciados" },
  // Recorrentes
  { key: "combos_eventos",       label: "Combos de eventos fechados",              meta: "meta: 6",  grupo: "🔄 Negócios Recorrentes" },
  { key: "embaixadas",           label: "Embaixadas firmadas",                     meta: "meta: 5",  grupo: "🔄 Negócios Recorrentes" },
  // Equipe
  { key: "agentes_comerciais",   label: "Agentes Comerciais contratados",          meta: "meta: 2",  grupo: "👥 Equipe" },
  { key: "inteligencia_mercado", label: "Inteligência de Mercado contratada",      meta: "meta: 1",  grupo: "👥 Equipe" },
  // Financeiro
  { key: "faturamento_ytd",      label: "Faturamento YTD (R$) — ajuste manual",   meta: "meta: R$ 2.000.000", grupo: "💰 Financeiro (manual)", isMoney: true },
];

const GRUPOS = CAMPOS.map((c) => c.grupo).filter((g, i, arr) => arr.indexOf(g) === i);

export function ConquistasEditor() {
  const [form,   setForm]   = useState<ConquistasRow>({
    novos_palestrantes: 0, novos_criadores: 0,
    combos_eventos: 0,     embaixadas: 0,
    agentes_comerciais: 0, inteligencia_mercado: 0,
    faturamento_ytd: 0,
  });
  const [status, setStatus] = useState<Status>("idle");
  const [msg,    setMsg]    = useState("");

  useEffect(() => {
    fetch("/api/conquistas")
      .then((r) => r.json())
      .then((d: ConquistasRow) => setForm(d))
      .catch(() => null);
  }, []);

  function handleChange(key: keyof ConquistasRow, raw: string) {
    const val = raw === "" ? 0 : Number(raw);
    if (isNaN(val)) return;
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    setStatus("saving");
    setMsg("Salvando...");
    try {
      const res = await fetch("/api/conquistas", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setStatus("ok");
      setMsg("Salvo com sucesso!");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Erro");
    }
  }

  return (
    <div className="space-y-6">
      {GRUPOS.map((grupo) => {
        const campos = CAMPOS.filter((c) => c.grupo === grupo);
        return (
          <div key={grupo}>
            <p
              className="text-xs font-bold mb-3"
              style={{ color: "var(--sancho-pink)" }}
            >
              {grupo}
            </p>

            <div className="space-y-3">
              {campos.map(({ key, label, meta, isMoney }) => (
                <div key={key} className="flex items-center gap-3">
                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: "var(--sancho-black)" }}>
                      {label}
                    </div>
                    <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {meta}
                    </div>
                  </div>

                  {/* Input */}
                  <input
                    type="number"
                    min={0}
                    step={isMoney ? 1000 : 1}
                    value={form[key] ?? 0}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-28 text-right text-sm font-bold rounded-lg px-3 py-1.5 outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border:          "1px solid rgba(255,255,255,0.12)",
                      color:           "var(--sancho-black)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Botão salvar */}
      <button
        onClick={() => void handleSave()}
        disabled={status === "saving"}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
        style={{ backgroundColor: "var(--sancho-pink)" }}
      >
        {status === "saving"
          ? <Loader2 size={14} className="animate-spin" />
          : <Save size={14} />}
        Salvar conquistas
      </button>

      {/* Feedback */}
      {status !== "idle" && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{
            backgroundColor: status === "ok" ? "rgba(16,185,129,.08)" : status === "error" ? "rgba(248,113,113,.08)" : "rgba(255,255,255,.04)",
            color:           status === "ok" ? "var(--sancho-won)"  : status === "error" ? "var(--sancho-lost)"  : "var(--sancho-gray-mid)",
          }}
        >
          {status === "ok"      && <CheckCircle size={13} />}
          {status === "error"   && <AlertCircle size={13} />}
          {status === "saving"  && <Loader2 size={13} className="animate-spin" />}
          {msg}
        </div>
      )}
    </div>
  );
}
