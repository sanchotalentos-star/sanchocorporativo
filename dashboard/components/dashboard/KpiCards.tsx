"use client";

import { TrendingUp, CheckCircle, XCircle, Target } from "lucide-react";
import type { KpiData } from "@/lib/dashboard";

interface KpiCardProps {
  label:     string;
  value:     string;
  icon:      React.ReactNode;
  color:     string;
  subtitle?: string;
  isLoading?: boolean;
}

function KpiCard({ label, value, icon, color, subtitle, isLoading }: KpiCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background:   "var(--card-bg)",
        border:       "1px solid var(--card-border)",
        borderLeft:   `3px solid ${color}`,
      }}
      role="region"
      aria-label={label}
    >
      {isLoading ? (
        <>
          <div className="shimmer h-4 w-28 rounded-md" />
          <div className="shimmer h-10 w-20 rounded-md" />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--sancho-gray-mid)" }}
            >
              {label}
            </span>
            <span
              className="p-2 rounded-xl"
              style={{ backgroundColor: `${color}18` }}
              aria-hidden="true"
            >
              {icon}
            </span>
          </div>

          <div>
            <span
              className="text-4xl font-black block leading-none tracking-tight"
              style={{ color }}
            >
              {value}
            </span>
            {subtitle && (
              <span
                className="text-xs mt-1.5 block"
                style={{ color: "var(--sancho-gray-mid)" }}
              >
                {subtitle}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface KpiCardsProps {
  data?:      KpiData;
  isLoading?: boolean;
}

export function KpiCards({ data, isLoading = false }: KpiCardsProps) {
  const convStr = data
    ? `${(data.conversao * 100).toFixed(1)}%`
    : "—";

  return (
    <section aria-labelledby="kpi-heading">
      <h2 id="kpi-heading" className="sr-only">KPIs do mês</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Negócios Abertos"
          value={isLoading ? "—" : String(data?.abertos ?? 0)}
          icon={<TrendingUp size={18} style={{ color: "var(--sancho-pink)" }} />}
          color="var(--sancho-pink)"
          subtitle="em andamento no funil"
          isLoading={isLoading}
        />
        <KpiCard
          label="Negócios Ganhos"
          value={isLoading ? "—" : String(data?.ganhos ?? 0)}
          icon={<CheckCircle size={18} style={{ color: "var(--sancho-won)" }} />}
          color="var(--sancho-won)"
          subtitle="fechados no período"
          isLoading={isLoading}
        />
        <KpiCard
          label="Negócios Perdidos"
          value={isLoading ? "—" : String(data?.perdidos ?? 0)}
          icon={<XCircle size={18} style={{ color: "var(--sancho-lost)" }} />}
          color="var(--sancho-lost)"
          subtitle="ou em hold"
          isLoading={isLoading}
        />
        <KpiCard
          label="Taxa de Conversão"
          value={isLoading ? "—" : convStr}
          icon={<Target size={18} style={{ color: "var(--sancho-pink)" }} />}
          color="var(--sancho-pink)"
          subtitle="ganhos ÷ (ganhos + abertos)"
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
