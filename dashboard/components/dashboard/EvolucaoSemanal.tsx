"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { WeeklyPoint } from "@/lib/dashboard";

interface TooltipPayload {
  name:   string;
  value:  number;
  color:  string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?:  boolean;
  payload?: TooltipPayload[];
  label?:   string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white border rounded-xl px-3 py-2 shadow-card text-sm"
      style={{ borderColor: "var(--sancho-border)" }}
    >
      <p className="font-bold mb-1" style={{ color: "var(--sancho-black)" }}>
        Semana de {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "abertos" ? "Abertos" : "Ganhos"}: {p.value}
        </p>
      ))}
    </div>
  );
}

interface EvolucaoSemanalProps {
  data?:      WeeklyPoint[];
  isLoading?: boolean;
}

export function EvolucaoSemanal({ data, isLoading = false }: EvolucaoSemanalProps) {
  return (
    <section
      className="bg-white rounded-2xl p-5 shadow-card"
      aria-labelledby="evolucao-heading"
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-xs font-bold uppercase px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: "var(--sancho-pink)" }}
        >
          Tendência
        </span>
        <h2
          id="evolucao-heading"
          className="text-base font-bold"
          style={{ color: "var(--sancho-black)" }}
        >
          Evolução Semanal
        </h2>
      </div>

      {isLoading ? (
        <div className="shimmer h-56 rounded-xl" />
      ) : !data?.length ? (
        <p className="text-sm text-center py-8" style={{ color: "var(--sancho-gray-mid)" }}>
          Nenhum dado disponível
        </p>
      ) : (
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--sancho-gray-mid)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--sancho-gray-mid)" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
                formatter={(value: string) =>
                  value === "abertos" ? "Negócios Abertos" : "Negócios Ganhos"
                }
              />
              <Line
                type="monotone"
                dataKey="abertos"
                stroke="var(--sancho-pink)"
                strokeWidth={2.5}
                dot={{ fill: "var(--sancho-pink)", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="ganhos"
                stroke="var(--sancho-won)"
                strokeWidth={2.5}
                dot={{ fill: "var(--sancho-won)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
