"use client";

import { METAS_MENSAIS } from "@/config/metas";
import { formatBRL } from "@/lib/formatters";
import type { RevenueByArea, EventsByArea } from "@/lib/dashboard";

interface ProgressRowProps {
  label:      string;
  current:    number;
  meta:       number;
  label2:     string;
  currentVal: number;
  metaVal:    number;
  isLoading?: boolean;
}

function ProgressRow({
  label, current, meta,
  label2, currentVal, metaVal,
  isLoading,
}: ProgressRowProps) {
  const pctEvents = meta > 0 ? Math.min((current / meta) * 100, 100) : 0;
  const pctValue  = metaVal > 0 ? Math.min((currentVal / metaVal) * 100, 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-2 py-3 border-b border-sancho-border last:border-0">
        <div className="shimmer h-4 w-32 rounded" />
        <div className="shimmer h-3 rounded-full" />
        <div className="shimmer h-3 w-48 rounded" />
      </div>
    );
  }

  return (
    <div className="py-3 border-b last:border-0" style={{ borderColor: "var(--sancho-border)" }}>
      <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
        <span className="font-semibold text-sm" style={{ color: "var(--sancho-black)" }}>
          {label}
        </span>
        <span className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
          {label2}: <strong style={{ color: "var(--sancho-pink)" }}>{current}</strong> de {meta}
        </span>
      </div>

      {/* Barra eventos */}
      <div
        className="h-2 rounded-full mb-1 overflow-hidden"
        style={{ backgroundColor: "var(--sancho-border)" }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={meta}
        aria-label={`${label}: ${current} de ${meta}`}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width:           `${pctEvents}%`,
            backgroundColor: "var(--sancho-pink)",
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: "var(--sancho-gray-dark)" }}>
        <span>
          <strong style={{ color: "var(--sancho-pink)" }}>{formatBRL(currentVal)}</strong>
          {" "}de{" "}
          <span>{formatBRL(metaVal)}</span>
        </span>
        <span
          className="font-bold"
          style={{ color: pctValue >= 100 ? "var(--sancho-won)" : "var(--sancho-pink)" }}
        >
          {pctValue.toFixed(0)}%
        </span>
      </div>

      {/* Barra receita */}
      <div
        className="h-1.5 rounded-full mt-1 overflow-hidden"
        style={{ backgroundColor: "var(--sancho-border)" }}
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
            backgroundColor: pctValue >= 100 ? "var(--sancho-won)" : "var(--sancho-pink-light)",
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
      className="bg-white rounded-2xl p-5 shadow-card"
      aria-labelledby="metas-heading"
    >
      {/* Header com pill */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          {/* Bolinhas decorativas Sancho */}
          <div className="sancho-dots absolute -top-3 -right-4 opacity-60" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>
        <span
          className="text-xs font-bold uppercase px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: "var(--sancho-pink)" }}
        >
          Metas Consolidadas
        </span>
        <h2
          id="metas-heading"
          className="text-base font-bold"
          style={{ color: "var(--sancho-black)" }}
        >
          Metas Mensais
        </h2>
      </div>

      {/* Linhas por área */}
      <div>
        <ProgressRow
          label="Palestras"
          current={events?.palestras ?? 0}
          meta={METAS_MENSAIS.palestras.metaEventos}
          label2="Eventos"
          currentVal={revenue?.palestras ?? 0}
          metaVal={METAS_MENSAIS.palestras.faturamentoEsperado}
          isLoading={isLoading}
        />
        <ProgressRow
          label="Apresentações"
          current={events?.apresentacoes ?? 0}
          meta={METAS_MENSAIS.apresentacoes.metaEventos}
          label2="Eventos"
          currentVal={revenue?.apresentacoes ?? 0}
          metaVal={METAS_MENSAIS.apresentacoes.faturamentoEsperado}
          isLoading={isLoading}
        />
        <ProgressRow
          label="Publicidades"
          current={events?.publicidades ?? 0}
          meta={METAS_MENSAIS.publicidades.metaContratos}
          label2="Contratos"
          currentVal={revenue?.publicidades ?? 0}
          metaVal={METAS_MENSAIS.publicidades.faturamentoEsperado}
          isLoading={isLoading}
        />
      </div>

      {/* Consolidado */}
      {!isLoading && (
        <div
          className="mt-4 pt-4 border-t"
          style={{ borderColor: "var(--sancho-border)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-bold" style={{ color: "var(--sancho-black)" }}>
              Total Mensal
            </span>
            <span className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
              Meta: {formatBRL(METAS_MENSAIS.total.faturamentoMeta)}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div
              className="flex-1 h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--sancho-border)" }}
              role="progressbar"
              aria-valuenow={totalRevenue}
              aria-valuemin={0}
              aria-valuemax={METAS_MENSAIS.total.faturamentoMeta}
              aria-label={`Faturamento total: ${formatBRL(totalRevenue)} de ${formatBRL(METAS_MENSAIS.total.faturamentoMeta)}`}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width:           `${pctTotal}%`,
                  backgroundColor: pctTotal >= 100 ? "var(--sancho-won)" : "var(--sancho-pink)",
                }}
              />
            </div>
            <span
              className="text-sm font-extrabold min-w-[3rem] text-right"
              style={{ color: "var(--sancho-pink)" }}
            >
              {pctTotal.toFixed(0)}%
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--sancho-gray-dark)" }}>
            <strong style={{ color: "var(--sancho-pink)" }}>{formatBRL(totalRevenue)}</strong>
            {" "}de{" "}
            {formatBRL(METAS_MENSAIS.total.faturamentoMeta)} — meta mensal total
          </p>
        </div>
      )}
    </section>
  );
}
