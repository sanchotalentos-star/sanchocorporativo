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

export default function DashboardPage() {
  const [data,      setData]      = useState<DashboardData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [stageFilter, setStageFilter] = useState("all");

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

  // stageFilter state kept for future filter wiring
  void setStageFilter;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--sancho-bg)" }}>
      {/* Header fixo */}
      <Header
        updatedAt={data?.updatedAt ?? null}
        onRefresh={() => void fetchData(stageFilter)}
        isLoading={loading}
      />

      {/* Conteúdo principal */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Mock indicator */}
        {data?.isMock && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ backgroundColor: "var(--sancho-pink-bg)", color: "var(--sancho-pink)" }}
            role="alert"
          >
            <AlertCircle size={15} aria-hidden="true" />
            Dados de demonstração — conecte ao RD Station CRM configurando{" "}
            <code className="font-mono text-xs bg-white px-1 rounded">RDCRM_TOKEN</code>
          </div>
        )}

        {/* Bloco 1 — KPIs */}
        <KpiCards data={data?.kpis} isLoading={loading} />

        {/* Bloco 2 + 5 — Metas e Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetasMensais
            revenue={data?.revenue}
            events={data?.events}
            isLoading={loading}
          />
          <ChecklistOperacional />
        </div>

        {/* Bloco 3 + 4 — Pipeline e Evolução Semanal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PipelineChart data={data?.pipeline} isLoading={loading} />
          <EvolucaoSemanal data={data?.weekly} isLoading={loading} />
        </div>

        {/* Bloco 6 — Tabela de negociações */}
        <NegociacoesTable
          data={data?.deals}
          stages={data?.stages}
          isLoading={loading}
        />
      </main>

      {/* Footer */}
      <footer
        className="mt-12 py-6 border-t text-center text-xs"
        style={{ borderColor: "var(--sancho-border)", color: "var(--sancho-gray-mid)" }}
      >
        <p>
          Sancho Gestão de Carreiras — Dashboard Comercial &copy; {new Date().getFullYear()}
        </p>
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
  );
}
