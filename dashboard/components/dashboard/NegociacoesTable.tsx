"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Filter } from "lucide-react";
import { formatBRL, formatDate } from "@/lib/formatters";
import type { DealRow } from "@/lib/dashboard";

type SortKey   = keyof Pick<DealRow, "name" | "stage" | "value" | "daysOpen">;
type SortOrder = "asc" | "desc";

interface StageBadgeProps { stage: string }

const STAGE_COLORS: Record<string, string> = {
  "Abordado":          "#9CA3AF",
  "Respondeu":         "#60A5FA",
  "Em conversa":       "#D97706",
  "Proposta enviada":  "#7C3AED",
  "Fechado":           "#16A34A",
  "Pós-evento":        "#0EA5E9",
  "Reativação":        "#E91E8C",
};

function StageBadge({ stage }: StageBadgeProps) {
  const color = STAGE_COLORS[stage] ?? "var(--sancho-gray-mid)";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color }}
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
  const [sortKey,    setSortKey]    = useState<SortKey>("daysOpen");
  const [sortOrder,  setSortOrder]  = useState<SortOrder>("desc");
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
      className="bg-white rounded-2xl p-5 shadow-card"
      aria-labelledby="negociacoes-heading"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-bold uppercase px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: "var(--sancho-pink)" }}
          >
            Pipeline Ativo
          </span>
          <h2
            id="negociacoes-heading"
            className="text-base font-bold"
            style={{ color: "var(--sancho-black)" }}
          >
            Negociações em Andamento
          </h2>
        </div>

        {/* Filtro de etapa */}
        {stages.length > 0 && (
          <label className="flex items-center gap-2 text-sm" style={{ color: "var(--sancho-gray-dark)" }}>
            <Filter size={14} aria-hidden="true" />
            <span className="sr-only">Filtrar por etapa</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--sancho-border)",
                color:       "var(--sancho-gray-dark)",
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
          <table className="w-full min-w-[640px] text-sm" aria-label="Tabela de negociações ativas">
            <thead>
              <tr style={{ borderBottom: `2px solid var(--sancho-border)` }}>
                {[
                  { key: "name"     as SortKey, label: "Negócio"     },
                  { key: null,                  label: "Contato"      },
                  { key: "stage"    as SortKey, label: "Etapa"        },
                  { key: "value"    as SortKey, label: "Valor"        },
                  { key: null,                  label: "Criado em"    },
                  { key: "daysOpen" as SortKey, label: "Dias aberto"  },
                ].map(({ key, label }) => (
                  <th
                    key={label}
                    className="text-left py-2 pr-4 font-semibold whitespace-nowrap"
                    style={{ color: "var(--sancho-gray-dark)" }}
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
                  className="border-b transition-colors hover:bg-gray-50"
                  style={{
                    borderColor:     "var(--sancho-border)",
                    backgroundColor: row.isStale ? "#FEF2F2" : undefined,
                  }}
                >
                  <td className="py-3 pr-4 font-medium max-w-[200px] truncate" style={{ color: "var(--sancho-black)" }}>
                    {row.name}
                  </td>
                  <td className="py-3 pr-4 max-w-[140px] truncate" style={{ color: "var(--sancho-gray-dark)" }}>
                    {row.contact}
                  </td>
                  <td className="py-3 pr-4">
                    <StageBadge stage={row.stage} />
                  </td>
                  <td className="py-3 pr-4 font-semibold whitespace-nowrap" style={{ color: "var(--sancho-black)" }}>
                    {row.value > 0 ? formatBRL(row.value) : "—"}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap" style={{ color: "var(--sancho-gray-mid)" }}>
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="py-3">
                    <span
                      className="font-bold"
                      style={{ color: row.isStale ? "var(--sancho-lost)" : "var(--sancho-gray-dark)" }}
                      title={row.isStale ? "Mais de 15 dias sem movimento" : undefined}
                    >
                      {row.daysOpen}d
                      {row.isStale && (
                        <span className="ml-1 text-xs" aria-label="Alerta: mais de 15 dias sem movimento">
                          ⚠️
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legenda stale */}
      {!isLoading && sorted.some((r) => r.isStale) && (
        <p className="mt-3 text-xs" style={{ color: "var(--sancho-lost)" }}>
          ⚠️ Linhas em vermelho = mais de 15 dias sem movimento
        </p>
      )}
    </section>
  );
}
