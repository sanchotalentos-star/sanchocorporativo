"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { StageCount } from "@/lib/dashboard";

const chartConfig: ChartConfig = {
  count: {
    label: "Negócios",
    color: "var(--sancho-pink)",
  },
} satisfies ChartConfig;

function fmtBRL(v: number) {
  if (v >= 1_000_000) return `R$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `R$${Math.round(v / 1_000)}k`;
  return `R$${v}`;
}

// Tooltip personalizado com nome da etapa, contagem e valor
function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: StageCount }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs shadow-xl"
      style={{
        backgroundColor: "var(--card-bg)",
        border:          "1px solid var(--card-border-2)",
        color:           "var(--sancho-black)",
      }}
    >
      <div className="font-bold mb-1">{d.name}</div>
      <div style={{ color: "var(--sancho-gray-mid)" }}>
        {d.count} negócio{d.count !== 1 ? "s" : ""}
        {d.value > 0 && (
          <span style={{ color: d.isWon ? "var(--sancho-won)" : "inherit" }}>
            {" · "}{fmtBRL(d.value)}
          </span>
        )}
      </div>
      <div style={{ color: "var(--sancho-gray-mid)" }}>
        {(d.pct * 100).toFixed(1)}% do total
      </div>
    </div>
  );
}

interface PipelineChartProps {
  data?:      StageCount[];
  isLoading?: boolean;
}

export function PipelineChart({ data, isLoading = false }: PipelineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Negociações</CardTitle>
        <CardDescription>Todas as etapas — contagem e R$ por etapa</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shimmer h-8 rounded-lg" />
            ))}
          </div>
        ) : !data?.length ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--sancho-gray-mid)" }}>
            Nenhum dado disponível
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{ height: Math.max(data.length * 52, 280) }}
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 64, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke="var(--card-border)"
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--sancho-gray-mid)" }}
                allowDecimals={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={140}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--sancho-gray-dark)" }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(233,30,140,.04)" }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={30}>
                {data.map((entry, index) => {
                  const fillColor = entry.isWon  ? "#10B981"
                                  : entry.isLost ? "#F87171"
                                  : "var(--sancho-pink)";
                  // Active stages: fade by position (earlier = stronger)
                  const activeCount = data.filter((d) => !d.isWon && !d.isLost).length;
                  const activeIndex = data.filter((_, i) => i < index && !data[i].isWon && !data[i].isLost).length;
                  const opacity = entry.isWon || entry.isLost
                    ? 0.9
                    : Math.max(0.3, 1 - (activeIndex / Math.max(activeCount - 1, 1)) * 0.65);

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={fillColor}
                      fillOpacity={opacity}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}

        {/* Legenda simplificada */}
        {!isLoading && !!data?.length && (
          <div className="flex items-center gap-4 mt-3 text-[11px]" style={{ color: "var(--sancho-gray-mid)" }}>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: "var(--sancho-pink)" }} />
              Em andamento
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: "#10B981" }} />
              Realizado
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: "#F87171" }} />
              Perdido
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
