"use client";

// ── Metas Anuais 2026 ─────────────────────────────────────────────────────────
// • Barra de progresso anual (R$ realizado / R$ 2M)
// • Meta por agenciado com barras proporcionais
// • Conquistas estratégicas com contadores realizados/meta

import { useEffect, useState } from "react";
import { TrendingUp, Star, Repeat2, Users } from "lucide-react";
import type { ConquistasRow } from "@/app/api/conquistas/route";
import type { YtdResponse }   from "@/app/api/rd-crm/ytd/route";

// ── Dados estáticos 2026 ─────────────────────────────────────────────────────

const META_ANUAL = 2_000_000;

const AGENTES = [
  { nome: "PH Santos",              meta: 500_000, destaque: true  },
  { nome: "Marcelo Paz",            meta: 400_000, destaque: true  },
  { nome: "Wladson Sidney",         meta: 400_000, destaque: true  },
  { nome: "Projetos / Sebrae",      meta: 400_000, destaque: false },
  { nome: "Outros Agenciados",      meta: 200_000, destaque: false },
  { nome: "Alexandre Pereira",      meta:  90_000, destaque: false },
  { nome: "Eduardo Gomes de Matos", meta:  70_000, destaque: false },
  { nome: "Felipão",                meta:  60_000, destaque: false },
  { nome: "Alexandre Frota",        meta:  30_000, destaque: false },
  { nome: "Luiz Altamir",           meta:  30_000, destaque: false },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtBRL(v: number) {
  if (v >= 1_000_000)
    return `R$ ${(v / 1_000_000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
  if (v >= 1_000)
    return `R$ ${(v / 1_000).toFixed(0)}k`;
  return `R$ ${v.toLocaleString("pt-BR")}`;
}

function pct(value: number, total: number) {
  return total > 0 ? Math.min(100, (value / total) * 100) : 0;
}

// ── Sub-componente: barra de progresso genérica ───────────────────────────────

function ProgressBar({
  value, max, color = "var(--sancho-pink)", thin = false,
}: {
  value: number; max: number; color?: string; thin?: boolean;
}) {
  const p = pct(value, max);
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height: thin ? 3 : 5, backgroundColor: "var(--card-bg-input)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${p}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ── Sub-componente: linha de conquista com contador ───────────────────────────

function ConquistaItem({
  label, realizado, meta, cor,
}: {
  label: string; realizado: number; meta: number; cor: string;
}) {
  const done = realizado >= meta;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
          {label}
        </span>
        <span
          className="text-xs font-bold tabular-nums flex-shrink-0"
          style={{ color: done ? "#10B981" : cor }}
        >
          {realizado}/{meta}
        </span>
      </div>
      <ProgressBar value={realizado} max={meta} color={done ? "#10B981" : cor} thin />
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

const EMPTY: ConquistasRow = {
  novos_palestrantes: 0, novos_criadores: 0,
  combos_eventos: 0,     embaixadas: 0,
  agentes_comerciais: 0, inteligencia_mercado: 0,
  faturamento_ytd: 0,
};

export function MetasAnuais2026() {
  const [conquistas, setConquistas] = useState<ConquistasRow>(EMPTY);
  const [ytdCrm,     setYtdCrm]     = useState<number>(0);
  const [loading,    setLoading]    = useState(true);
  const [loadingCrm, setLoadingCrm] = useState(true);

  useEffect(() => {
    // Conquistas manuais (contadores estratégicos)
    fetch("/api/conquistas")
      .then((r) => r.json())
      .then((d: ConquistasRow) => setConquistas(d))
      .catch(() => null)
      .finally(() => setLoading(false));

    // YTD real do CRM (negócios ganhos)
    fetch("/api/rd-crm/ytd")
      .then((r) => r.json())
      .then((d: YtdResponse) => setYtdCrm(d.ytd))
      .catch(() => null)
      .finally(() => setLoadingCrm(false));
  }, []);

  // Usa CRM como fonte primária do YTD financeiro;
  // cai no campo manual (faturamento_ytd) se CRM retornar zero
  const ytd     = ytdCrm > 0 ? ytdCrm : conquistas.faturamento_ytd;
  const ytdPct  = pct(ytd, META_ANUAL);
  const anyLoading = loading || loadingCrm;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--card-bg)",
        border:     "1px solid var(--card-border)",
      }}
    >

      {/* ── Barra de progresso anual — destaque máximo ──────────────── */}
      <div
        className="px-5 py-5 border-b"
        style={{ borderColor: "var(--card-border)" }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={13} style={{ color: "var(--sancho-pink)" }} />
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--sancho-pink)" }}
              >
                Comercial · 2026
              </span>
            </div>
            <h2 className="text-base font-bold" style={{ color: "var(--sancho-black)" }}>
              Meta Anual de Faturamento
            </h2>
          </div>

          {/* Números grandes: realizado e meta */}
          <div className="text-right flex-shrink-0">
            <div
              className="text-2xl font-black tabular-nums"
              style={{ color: ytdPct >= 100 ? "#10B981" : "var(--sancho-pink)", lineHeight: 1 }}
            >
              {anyLoading ? "—" : fmtBRL(ytd)}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: "var(--sancho-gray-mid)" }}>
              de {fmtBRL(META_ANUAL)} · {anyLoading ? "…" : `${ytdPct.toFixed(1)}%`}
            </div>
          </div>
        </div>

        {/* Barra principal */}
        <div
          className="w-full rounded-full overflow-hidden mb-1.5"
          style={{ height: 8, backgroundColor: "var(--card-bg-input)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${ytdPct}%`,
              background: ytdPct >= 100
                ? "#10B981"
                : "linear-gradient(90deg, var(--sancho-pink), #FF6EB4)",
            }}
          />
        </div>
        <div className="flex justify-between text-[10px]" style={{ color: "var(--text-ghost)" }}>
          <span>Jan 2026</span>
          <span>Meta: R$ 2.000.000</span>
          <span>Dez 2026</span>
        </div>
      </div>

      {/* ── Grade: Agentes | Conquistas ─────────────────────────────── */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ borderColor: "var(--card-border)" }}
      >

        {/* Coluna esquerda — por agenciado */}
        <div
          className="px-5 py-4 space-y-3 border-b md:border-b-0 md:border-r"
          style={{ borderColor: "var(--card-border)" }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--sancho-gray-mid)" }}
          >
            Meta por Agenciado
          </p>
          {AGENTES.map((a) => (
            <div key={a.nome} className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-xs truncate"
                  style={{ color: a.destaque ? "var(--sancho-black)" : "var(--sancho-gray-mid)" }}
                >
                  {a.nome}
                </span>
                <span
                  className="text-xs font-bold tabular-nums flex-shrink-0"
                  style={{ color: a.destaque ? "var(--sancho-pink)" : "var(--text-dim)" }}
                >
                  {fmtBRL(a.meta)}
                </span>
              </div>
              <ProgressBar
                value={a.meta}
                max={META_ANUAL}
                color={a.destaque ? "var(--sancho-pink)" : "var(--text-faint)"}
                thin
              />
            </div>
          ))}
        </div>

        {/* Coluna direita — conquistas estratégicas com contadores */}
        <div className="px-5 py-4">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--sancho-gray-mid)" }}
          >
            Metas Estratégicas de Conquistas
          </p>

          <div className="space-y-5">

            {/* Novos Agenciados */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Star size={12} style={{ color: "var(--sancho-pink)" }} />
                <span className="text-xs font-bold" style={{ color: "var(--sancho-black)" }}>
                  Novos Agenciados
                </span>
              </div>
              <div className="space-y-2 pl-1">
                <ConquistaItem
                  label="Palestrantes / Apresentadores"
                  realizado={loading ? 0 : conquistas.novos_palestrantes}
                  meta={3}
                  cor="var(--sancho-pink)"
                />
                <ConquistaItem
                  label="Criadores de Conteúdo"
                  realizado={loading ? 0 : conquistas.novos_criadores}
                  meta={2}
                  cor="var(--sancho-pink)"
                />
              </div>
            </div>

            {/* Negócios Recorrentes */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Repeat2 size={12} style={{ color: "#3B82F6" }} />
                <span className="text-xs font-bold" style={{ color: "var(--sancho-black)" }}>
                  Negócios Recorrentes
                </span>
              </div>
              <div className="space-y-2 pl-1">
                <ConquistaItem
                  label="Combos de eventos (Victa, Unimed, Maia…)"
                  realizado={loading ? 0 : conquistas.combos_eventos}
                  meta={6}
                  cor="#3B82F6"
                />
                <ConquistaItem
                  label="Embaixadas"
                  realizado={loading ? 0 : conquistas.embaixadas}
                  meta={5}
                  cor="#3B82F6"
                />
              </div>
            </div>

            {/* Equipe */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Users size={12} style={{ color: "#10B981" }} />
                <span className="text-xs font-bold" style={{ color: "var(--sancho-black)" }}>
                  Equipe
                </span>
              </div>
              <div className="space-y-2 pl-1">
                <ConquistaItem
                  label="Agentes Comerciais"
                  realizado={loading ? 0 : conquistas.agentes_comerciais}
                  meta={2}
                  cor="#10B981"
                />
                <ConquistaItem
                  label="Inteligência de Mercado"
                  realizado={loading ? 0 : conquistas.inteligencia_mercado}
                  meta={1}
                  cor="#10B981"
                />
              </div>
            </div>

          </div>

          {/* Aviso de edição */}
          <p
            className="text-[10px] mt-5 pt-4 border-t"
            style={{ color: "var(--text-ghost)", borderColor: "var(--card-border-subtle)" }}
          >
            Atualize os contadores em{" "}
            <a href="/admin" className="underline hover:opacity-80"
              style={{ color: "var(--sancho-pink)" }}>
              Admin → Conquistas
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
