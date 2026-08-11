"use client";

// ── Metas Anuais 2026 ─────────────────────────────────────────────────────────
// Painel fixo com os targets reais definidos para 2026:
// • Financeiras por agenciado  → R$ 2.000.000 no total
// • Conquistas estratégicas    → novos agenciados, recorrentes, equipe

import { TrendingUp, Target, Users, Repeat2, Star } from "lucide-react";

// ── Dados reais do framework 2026 ────────────────────────────────────────────

const AGENTES: { nome: string; meta: number; destaque?: boolean }[] = [
  { nome: "PH Santos",              meta: 500_000, destaque: true },
  { nome: "Marcelo Paz",            meta: 400_000, destaque: true },
  { nome: "Wladson Sidney",         meta: 400_000, destaque: true },
  { nome: "Projetos / Sebrae",      meta: 400_000 },
  { nome: "Outros Agenciados",      meta: 200_000 },
  { nome: "Alexandre Pereira",      meta:  90_000 },
  { nome: "Eduardo Gomes de Matos", meta:  70_000 },
  { nome: "Felipão",                meta:  60_000 },
  { nome: "Alexandre Frota",        meta:  30_000 },
  { nome: "Luiz Altamir",           meta:  30_000 },
];

const META_ANUAL_TOTAL = 2_000_000;

const CONQUISTAS: {
  categoria: string;
  icone: React.ReactNode;
  cor: string;
  items: string[];
}[] = [
  {
    categoria: "Novos Agenciados",
    icone:     <Star size={13} />,
    cor:       "var(--sancho-pink)",
    items: [
      "03 Palestrantes / Apresentadores (Felipão…)",
      "02 Criadores de Conteúdo",
    ],
  },
  {
    categoria: "Negócios Recorrentes",
    icone:     <Repeat2 size={13} />,
    cor:       "#3B82F6",
    items: [
      "06 Combos de eventos (Victa, Unimed, Comercial Maia, NTSEC, Iguatemi…)",
      "05 Embaixadas",
    ],
  },
  {
    categoria: "Equipe",
    icone:     <Users size={13} />,
    cor:       "#10B981",
    items: [
      "02 Agentes Comerciais",
      "01 Inteligência de Mercado (Geradora de vendas)",
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return v >= 1_000_000
    ? `R$ ${(v / 1_000_000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`
    : `R$ ${(v / 1_000).toFixed(0)}k`;
}

// ── Sub-componente: barra de meta por agente ──────────────────────────────────

function AgentBar({ nome, meta, destaque }: { nome: string; meta: number; destaque?: boolean }) {
  const pct = (meta / META_ANUAL_TOTAL) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs truncate"
          style={{ color: destaque ? "var(--sancho-black)" : "var(--sancho-gray-mid)" }}
        >
          {nome}
        </span>
        <span
          className="text-xs font-bold tabular-nums flex-shrink-0"
          style={{ color: destaque ? "var(--sancho-pink)" : "var(--sancho-gray-mid)" }}
        >
          {fmt(meta)}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 4, backgroundColor: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width:           `${pct}%`,
            backgroundColor: destaque ? "var(--sancho-pink)" : "rgba(255,255,255,0.18)",
          }}
        />
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export function MetasAnuais2026() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border:     "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* ── Cabeçalho com total ─────────────────────────────── */}
      <div
        className="px-5 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <TrendingUp size={14} style={{ color: "var(--sancho-pink)" }} />
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--sancho-pink)" }}
              >
                Comercial
              </span>
            </div>
            <h2
              className="text-base font-bold"
              style={{ color: "var(--sancho-black)" }}
            >
              Metas Financeiras 2026
            </h2>
          </div>
          <div className="text-right flex-shrink-0">
            <div
              className="text-2xl font-black tabular-nums"
              style={{ color: "var(--sancho-pink)", lineHeight: 1 }}
            >
              R$&nbsp;2M
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: "var(--sancho-gray-mid)" }}>
              faturamento anual
            </div>
          </div>
        </div>
      </div>

      {/* ── Grade: Agentes | Conquistas ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >

        {/* Coluna esquerda — por agenciado */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--sancho-gray-mid)" }}
          >
            Por Agenciado
          </p>
          {AGENTES.map((a) => (
            <AgentBar key={a.nome} {...a} />
          ))}
        </div>

        {/* Coluna direita — conquistas estratégicas */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={12} style={{ color: "var(--sancho-pink)" }} />
            <p className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--sancho-gray-mid)" }}
            >
              Metas Estratégicas de Conquistas 2026
            </p>
          </div>

          <div className="space-y-5">
            {CONQUISTAS.map((c) => (
              <div key={c.categoria}>
                {/* Categoria header */}
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: c.cor }}>{c.icone}</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "var(--sancho-black)" }}
                  >
                    {c.categoria}
                  </span>
                </div>
                {/* Items */}
                <ul className="space-y-1.5 pl-1">
                  {c.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className="mt-[5px] flex-shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: c.cor, opacity: 0.7 }}
                      />
                      <span className="text-xs leading-relaxed"
                        style={{ color: "var(--sancho-gray-mid)" }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
