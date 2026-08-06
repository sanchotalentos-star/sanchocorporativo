"use client";

import { RefreshCw } from "lucide-react";
import { formatUpdateTimestamp } from "@/lib/formatters";

// ── Sancho Logo ────────────────────────────────────────────────
// Reproduz o wordmark real do site sanchocorporativo.com.br:
// "SAN" / "CHO" empilhados em bold condensed + "gestão de carreira"
function SanchoWordmark() {
  return (
    <div
      className="flex flex-col leading-none select-none"
      aria-label="Sancho Gestão de Carreira"
    >
      {/* SAN / CHO empilhados — mesma proporção do site */}
      <div
        style={{
          fontFamily: "'Arial Black', 'Arial Bold', Impact, 'Helvetica Neue', sans-serif",
          fontWeight: 900,
          fontSize: "22px",
          lineHeight: 0.92,
          letterSpacing: "-0.02em",
          color: "#FFFFFF",
          textTransform: "uppercase",
        }}
      >
        <div>SAN</div>
        <div>CHO</div>
      </div>
      {/* Subtítulo */}
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          fontWeight: 600,
          fontSize: "7px",
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.40)",
          textTransform: "lowercase",
          marginTop: "3px",
        }}
      >
        gestão de carreira
      </div>
    </div>
  );
}

interface HeaderProps {
  updatedAt:  string | null;
  onRefresh:  () => void;
  isLoading?: boolean;
}

export function Header({ updatedAt, onRefresh, isLoading = false }: HeaderProps) {
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
        {/* Logo */}
        <SanchoWordmark />

        {/* Nav (desktop) */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegação">
          {["Visão Geral", "Pipeline", "Membros", "Relatórios"].map((item, i) => (
            <button
              key={item}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                color: i === 0 ? "var(--sancho-black)" : "var(--sancho-gray-mid)",
                backgroundColor: i === 0 ? "rgba(255,255,255,.06)" : "transparent",
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Timestamp (desktop) */}
          <span
            className="hidden sm:block text-xs"
            style={{ color: "var(--sancho-gray-mid)" }}
            aria-live="polite"
          >
            {timestamp}
          </span>

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
