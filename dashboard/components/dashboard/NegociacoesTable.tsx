"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Trophy, XCircle } from "lucide-react";
import { formatBRL, formatDate } from "@/lib/formatters";
import type { DealRow } from "@/lib/dashboard";

type SortKey   = keyof Pick<DealRow, "name" | "stage" | "value" | "daysOpen">;
type SortOrder = "asc" | "desc";
type TabFilter = "ativos" | "realizados" | "perdidos" | "todos";

// Estilos de etapas — cores vibrantes para os badges
const STAGE_STYLES: Record<string, { color: string; bg: string }> = {
  // Etapas ativas
  "Prospecção Ativa":   { color: "#94A3B8", bg: "rgba(148,163,184,.12)" },
  "Prospect (5 dias)":  { color: "#60A5FA", bg: "rgba(96,165,250,.12)"  },
  "Negociação":         { color: "#FBBF24", bg: "rgba(251,191,36,.10)"  },
  "Pós Venda":          { color: "#C084FC", bg: "rgba(192,132,252,.12)" },
  "Combo de Evento":    { color: "#38BDF8", bg: "rgba(56,189,248,.10)"  },
  // Etapas finais
  "Realizado":          { color: "#10B981", bg: "rgba(16,185,129,.14)"  },
  "Perdido":            { color: "#F87171", bg: "rgba(248,113,113,.12)" },
  // Legados / outros
  "Abordado":           { color: "#94A3B8", bg: "rgba(148,163,184,.12)" },
  "Respondeu":          { color: "#60A5FA", bg: "rgba(96,165,250,.12)"  },
  "Em conversa":        { color: "#FBBF24", bg: "rgba(251,191,36,.10)"  },
  "Proposta enviada":   { color: "#C084FC", bg: "rgba(192,132,252,.12)" },
  "Fechado":            { color: "#10B981", bg: "rgba(16,185,129,.14)"  },
  "Reativação":         { color: "#E91E8C", bg: "rgba(233,30,140,.12)"  },
};

function StageBadge({ stage }: { stage: string }) {
  const s = STAGE_STYLES[stage] ?? { color: "#94A3B8", bg: "rgba(148,163,184,.12)" };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      {stage}
    </span>
  );
}

interface NegociacoesTableProps {
  data?:      DealRow[];
  stages?:    string[];
  isLoading?: boolean;
}

const TAB_LABELS: { key: TabFilter; label: string }[] = [
  { key: "ativos",     label: "Em andamento" },
  { key: "realizados", label: "Realizados"   },
  { key: "perdidos",   label: "Perdidos"     },
  { key: "todos",      label: "Todos"        },
];

export function NegociacoesTable({ data = [], stages = [], isLoading = false }: NegociacoesTableProps) {
  const [sortKey,   setSortKey]   = useState<SortKey>("daysOpen");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [tab,       setTab]       = useState<TabFilter>("ativos");

  void stages;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Conta por tab para os badges
  const counts = {
    ativos:     data.filter((r) => !r.isWon && !r.isLost).length,
    realizados: data.filter((r) => r.isWon).length,
    perdidos:   data.filter((r) => r.isLost).length,
    todos:      data.length,
  };

  const filtered = tab === "ativos"     ? data.filter((r) => !r.isWon && !r.isLost)
                 : tab === "realizados" ? data.filter((r) => r.isWon)
                 : tab === "perdidos"   ? data.filter((r) => r.isLost)
                 : data;

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const cmp  = typeof aVal === "string"
      ? aVal.localeCompare(bVal as string)
      : (aVal as number) - (bVal as number);
    return sortOrder === "asc" ? cmp : -cmp;
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={12} className="opacity-20" aria-hidden="true" />;
    return sortOrder === "asc"
      ? <ChevronUp   size={12} style={{ color: "var(--sancho-pink)" }} aria-hidden="true" />
      : <ChevronDown size={12} style={{ color: "var(--sancho-pink)" }} aria-hidden="true" />;
  }

  return (
    <section
      className="rounded-2xl p-5"
      style={{
        background: "var(--card-bg)",
        border:     "1px solid var(--card-border)",
      }}
      aria-labelledby="negociacoes-heading"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2
            id="negociacoes-heading"
            className="text-sm font-semibold"
            style={{ color: "var(--sancho-black)" }}
          >
            Negociações — Funil Completo
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--sancho-gray-mid)" }}>
            {counts.ativos} em andamento · {counts.realizados} realizados · {counts.perdidos} perdidos
          </p>
        </div>

        {/* Tabs de filtro */}
        <div
          className="flex items-center gap-1 rounded-xl p-1 flex-wrap"
          style={{ backgroundColor: "var(--card-bg-input)", border: "1px solid var(--card-border)" }}
          role="tablist"
          aria-label="Filtrar negociações"
        >
          {TAB_LABELS.map(({ key, label }) => {
            const active = tab === key;
            const badgeColor = key === "realizados" ? "var(--sancho-won)"
                             : key === "perdidos"   ? "var(--sancho-lost)"
                             : "var(--sancho-gray-mid)";
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(key)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                style={{
                  backgroundColor: active ? "var(--card-bg)" : "transparent",
                  color:           active ? "var(--sancho-black)" : "var(--sancho-gray-mid)",
                  boxShadow:       active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {key === "realizados" && <Trophy size={11} style={{ color: badgeColor }} />}
                {key === "perdidos"   && <XCircle size={11} style={{ color: badgeColor }} />}
                {label}
                <span
                  className="text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center"
                  style={{
                    backgroundColor: active && key === "realizados" ? "rgba(16,185,129,.15)"
                                   : active && key === "perdidos"   ? "rgba(248,113,113,.15)"
                                   : "var(--card-bg-input)",
                    color: key === "realizados" ? "var(--sancho-won)"
                         : key === "perdidos"   ? "var(--sancho-lost)"
                         : "var(--sancho-gray-mid)",
                  }}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shimmer h-12 rounded-lg" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: "var(--sancho-gray-mid)" }}>
          Nenhuma negociação encontrada.
        </p>
      ) : (
        <div className="overflow-x-auto -mx-5 px-5">
          <table
            className="w-full min-w-[640px] text-sm"
            aria-label="Tabela de negociações"
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                {[
                  { key: "name"     as SortKey, label: "Negócio"      },
                  { key: null,                  label: "Contato"       },
                  { key: null,                  label: "Responsável"   },
                  { key: "stage"    as SortKey, label: "Etapa"         },
                  { key: "value"    as SortKey, label: "Valor"         },
                  { key: null,                  label: "Criado em"     },
                  { key: "daysOpen" as SortKey, label: "Dias (últ.mov.)" },
                ].map(({ key, label }) => (
                  <th
                    key={label}
                    className="text-left py-2 pr-4 text-[10.5px] font-bold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: "var(--sancho-gray-mid)" }}
                  >
                    {key ? (
                      <button
                        onClick={() => handleSort(key)}
                        className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                        aria-label={`Ordenar por ${label}`}
                      >
                        {label}
                        <SortIcon col={key} />
                      </button>
                    ) : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const rowBg = row.isWon  ? "rgba(16,185,129,.04)"
                            : row.isLost ? "rgba(248,113,113,.04)"
                            : row.isStale ? "rgba(248,113,113,.04)"
                            : undefined;
                return (
                  <tr
                    key={row.id}
                    className="border-b transition-colors"
                    style={{
                      borderColor:     "var(--card-border-subtle)",
                      backgroundColor: rowBg,
                    }}
                  >
                    <td
                      className="py-3 pr-4 font-semibold max-w-[200px] truncate"
                      style={{ color: "var(--sancho-black)" }}
                    >
                      <div className="flex items-center gap-1.5">
                        {row.isWon  && <Trophy  size={11} style={{ color: "var(--sancho-won)",  flexShrink: 0 }} />}
                        {row.isLost && <XCircle size={11} style={{ color: "var(--sancho-lost)", flexShrink: 0 }} />}
                        <span className="truncate">{row.name}</span>
                      </div>
                    </td>
                    <td
                      className="py-3 pr-4 max-w-[140px] truncate text-xs"
                      style={{ color: "var(--sancho-gray-mid)" }}
                    >
                      {row.contact}
                    </td>
                    <td
                      className="py-3 pr-4 max-w-[120px] truncate text-xs font-medium"
                      style={{ color: "var(--sancho-gray-dark)" }}
                    >
                      {row.responsible}
                    </td>
                    <td className="py-3 pr-4">
                      <StageBadge stage={row.stage} />
                    </td>
                    <td
                      className="py-3 pr-4 font-semibold whitespace-nowrap tabular-nums"
                      style={{
                        color: row.isWon ? "var(--sancho-won)"
                             : row.value > 0 ? "var(--sancho-black)"
                             : "var(--sancho-gray-mid)"
                      }}
                    >
                      {row.value > 0 ? formatBRL(row.value) : "—"}
                    </td>
                    <td
                      className="py-3 pr-4 whitespace-nowrap text-xs"
                      style={{ color: "var(--sancho-gray-mid)" }}
                    >
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="py-3">
                      {!row.isWon && !row.isLost ? (
                        <span
                          className="font-bold text-xs"
                          style={{
                            color: row.isStale
                              ? "var(--sancho-lost)"
                              : "var(--sancho-gray-mid)",
                          }}
                          title={row.isStale ? "Mais de 15 dias sem movimento" : undefined}
                        >
                          {row.daysOpen}d
                          {row.isStale && <span className="ml-1 text-[10px]">↑</span>}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--text-ghost)" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && tab === "ativos" && sorted.some((r) => r.isStale) && (
        <p className="mt-3 text-xs" style={{ color: "var(--sancho-lost)" }}>
          ↑ Negócios com fundo vermelho: mais de 15 dias sem movimento
        </p>
      )}
    </section>
  );
}
