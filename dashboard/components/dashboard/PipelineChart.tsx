"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import type { StageCount } from "@/lib/dashboard";

interface TooltipPayload {
  value?: number;
  payload?: {
    name:  string;
    count: number;
    pct:   number;
  };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.[0]?.payload) return null;
  const d = payload[0].payload;
  return (
    <div
      className="bg-white border rounded-xl px-3 py-2 shadow-card text-sm"
      style={{ borderColor: "var(--sancho-border)" }}
    >
      <p className="font-bold" style={{ color: "var(--sancho-black)" }}>
        {d.name}
      </p>
      <p style={{ color: "var(--sancho-pink)" }}>
        {d.count} negócios
      </p>
      <p style={{ color: "var(--sancho-gray-mid)" }}>
        {(d.pct * 100).toFixed(1)}% do total
      </p>
    </div>
  );
}

interface PipelineChartProps {
  data?:      StageCount[];
  isLoading?: boolean;
}

export function PipelineChart({ data, isLoading = false }: PipelineChartProps) {
  return (
    <section
      className="bg-white rounded-2xl p-5 shadow-card"
      aria-labelledby="pipeline-heading"
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-xs font-bold uppercase px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: "var(--sancho-pink)" }}
        >
          Pipeline
        </span>
        <h2
          id="pipeline-heading"
          className="text-base font-bold"
          style={{ color: "var(--sancho-black)" }}
        >
          Distribuição por Etapa
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shimmer h-8 rounded-lg" />
          ))}
        </div>
      ) : !data?.length ? (
        <p className="text-sm text-center py-8" style={{ color: "var(--sancho-gray-mid)" }}>
          Nenhum dado disponível
        </p>
      ) : (
        <div style={{ height: Math.max(data.length * 52, 200) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--sancho-gray-mid)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={130}
                tick={{ fontSize: 12, fill: "var(--sancho-gray-dark)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--sancho-pink-bg)" }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={36}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="var(--sancho-pink)"
                    fillOpacity={1 - index * 0.08}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
