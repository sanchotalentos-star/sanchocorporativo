"use client";

import * as React from "react";
import { ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/cn";

// ── Types ────────────────────────────────────────────────────
export type ChartConfig = {
  [key: string]: {
    label?: string;
    color?: string;
  };
};

// ── ChartContainer ────────────────────────────────────────────
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ReactElement;
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  const cssVars = Object.fromEntries(
    Object.entries(config).map(([key, val]) => [
      `--color-${key}`,
      val.color ?? "currentColor",
    ])
  ) as React.CSSProperties;

  return (
    <div className={cn("w-full", className)} style={cssVars} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

// ── ChartTooltip ──────────────────────────────────────────────
export function ChartTooltip({
  content,
  ...props
}: React.ComponentProps<typeof Tooltip>) {
  return <Tooltip content={content} {...props} />;
}

// ── ChartTooltipContent ───────────────────────────────────────
interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  config?: ChartConfig;
  formatter?: (value: number | string, name: string) => React.ReactNode;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  config,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 shadow-xl text-xs">
      {label && (
        <p className="font-semibold text-white mb-1.5">{label}</p>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((item, i) => {
          const key = String(item.dataKey ?? item.name ?? i);
          const cfgEntry = config?.[key];
          const label = cfgEntry?.label ?? item.name ?? key;
          const color = item.color ?? cfgEntry?.color ?? "var(--sancho-pink)";
          return (
            <div key={i} className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-400">{label}:</span>
              <span className="font-semibold text-white">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
