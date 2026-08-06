"use client";

import { TrendingUp, CheckCircle, XCircle, Target } from "lucide-react";
import type { KpiData } from "@/lib/dashboard";

interface KpiCardProps {
  label:    string;
  value:    string;
  icon:     React.ReactNode;
  color:    string;
  subtitle?: string;
  isLoading?: boolean;
}

function KpiCard({ label, value, icon, color, subtitle, isLoading }: KpiCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-5 card-accent-left flex flex-col gap-3 shadow-card"
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
              className="text-sm font-medium"
              style={{ color: "var(--sancho-gray-dark)" }}
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
              className="text-3xl sm:text-4xl font-extrabold block"
              style={{ color }}
            >
              {value}
            </span>
            {subtitle && (
              <span
                className="text-xs mt-1 block"
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
      <h2
        id="kpi-heading"
        className="text-lg font-bold mb-4 sr-only"
      >
        KPIs do mês
      </h2>

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
