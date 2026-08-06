"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Header }               from "@/components/dashboard/Header";
import { KpiCards }             from "@/components/dashboard/KpiCards";
import { MetasMensais }         from "@/components/dashboard/MetasMensais";
import { ChecklistOperacional } from "@/components/dashboard/ChecklistOperacional";
import { PipelineChart }        from "@/components/dashboard/PipelineChart";
import { EvolucaoSemanal }      from "@/components/dashboard/EvolucaoSemanal";
import { NegociacoesTable }     from "@/components/dashboard/NegociacoesTable";
import type { KpiData, StageCount, WeeklyPoint, DealRow, RevenueByArea, EventsByArea } from "@/lib/dashboard";

interface DbMetas {
  palestras_eventos?:      number;
  palestras_valor?:        number;
  apresentacoes_eventos?:  number;
  apresentacoes_valor?:    number;
  publicidades_contratos?: number;
  publicidades_valor?:     number;
  prospeccoes_dia?:        number;
  contatos_dia?:           number;
  agendamentos_semana?:    number;
  fechamentos_semana?:     number;
  reunioes_semana?:        number;
  propostas_semana?:       number;
  novos_clientes_mes?:     number;
}

interface DashboardData {
  kpis:       KpiData;
  pipeline:   StageCount[];
  weekly:     WeeklyPoint[];
  deals:      DealRow[];
  revenue:    RevenueByArea;
  events:     EventsByArea;
  stages:     string[];
  updatedAt:  string;
  isMock?:    boolean;
}

// Builds "2026-08" for the current month
function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// Builds "Agosto 2026" for the current month
function currentMonthLabel() {
  return new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default function DashboardPage() {
  const [data,        setData]        = useState<DashboardData | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [stageFilter, setStageFilter] = useState("all");
  const [logoUrl,     setLogoUrl]     = useState<string | null>(null);
  const [dbMetas,     setDbMetas]     = useState<DbMetas | null>(null);

  // Load config (logo) and metas once on mount — these change rarely
  useEffect(() => {
    void fetch("/api/config")
      .then((r) => r.json())
      .then((d: { logo_url?: string | null }) => { if (d.logo_url) setLogoUrl(d.logo_url); })
      .catch(() => null);

    void fetch(`/api/metas/${currentMonthKey()}`)
      .then((r) => r.json())
      .then((d: DbMetas) => { setDbMetas(d); })
      .catch(() => null);
  }, []);

  const fetchData = useCallback(async (filter?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter && filter !== "all") params.set("stage", filter);

      const res = await fetch(`/api/rd-crm?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json: DashboardData = await res.json() as DashboardData;
      setData(json);

      if (json.isMock) {
        toast.info("Exibindo dados de exemplo — configure RDCRM_TOKEN para dados reais", {
          icon: <AlertCircle size={16} />,
          duration: 6000,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar dados";
      toast.error(`Falha ao conectar ao CRM: ${msg}`, {
        icon: <AlertCircle size={16} />,
        duration: 8000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  void setStageFilter;

  return (
    <>
      {/* ── Background — dark + pink glow (21st.dev pattern) ── */}
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: "#080808" }}
        aria-hidden="true"
      >
        {/* Pink radial glow at the top */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(233,30,140,0.18), transparent)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="min-h-screen">
        {/* Fixed header */}
        <Header
          updatedAt={data?.updatedAt ?? null}
          onRefresh={() => void fetchData(stageFilter)}
          isLoading={loading}
          logoUrl={logoUrl}
        />

        {/* Main content */}
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

          {/* Page title */}
          <div className="flex items-end justify-between flex-wrap gap-3 pt-1">
            <div>
              <h1 className="text-lg font-bold" style={{ color: "var(--sancho-black)" }}>
                Dashboard Comercial
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--sancho-gray-mid)" }}>
                {currentMonthLabel()} · RD Station CRM
              </p>
            </div>
            <div
              className="flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-1.5 border"
              style={{
                color:           "var(--sancho-won)",
                backgroundColor: "rgba(16,185,129,.08)",
                borderColor:     "rgba(16,185,129,.2)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--sancho-won)" }}
              />
              Dados ao vivo
            </div>
          </div>

          {/* Mock indicator */}
          {data?.isMock && (
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium border"
              style={{
                backgroundColor: "rgba(251,191,36,.06)",
                borderColor:     "rgba(251,191,36,.2)",
                color:           "#FBBF24",
              }}
              role="alert"
            >
              <AlertCircle size={14} aria-hidden="true" />
              Dados de demonstração — conecte ao RD Station CRM configurando{" "}
              <code
                className="font-mono text-[10px] px-1 rounded"
                style={{ backgroundColor: "rgba(255,255,255,.08)" }}
              >
                RDCRM_TOKEN
              </code>
            </div>
          )}

          {/* KPI cards */}
          <KpiCards data={data?.kpis} isLoading={loading} />

          {/* Metas + Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <MetasMensais
              revenue={data?.revenue}
              events={data?.events}
              dbMetas={dbMetas ?? undefined}
              mesLabel={currentMonthLabel()}
              isLoading={loading}
            />
            <ChecklistOperacional metas={dbMetas ?? undefined} />
          </div>

          {/* Pipeline + Evolução */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <PipelineChart data={data?.pipeline} isLoading={loading} />
            <EvolucaoSemanal data={data?.weekly} isLoading={loading} />
          </div>

          {/* Deals table */}
          <NegociacoesTable
            data={data?.deals}
            stages={data?.stages}
            isLoading={loading}
          />
        </main>

        {/* Footer */}
        <footer
          className="mt-12 py-5 border-t text-center text-xs"
          style={{
            borderColor: "rgba(255,255,255,.06)",
            color:       "var(--sancho-gray-mid)",
          }}
        >
          <p>Sancho Gestão de Carreiras — Dashboard Comercial &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">
            Dados via{" "}
            <a
              href="https://crm.rdstation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "var(--sancho-pink)" }}
            >
              RD Station CRM
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
