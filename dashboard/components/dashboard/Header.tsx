"use client";

import { RefreshCw } from "lucide-react";
import { formatUpdateTimestamp } from "@/lib/formatters";

// ── Sancho Logo ────────────────────────────────────────────────
// Approximates the brand wordmark: bold condensed SANCHO + pen-in-O mark
function SanchoWordmark({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2.5">
        {/* Icon mark */}
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: 30,
            height: 30,
            background: "var(--sancho-pink)",
          }}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 14L5 11L11 5L13 3L14 2L14 4L8 10L5 13L3 14L2 14Z" fill="white"/>
            <path d="M11 2L14 5L12.5 6.5L9.5 3.5L11 2Z" fill="white" fillOpacity=".7"/>
          </svg>
        </div>
        {/* Text */}
        <div className="flex flex-col leading-none">
          <span
            className="font-black tracking-tight text-white"
            style={{ fontSize: 17, letterSpacing: "-0.03em" }}
          >
            SANCHO
          </span>
          <span
            className="font-semibold uppercase tracking-widest text-white/40"
            style={{ fontSize: 7.5, letterSpacing: "0.2em" }}
          >
            Gestão de Carreira
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Full SVG logo approximation */}
      <svg
        width="140"
        height="44"
        viewBox="0 0 140 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Sancho Gestão de Carreira"
      >
        {/* SANCHO wordmark — each letter as a rounded-rect placeholder */}
        {/* We render this as text with a pseudo-black weight */}
        <text
          x="0" y="30"
          fontFamily="-apple-system,'Arial Black','Helvetica Neue',sans-serif"
          fontWeight="900"
          fontSize="32"
          fill="#E91E8C"
          letterSpacing="-1.5"
        >
          SANCHO
        </text>
        {/* Pen mark inside the O — small diagonal slash */}
        <line x1="118" y1="9" x2="126" y2="29" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Subtitle */}
        <text
          x="1" y="43"
          fontFamily="-apple-system,'Helvetica Neue',sans-serif"
          fontWeight="700"
          fontSize="7"
          fill="rgba(255,255,255,0.35)"
          letterSpacing="2.5"
        >
          GESTÃO DE CARREIRA
        </text>
      </svg>
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
        <SanchoWordmark compact />

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
