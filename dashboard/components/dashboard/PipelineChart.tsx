"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { StageCount } from "@/lib/dashboard";

const chartConfig: ChartConfig = {
  count: {
    label: "Negócios",
    color: "var(--sancho-pink)",
  },
} satisfies ChartConfig;

interface PipelineChartProps {
  data?:      StageCount[];
  isLoading?: boolean;
}

export function PipelineChart({ data, isLoading = false }: PipelineChartProps) {
  // Funnel opacity: strongest for first stage, fades toward bottom
  const opacities = [1, 0.85, 0.7, 0.56, 0.44, 0.34, 0.26];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Etapa</CardTitle>
        <CardDescription>Negócios ativos no funil de vendas</CardDescription>
      </CardHeader>
      <CardContent>
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
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{ height: Math.max(data.length * 48, 220) }}
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 36, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
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
                width={130}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--sancho-gray-dark)" }}
              />
              <ChartTooltip
                content={<ChartTooltipContent config={chartConfig} />}
                cursor={{ fill: "rgba(233,30,140,.05)" }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={32}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="var(--sancho-pink)"
                    fillOpacity={opacities[index] ?? 0.26}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
