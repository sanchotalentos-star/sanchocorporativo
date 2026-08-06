"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, Users, Target, BarChart2, ArrowLeft } from "lucide-react";
import { LogoUpload }      from "./components/LogoUpload";
import { MetasEditor }     from "./components/MetasEditor";
import { MembrosEditor }   from "./components/MembrosEditor";
import { HistoricoEditor } from "./components/HistoricoEditor";

type Tab = "config" | "metas" | "membros" | "historico";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "config",    label: "Logo & Empresa",      icon: <Settings size={14} /> },
  { id: "metas",     label: "Metas Mensais",        icon: <Target   size={14} /> },
  { id: "membros",   label: "Membros da Equipe",    icon: <Users    size={14} /> },
  { id: "historico", label: "Histórico Real",        icon: <BarChart2 size={14} /> },
];

export default function AdminPage() {
  const [tab,      setTab]      = useState<Tab>("config");
  const [logoUrl,  setLogoUrl]  = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/config")
      .then((r) => r.json())
      .then((d: { logo_url?: string | null }) => {
        if (d.logo_url) setLogoUrl(d.logo_url);
      })
      .catch(() => null);
  }, []);

  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: "#080808" }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(233,30,140,0.14), transparent)",
          }}
        />
      </div>

      <div className="min-h-screen">
        {/* Header */}
        <header
          className="sticky top-0 z-30 border-b"
          style={{
            backgroundColor:   "rgba(8,8,8,0.88)",
            borderBottomColor: "rgba(255,255,255,.07)",
            backdropFilter:    "blur(20px)",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            {/* Logo + título */}
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Sancho" className="h-8 w-auto object-contain" />
              ) : (
                <div
                  className="flex flex-col leading-none select-none"
                  style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}
                >
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: .9 }}>SAN</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: .9 }}>CHO</span>
                </div>
              )}
              <div>
                <h1 className="text-sm font-bold" style={{ color: "var(--sancho-black)" }}>
                  Administração
                </h1>
                <p className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
                  Dashboard Comercial
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-80"
              style={{ color: "var(--sancho-gray-mid)" }}
            >
              <ArrowLeft size={13} />
              Voltar ao dashboard
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">

            {/* Sidebar de navegação */}
            <nav className="flex flex-row md:flex-col gap-1" aria-label="Seções do admin">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-colors w-full"
                  style={{
                    backgroundColor: tab === t.id
                      ? "rgba(233,30,140,.12)"
                      : "transparent",
                    color: tab === t.id
                      ? "var(--sancho-pink)"
                      : "var(--sancho-gray-mid)",
                    border: tab === t.id
                      ? "1px solid rgba(233,30,140,.2)"
                      : "1px solid transparent",
                  }}
                  aria-current={tab === t.id ? "page" : undefined}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </nav>

            {/* Painel principal */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border:     "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {tab === "config" && (
                <section>
                  <h2 className="text-sm font-bold mb-1" style={{ color: "var(--sancho-black)" }}>
                    Logo da Empresa
                  </h2>
                  <p className="text-xs mb-5" style={{ color: "var(--sancho-gray-mid)" }}>
                    Faça upload do arquivo PNG, JPG ou SVG da logo da Sancho.
                    Ela aparecerá no cabeçalho do dashboard.
                  </p>
                  <LogoUpload
                    currentUrl={logoUrl}
                    onSaved={(url) => setLogoUrl(url)}
                  />
                </section>
              )}

              {tab === "metas" && (
                <section>
                  <h2 className="text-sm font-bold mb-1" style={{ color: "var(--sancho-black)" }}>
                    Metas Mensais
                  </h2>
                  <p className="text-xs mb-5" style={{ color: "var(--sancho-gray-mid)" }}>
                    Defina as metas de receita e cadência para cada mês.
                    Selecione o mês para editar ou ver meses anteriores.
                  </p>
                  <MetasEditor />
                </section>
              )}

              {tab === "membros" && (
                <section>
                  <h2 className="text-sm font-bold mb-1" style={{ color: "var(--sancho-black)" }}>
                    Membros da Equipe
                  </h2>
                  <p className="text-xs mb-5" style={{ color: "var(--sancho-gray-mid)" }}>
                    Cadastre os agentes comerciais. O ID no RD CRM vincula cada membro
                    às negociações na tabela do dashboard.
                  </p>
                  <MembrosEditor />
                </section>
              )}

              {tab === "historico" && (
                <section>
                  <h2 className="text-sm font-bold mb-1" style={{ color: "var(--sancho-black)" }}>
                    Histórico de Resultados
                  </h2>
                  <p className="text-xs mb-5" style={{ color: "var(--sancho-gray-mid)" }}>
                    Registre os resultados reais de cada mês para comparar
                    com as metas e acompanhar a evolução ao longo do tempo.
                  </p>
                  <HistoricoEditor />
                </section>
              )}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
