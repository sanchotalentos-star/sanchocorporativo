"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
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
import type { WeeklyPoint } from "@/lib/dashboard";

const chartConfig: ChartConfig = {
  abertos: {
    label: "Negócios Abertos",
    color: "var(--sancho-pink)",
  },
  ganhos: {
    label: "Negócios Ganhos",
    color: "var(--sancho-won)",
  },
} satisfies ChartConfig;

interface EvolucaoSemanalProps {
  data?:      WeeklyPoint[];
  isLoading?: boolean;
}

export function EvolucaoSemanal({ data, isLoading = false }: EvolucaoSemanalProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Semanal</CardTitle>
        <CardDescription>Negócios abertos vs ganhos — últimas semanas</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="shimmer h-56 rounded-xl" />
        ) : !data?.length ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--sancho-gray-mid)" }}>
            Nenhum dado disponível
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-60 w-full">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradAbertos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--sancho-pink)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--sancho-pink)" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gradGanhos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--sancho-won)" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="var(--sancho-won)" stopOpacity={0}    />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "var(--sancho-gray-mid)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={6}
                tick={{ fontSize: 11, fill: "var(--sancho-gray-mid)" }}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent config={chartConfig} />} />

              <Area
                type="monotone"
                dataKey="abertos"
                stroke="var(--sancho-pink)"
                strokeWidth={2}
                fill="url(#gradAbertos)"
                dot={{ fill: "var(--sancho-pink)", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "var(--sancho-pink)", strokeWidth: 2, stroke: "#080808" }}
              />
              <Area
                type="monotone"
                dataKey="ganhos"
                stroke="var(--sancho-won)"
                strokeWidth={2}
                fill="url(#gradGanhos)"
                dot={{ fill: "var(--sancho-won)", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "var(--sancho-won)", strokeWidth: 2, stroke: "#080808" }}
              />
            </AreaChart>
          </ChartContainer>
        )}

        {/* Legend */}
        {!isLoading && !!data?.length && (
          <div className="flex items-center gap-5 mt-3 justify-end">
            {[
              { color: "var(--sancho-pink)", label: "Abertos" },
              { color: "var(--sancho-won)",  label: "Ganhos"  },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-4 h-0.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
