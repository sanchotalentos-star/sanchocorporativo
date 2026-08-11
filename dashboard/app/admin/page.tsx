"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Target, BarChart2, ArrowLeft, ImageIcon, Trophy } from "lucide-react";
import { LogoUpload }        from "./components/LogoUpload";
import { MetasEditor }       from "./components/MetasEditor";
import { MembrosEditor }     from "./components/MembrosEditor";
import { HistoricoEditor }   from "./components/HistoricoEditor";
import { ConquistasEditor }  from "./components/ConquistasEditor";

type Tab = "config" | "metas" | "membros" | "historico" | "conquistas";

const TABS: { id: Tab; label: string; icon: React.ReactNode; hint: string }[] = [
  { id: "config",     label: "Logo",       icon: <ImageIcon size={14} />, hint: "Faça upload da logo da Sancho" },
  { id: "metas",      label: "Metas",      icon: <Target    size={14} />, hint: "Defina as metas por mês" },
  { id: "membros",    label: "Membros",    icon: <Users     size={14} />, hint: "Cadastre a equipe comercial" },
  { id: "historico",  label: "Histórico",  icon: <BarChart2 size={14} />, hint: "Registre resultados reais" },
  { id: "conquistas", label: "Conquistas", icon: <Trophy    size={14} />, hint: "Progresso das metas 2026" },
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
                <div className="flex flex-col leading-none select-none" style={{ gap: 1 }}>
                  <span style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 17, fontWeight: 900, color: "var(--sancho-pink)", lineHeight: 1, letterSpacing: "-0.02em" }}>SAN</span>
                  <span style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: 17, fontWeight: 900, color: "var(--sancho-pink)", lineHeight: 1, letterSpacing: "-0.02em" }}>CHO</span>
                  <span style={{ fontSize: "5.5px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 2 }}>GESTÃO DE CARREIRA</span>
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
                  <div className="hidden sm:block text-left">
                    <div>{t.label}</div>
                    <div
                      className="text-[10px] font-normal mt-0.5 leading-tight"
                      style={{ color: tab === t.id ? "rgba(233,30,140,.6)" : "rgba(255,255,255,.2)" }}
                    >
                      {t.hint}
                    </div>
                  </div>
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
                    Logo da Sancho
                  </h2>
                  <p className="text-xs mb-5" style={{ color: "var(--sancho-gray-mid)" }}>
                    Arraste ou clique para fazer upload do arquivo PNG ou SVG.
                    Recomendado: PNG com fundo transparente, versão branca ou rosa.
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
                    Metas por Mês
                  </h2>
                  <p className="text-xs mb-5" style={{ color: "var(--sancho-gray-mid)" }}>
                    Selecione o mês e ajuste as metas de receita e cadência.
                    Salve — o dashboard reflete as alterações imediatamente.
                  </p>
                  <MetasEditor />
                </section>
              )}

              {tab === "membros" && (
                <section>
                  <h2 className="text-sm font-bold mb-1" style={{ color: "var(--sancho-black)" }}>
                    Equipe Comercial
                  </h2>
                  <p className="text-xs mb-5" style={{ color: "var(--sancho-gray-mid)" }}>
                    Adicione cada agente com o ID do RD CRM para vincular às negociações.
                    Encontre o ID em: RD Station CRM → Configurações → Usuários.
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
                    Registre os números reais de cada mês fechado — ganhos, perdidos,
                    faturamento por área e eventos realizados.
                  </p>
                  <HistoricoEditor />
                </section>
              )}

              {tab === "conquistas" && (
                <section>
                  <h2 className="text-sm font-bold mb-1" style={{ color: "var(--sancho-black)" }}>
                    Progresso das Conquistas 2026
                  </h2>
                  <p className="text-xs mb-5" style={{ color: "var(--sancho-gray-mid)" }}>
                    Atualize os contadores de metas estratégicas — novos agenciados,
                    negócios recorrentes, equipe e faturamento anual realizado.
                    Os valores aparecem no dashboard em tempo real.
                  </p>
                  <ConquistasEditor />
                </section>
              )}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
