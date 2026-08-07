"use client";

import Link from "next/link";
import { RefreshCw, Settings } from "lucide-react";
import { formatUpdateTimestamp } from "@/lib/formatters";

// ── Sancho Logo Wordmark ────────────────────────────────────────
// Fallback enquanto a logo real não está carregada do Storage.
// Replica a identidade visual real: SAN / CHO empilhados,
// "O" com pena/folha diagonal, versão rosa sobre fundo escuro.
function SanchoWordmark() {
  const pink = "var(--sancho-pink)";
  const fontStack = "'Arial Black', 'Arial Bold', Impact, 'Helvetica Neue', sans-serif";
  const letterStyle: React.CSSProperties = {
    fontFamily: fontStack,
    fontWeight: 900,
    fontSize: "22px",
    lineHeight: 1,
    letterSpacing: "-0.02em",
    color: pink,
    textTransform: "uppercase",
  };

  return (
    <div
      className="flex flex-col leading-none select-none"
      aria-label="Sancho Gestão de Carreira"
      style={{ gap: 1 }}
    >
      {/* Linha 1 — SAN */}
      <span style={letterStyle}>SAN</span>

      {/* Linha 2 — CH + O com pena */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <span style={letterStyle}>CH</span>
        {/* O com pena diagonal em SVG inline */}
        <svg
          width="22" height="22"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden="true"
          style={{ marginLeft: 0, flexShrink: 0 }}
        >
          {/* O circular */}
          <text
            x="11" y="20"
            textAnchor="middle"
            style={{
              fontFamily: fontStack,
              fontWeight: 900,
              fontSize: "22px",
            } as React.CSSProperties}
            fill={pink}
          >O</text>
          {/* Pena / folha diagonal dentro do O */}
          <line x1="7" y1="17" x2="15" y2="5"  stroke="#080808" strokeWidth="2.2" strokeLinecap="round"/>
          <line x1="7" y1="17" x2="15" y2="5"  stroke={pink}    strokeWidth="1"   strokeLinecap="round" opacity="0.5"/>
          <ellipse cx="11" cy="11" rx="2.2" ry="5.5"
            fill={pink}
            transform="rotate(-35 11 11)"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Tagline */}
      <span
        style={{
          fontFamily: "system-ui, sans-serif",
          fontWeight: 700,
          fontSize: "6.5px",
          letterSpacing: "0.20em",
          color: "rgba(255,255,255,0.40)",
          textTransform: "uppercase",
          marginTop: "3px",
        }}
      >
        GESTÃO DE CARREIRA
      </span>
    </div>
  );
}

interface HeaderProps {
  updatedAt:  string | null;
  onRefresh:  () => void;
  isLoading?: boolean;
  logoUrl?:   string | null;
}

export function Header({ updatedAt, onRefresh, isLoading = false, logoUrl }: HeaderProps) {
  const timestamp = updatedAt
    ? formatUpdateTimestamp(new Date(updatedAt))
    : "Carregando...";

  return (
    <header
      className="sticky top-0 z-30 border-b"
      style={{
        backgroundColor: "rgba(8,8,8,0.85)",
        borderBottomColor: "var(--sancho-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">

        {/* Logo — usa imagem do banco se disponível, senão mostra wordmark */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Sancho Gestão de Carreira"
            className="h-9 w-auto object-contain"
          />
        ) : (
          <SanchoWordmark />
        )}

        {/* Timestamp (desktop) — centro */}
        <span
          className="hidden sm:block text-xs"
          style={{ color: "var(--sancho-gray-mid)" }}
          aria-live="polite"
        >
          {timestamp}
        </span>

        {/* Ações */}
        <div className="flex items-center gap-2">

          {/* Admin */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              color:           "var(--sancho-gray-mid)",
              backgroundColor: "rgba(255,255,255,.05)",
              border:          "1px solid rgba(255,255,255,.08)",
            }}
            aria-label="Administrar dashboard"
            title="Logo, metas e membros"
          >
            <Settings size={13} aria-hidden="true" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: "var(--sancho-pink)",
              boxShadow: "0 0 16px rgba(233,30,140,.3)",
            }}
            aria-label="Atualizar dados do CRM"
          >
            <RefreshCw
              size={13}
              className={isLoading ? "animate-spin" : ""}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">
              {isLoading ? "Atualizando..." : "Atualizar"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile timestamp */}
      <div
        className="sm:hidden px-4 pb-2 text-xs"
        style={{ color: "var(--sancho-gray-mid)" }}
      >
        {timestamp}
      </div>
    </header>
  );
}
