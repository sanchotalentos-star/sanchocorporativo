"use client";

import { METAS_MENSAIS } from "@/config/metas";
import { formatBRL } from "@/lib/formatters";
import type { RevenueByArea, EventsByArea } from "@/lib/dashboard";

const AREA_COLORS = ["#E91E8C", "#C084FC", "#60A5FA"] as const;

interface ProgressRowProps {
  label:      string;
  current:    number;
  meta:       number;
  label2:     string;
  currentVal: number;
  metaVal:    number;
  color:      string;
  isLoading?: boolean;
}

function ProgressRow({
  label, current, meta,
  label2, currentVal, metaVal,
  color, isLoading,
}: ProgressRowProps) {
  const pctEvents = meta > 0 ? Math.min((current / meta) * 100, 100) : 0;
  const pctValue  = metaVal > 0 ? Math.min((currentVal / metaVal) * 100, 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-2 py-3 border-b last:border-0" style={{ borderColor: "var(--sancho-border)" }}>
        <div className="shimmer h-4 w-32 rounded" />
        <div className="shimmer h-2 rounded-full" />
        <div className="shimmer h-3 w-48 rounded" />
      </div>
    );
  }

  return (
    <div className="py-3 border-b last:border-0" style={{ borderColor: "var(--sancho-border)" }}>
      <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-0.5 h-4 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          <span className="font-semibold text-sm" style={{ color: "var(--sancho-black)" }}>
            {label}
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
          {label2}: <strong style={{ color }}>{current}</strong> / {meta}
        </span>
      </div>

      {/* Events bar */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,.06)" }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={meta}
        aria-label={`${label}: ${current} de ${meta}`}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pctEvents}%`, backgroundColor: color }}
        />
      </div>

      {/* Revenue row */}
      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
        <span>
          <strong style={{ color }}>{formatBRL(currentVal)}</strong>
          {" de "}
          <span>{formatBRL(metaVal)}</span>
        </span>
        <span
          className="font-bold"
          style={{ color: pctValue >= 100 ? "var(--sancho-won)" : color }}
        >
          {pctValue.toFixed(0)}%
        </span>
      </div>

      {/* Revenue bar */}
      <div
        className="h-1 rounded-full overflow-hidden mt-1"
        style={{ backgroundColor: "rgba(255,255,255,.06)" }}
        role="progressbar"
        aria-valuenow={currentVal}
        aria-valuemin={0}
        aria-valuemax={metaVal}
        aria-label={`Receita ${label}: ${formatBRL(currentVal)} de ${formatBRL(metaVal)}`}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width:           `${pctValue}%`,
            backgroundColor: pctValue >= 100 ? "var(--sancho-won)" : `${color}90`,
          }}
        />
      </div>
    </div>
  );
}

interface MetasMensaisProps {
  revenue?:   RevenueByArea;
  events?:    EventsByArea;
  isLoading?: boolean;
}

export function MetasMensais({ revenue, events, isLoading = false }: MetasMensaisProps) {
  const totalRevenue = revenue
    ? revenue.palestras + revenue.apresentacoes + revenue.publicidades
    : 0;

  const pctTotal = METAS_MENSAIS.total.faturamentoMeta > 0
    ? Math.min((totalRevenue / METAS_MENSAIS.total.faturamentoMeta) * 100, 100)
    : 0;

  return (
    <section
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border:     "1px solid rgba(255,255,255,0.07)",
      }}
      aria-labelledby="metas-heading"
    >
      <div className="mb-5">
        <h2
          id="metas-heading"
          className="text-sm font-semibold"
          style={{ color: "var(--sancho-black)" }}
        >
          Metas Mensais
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--sancho-gray-mid)" }}>
          Agosto 2026 — meta total: {formatBRL(METAS_MENSAIS.total.faturamentoMeta)}
        </p>
      </div>

      <div>
        <ProgressRow
          label="Palestras"
          current={events?.palestras ?? 0}
          meta={METAS_MENSAIS.palestras.metaEventos}
          label2="Eventos"
          currentVal={revenue?.palestras ?? 0}
          metaVal={METAS_MENSAIS.palestras.faturamentoEsperado}
          color={AREA_COLORS[0]}
          isLoading={isLoading}
        />
        <ProgressRow
          label="Apresentações"
          current={events?.apresentacoes ?? 0}
          meta={METAS_MENSAIS.apresentacoes.metaEventos}
          label2="Eventos"
          currentVal={revenue?.apresentacoes ?? 0}
          metaVal={METAS_MENSAIS.apresentacoes.faturamentoEsperado}
          color={AREA_COLORS[1]}
          isLoading={isLoading}
        />
        <ProgressRow
          label="Publicidades"
          current={events?.publicidades ?? 0}
          meta={METAS_MENSAIS.publicidades.metaContratos}
          label2="Contratos"
          currentVal={revenue?.publicidades ?? 0}
          metaVal={METAS_MENSAIS.publicidades.faturamentoEsperado}
          color={AREA_COLORS[2]}
          isLoading={isLoading}
        />
      </div>

      {/* Consolidated total */}
      {!isLoading && (
        <div
          className="mt-4 pt-4 border-t"
          style={{ borderColor: "var(--sancho-border)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <span className="text-xs font-bold" style={{ color: "var(--sancho-black)" }}>
              Total Mensal
            </span>
            <span className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
              Meta: {formatBRL(METAS_MENSAIS.total.faturamentoMeta)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 h-2.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(255,255,255,.06)" }}
              role="progressbar"
              aria-valuenow={totalRevenue}
              aria-valuemin={0}
              aria-valuemax={METAS_MENSAIS.total.faturamentoMeta}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width:           `${pctTotal}%`,
                  backgroundColor: pctTotal >= 100 ? "var(--sancho-won)" : "var(--sancho-pink)",
                  boxShadow:       `0 0 12px ${pctTotal >= 100 ? "rgba(16,185,129,.4)" : "rgba(233,30,140,.4)"}`,
                }}
              />
            </div>
            <span
              className="text-sm font-extrabold min-w-[3rem] text-right"
              style={{ color: pctTotal >= 100 ? "var(--sancho-won)" : "var(--sancho-pink)" }}
            >
              {pctTotal.toFixed(0)}%
            </span>
          </div>
          <p className="text-xs mt-1.5" style={{ color: "var(--sancho-gray-mid)" }}>
            <strong style={{ color: "var(--sancho-pink)" }}>{formatBRL(totalRevenue)}</strong>
            {" de "}
            {formatBRL(METAS_MENSAIS.total.faturamentoMeta)}
          </p>
        </div>
      )}
    </section>
  );
}
