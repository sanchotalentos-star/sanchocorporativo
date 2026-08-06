"use client";

import Link from "next/link";
import { RefreshCw, Settings } from "lucide-react";
import { formatUpdateTimestamp } from "@/lib/formatters";

// ── Sancho Logo Wordmark ────────────────────────────────────────
// Fallback enquanto a logo real não está carregada do Storage.
// Usa a versão rosa (sobre fundo escuro do dashboard).
// Formato: "SANCHO" numa linha + "GESTÃO DE CARREIRA" abaixo.
function SanchoWordmark() {
  return (
    <div
      className="flex flex-col leading-none select-none"
      aria-label="Sancho Gestão de Carreira"
    >
      <span
        style={{
          fontFamily: "'Arial Black', 'Arial Bold', Impact, 'Helvetica Neue', sans-serif",
          fontWeight: 900,
          fontSize: "26px",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: "var(--sancho-pink)",
          textTransform: "uppercase",
        }}
      >
        SANCHO
      </span>
      <span
        style={{
          fontFamily: "system-ui, sans-serif",
          fontWeight: 700,
          fontSize: "7px",
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.45)",
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
