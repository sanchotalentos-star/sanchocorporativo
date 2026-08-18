"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Filter } from "lucide-react";
import { formatBRL, formatDate } from "@/lib/formatters";
import type { DealRow } from "@/lib/dashboard";

type SortKey   = keyof Pick<DealRow, "name" | "stage" | "value" | "daysOpen">;
type SortOrder = "asc" | "desc";

const STAGE_STYLES: Record<string, { color: string; bg: string }> = {
  "Abordado":          { color: "#94A3B8", bg: "rgba(148,163,184,.12)" },
  "Respondeu":         { color: "#60A5FA", bg: "rgba(96,165,250,.12)"  },
  "Em conversa":       { color: "#FBBF24", bg: "rgba(251,191,36,.10)"  },
  "Proposta enviada":  { color: "#C084FC", bg: "rgba(192,132,252,.12)" },
  "Fechado":           { color: "#10B981", bg: "rgba(16,185,129,.12)"  },
  "Pós-evento":        { color: "#38BDF8", bg: "rgba(56,189,248,.10)"  },
  "Reativação":        { color: "#E91E8C", bg: "rgba(233,30,140,.12)"  },
};

function StageBadge({ stage }: { stage: string }) {
  const s = STAGE_STYLES[stage] ?? { color: "#94A3B8", bg: "rgba(148,163,184,.12)" };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold"
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

export function NegociacoesTable({ data = [], stages = [], isLoading = false }: NegociacoesTableProps) {
  const [sortKey,     setSortKey]     = useState<SortKey>("daysOpen");
  const [sortOrder,   setSortOrder]   = useState<SortOrder>("desc");
  const [stageFilter, setStageFilter] = useState<string>("all");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filtered = stageFilter === "all"
    ? data
    : data.filter((r) => r.stage === stageFilter);

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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2
            id="negociacoes-heading"
            className="text-sm font-semibold"
            style={{ color: "var(--sancho-black)" }}
          >
            Negociações em Andamento
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--sancho-gray-mid)" }}>
            {sorted.length} negócios ativos no funil
          </p>
        </div>

        {stages.length > 0 && (
          <label
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--sancho-gray-mid)" }}
          >
            <Filter size={13} aria-hidden="true" />
            <span className="sr-only">Filtrar por etapa</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="rounded-lg px-2 py-1 text-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-pink-500"
              style={{
                backgroundColor: "var(--card-bg-input)",
                border:          "1px solid var(--card-border)",
                color:           "var(--sancho-gray-dark)",
              }}
              aria-label="Filtrar por etapa do funil"
            >
              <option value="all">Todas as etapas</option>
              {stages.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        )}
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
          Nenhuma negociação ativa encontrada.
        </p>
      ) : (
        <div className="overflow-x-auto -mx-5 px-5">
          <table
            className="w-full min-w-[640px] text-sm"
            aria-label="Tabela de negociações ativas"
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                {[
                  { key: "name"     as SortKey, label: "Negócio"    },
                  { key: null,                  label: "Contato"      },
                  { key: null,                  label: "Responsável"  },
                  { key: "stage"    as SortKey, label: "Etapa"        },
                  { key: "value"    as SortKey, label: "Valor"       },
                  { key: null,                  label: "Criado em"   },
                  { key: "daysOpen" as SortKey, label: "Dias aberto" },
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
              {sorted.map((row) => (
                <tr
                  key={row.id}
                  className="border-b transition-colors"
                  style={{
                    borderColor:     "var(--card-border-subtle)",
                    backgroundColor: row.isStale
                      ? "rgba(248,113,113,.04)"
                      : undefined,
                  }}
                >
                  <td
                    className="py-3 pr-4 font-semibold max-w-[200px] truncate"
                    style={{ color: "var(--sancho-black)" }}
                  >
                    {row.name}
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
                    style={{ color: "var(--sancho-black)" }}
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
                      {row.isStale && (
                        <span className="ml-1 text-[10px]" aria-label="Alerta">↑</span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && sorted.some((r) => r.isStale) && (
        <p className="mt-3 text-xs" style={{ color: "var(--sancho-lost)" }}>
          ↑ Linhas com fundo: mais de 15 dias sem movimento
        </p>
      )}
    </section>
  );
}
