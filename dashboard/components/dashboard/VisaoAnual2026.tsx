"use client";

// ── Visão Anual 2026 ──────────────────────────────────────────────────────────
// Tabela mês-a-mês: meta mensal, realizado, % e barra de progresso
// + cabeçalho com meta macro R$2M e YTD acumulado

import { useEffect, useState } from "react";
import { CalendarDays, TrendingUp } from "lucide-react";
import type { VisaoAnualData, MesRow } from "@/app/api/visao-anual/route";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(v: number) {
  if (v >= 1_000_000)
    return `R$ ${(v / 1_000_000).toLocaleString("pt-BR", { minimumFractionDigits: 1 })}M`;
  if (v >= 1_000)
    return `R$ ${(v / 1_000).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}k`;
  return `R$ ${v.toLocaleString("pt-BR")}`;
}

function pct(v: number, t: number) {
  return t > 0 ? Math.min(100, (v / t) * 100) : 0;
}

// ── Linha de mês ──────────────────────────────────────────────────────────────

function MesLinha({ row, acumulado, metaAnual }: { row: MesRow; acumulado: number; metaAnual: number }) {
  const p     = pct(row.realizado, row.meta);
  const done  = row.realizado >= row.meta && !row.isFuture && row.realizado > 0;
  const color = done
    ? "#10B981"
    : row.isCurrent
    ? "var(--sancho-pink)"
    : row.isFuture
    ? "rgba(255,255,255,0.12)"
    : "#3B82F6";

  const textColor = row.isFuture
    ? "rgba(255,255,255,0.25)"
    : "var(--sancho-black)";

  const acumPct = pct(acumulado, metaAnual);

  return (
    <tr
      style={{
        backgroundColor: row.isCurrent ? "rgba(233,30,140,0.05)" : "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Mês */}
      <td className="py-2 pl-4 pr-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          {row.isCurrent && (
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
              style={{ backgroundColor: "var(--sancho-pink)" }}
            />
          )}
          <span
            className="text-xs font-semibold"
            style={{ color: row.isCurrent ? "var(--sancho-pink)" : textColor }}
          >
            {row.label}
          </span>
        </div>
      </td>

      {/* Meta mensal */}
      <td className="py-2 px-3 text-right whitespace-nowrap">
        <span className="text-xs tabular-nums" style={{ color: "rgba(255,255,255,0.4)" }}>
          {fmt(row.meta)}
        </span>
      </td>

      {/* Realizado */}
      <td className="py-2 px-3 text-right whitespace-nowrap">
        <span
          className="text-xs font-bold tabular-nums"
          style={{ color: row.isFuture ? "rgba(255,255,255,0.15)" : textColor }}
        >
          {row.isFuture ? "—" : fmt(row.realizado)}
        </span>
      </td>

      {/* Barra + % */}
      <td className="py-2 px-3 w-28 min-w-[7rem]">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-1">
            <div
              className="flex-1 rounded-full overflow-hidden"
              style={{ height: 4, backgroundColor: "rgba(255,255,255,0.07)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${p}%`, backgroundColor: color }}
              />
            </div>
            <span
              className="text-[10px] tabular-nums w-9 text-right flex-shrink-0"
              style={{ color: row.isFuture ? "rgba(255,255,255,0.15)" : color }}
            >
              {row.isFuture ? "" : `${p.toFixed(0)}%`}
            </span>
          </div>
        </div>
      </td>

      {/* Acumulado YTD */}
      <td className="py-2 pl-3 pr-4 text-right whitespace-nowrap">
        {!row.isFuture && (
          <div className="space-y-0.5">
            <div className="text-xs tabular-nums" style={{ color: textColor }}>
              {fmt(acumulado)}
            </div>
            <div className="text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.25)" }}>
              {acumPct.toFixed(1)}% do ano
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

const EMPTY: VisaoAnualData = {
  ano: 2026, meta_anual: 2_000_000, ytd: 0, ytd_pct: 0, meses: [],
};

export function VisaoAnual2026() {
  const [data,    setData]    = useState<VisaoAnualData>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/visao-anual")
      .then((r) => r.json())
      .then((d: VisaoAnualData) => setData(d))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  // Calcula acumulado progressivo por linha
  const linhas: { row: MesRow; acumulado: number }[] = [];
  let acc = 0;
  for (const row of data.meses) {
    if (!row.isFuture) acc += row.realizado;
    linhas.push({ row, acumulado: acc });
  }

  const metaMensal = data.meses[0]?.meta ?? 181_000;
  const metaTotal  = metaMensal * 12;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border:     "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between gap-4 flex-wrap"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <CalendarDays size={13} style={{ color: "var(--sancho-pink)" }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--sancho-pink)" }}
            >
              Expansão · 2026
            </span>
          </div>
          <h2 className="text-base font-bold" style={{ color: "var(--sancho-black)" }}>
            Meta vs Realizado — Mês a Mês
          </h2>
        </div>

        {/* KPIs de cabeçalho */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-right">
            <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Meta macro</div>
            <div className="text-base font-black" style={{ color: "var(--sancho-pink)" }}>R$ 2M</div>
          </div>
          <div className="text-right">
            <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Meta mensal</div>
            <div className="text-base font-black" style={{ color: "var(--sancho-black)" }}>
              {loading ? "—" : fmt(metaMensal)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>YTD realizado</div>
            <div
              className="text-base font-black"
              style={{ color: data.ytd_pct >= 100 ? "#10B981" : "var(--sancho-black)" }}
            >
              {loading ? "—" : fmt(data.ytd)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>% do ano</div>
            <div
              className="text-base font-black"
              style={{ color: data.ytd_pct >= 50 ? "#10B981" : "var(--sancho-pink)" }}
            >
              {loading ? "—" : `${data.ytd_pct.toFixed(1)}%`}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabela mensal ── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <th className="py-2 pl-4 pr-3 text-left">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Mês
                </span>
              </th>
              <th className="py-2 px-3 text-right">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Meta
                </span>
              </th>
              <th className="py-2 px-3 text-right">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Realizado
                </span>
              </th>
              <th className="py-2 px-3 text-left">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Progresso
                </span>
              </th>
              <th className="py-2 pl-3 pr-4 text-right">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Acumulado YTD
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {[...Array(5)].map((__, j) => (
                      <td key={j} className="py-2.5 px-3">
                        <div
                          className="h-3 rounded animate-pulse"
                          style={{ backgroundColor: "rgba(255,255,255,0.06)", width: j === 0 ? 24 : 64 }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : linhas.map(({ row, acumulado }) => (
                  <MesLinha key={row.mes} row={row} acumulado={acumulado} metaAnual={data.meta_anual} />
                ))
            }
          </tbody>

          {/* Totais */}
          {!loading && (
            <tfoot>
              <tr style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                <td className="py-3 pl-4 pr-3">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={11} style={{ color: "var(--sancho-pink)" }} />
                    <span className="text-xs font-bold" style={{ color: "var(--sancho-black)" }}>
                      Total 2026
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="text-xs font-bold tabular-nums" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {fmt(metaTotal)}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="text-xs font-bold tabular-nums" style={{ color: "var(--sancho-pink)" }}>
                    {fmt(data.ytd)}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 rounded-full overflow-hidden"
                      style={{ height: 5, backgroundColor: "rgba(255,255,255,0.07)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${data.ytd_pct}%`,
                          background: "linear-gradient(90deg, var(--sancho-pink), #FF6EB4)",
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold" style={{ color: "var(--sancho-pink)" }}>
                      {data.ytd_pct.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="py-3 pl-3 pr-4 text-right">
                  <span className="text-xs font-bold tabular-nums" style={{ color: "var(--sancho-black)" }}>
                    Meta: {fmt(data.meta_anual)}
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Nota de edição */}
      <div
        className="px-5 py-3 border-t text-[10px]"
        style={{ borderColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.2)" }}
      >
        Registre os valores realizados em{" "}
        <a href="/admin" style={{ color: "var(--sancho-pink)" }} className="underline hover:opacity-80">
          Admin → Histórico
        </a>{" "}
        · As metas mensais são configuradas em{" "}
        <a href="/admin" style={{ color: "var(--sancho-pink)" }} className="underline hover:opacity-80">
          Admin → Metas
        </a>
      </div>
    </div>
  );
}
