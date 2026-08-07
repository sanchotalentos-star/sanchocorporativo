"use client";

import Link from "next/link";
import { RefreshCw, Settings } from "lucide-react";
import { formatUpdateTimestamp } from "@/lib/formatters";

// ── Sancho Logo Wordmark ────────────────────────────────────────
// SVG inline que replica a identidade real da Sancho:
// SAN / CHO empilhados, "O" com pena diagonal, rosa vibrante.
// Só aparece quando não há logo salva no banco.
function SanchoWordmark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 108"
      width="80"
      height="54"
      aria-label="Sancho Gestão de Carreira"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* ── SAN ── */}
      <text
        x="2" y="52"
        fontFamily="var(--font-sancho-logo), 'Arial Black', Impact, sans-serif"
        fontSize="56"
        fill="#E91E8C"
        letterSpacing="-1"
      >SAN</text>

      {/* ── CHO (sem o O, para sobrepor pena) ── */}
      <text
        x="2" y="104"
        fontFamily="var(--font-sancho-logo), 'Arial Black', Impact, sans-serif"
        fontSize="56"
        fill="#E91E8C"
        letterSpacing="-1"
      >CHO</text>

      {/* ── Pena / folha dentro do O ──
           O está aprox. x=103..158, y=53..104
           Centro aprox: 130, 79  raio H≈27 raio V≈25  */}
      {/* Elipse da pena rotacionada -38° */}
      <ellipse
        cx="130" cy="79"
        rx="8" ry="21"
        fill="#080808"
        transform="rotate(-38 130 79)"
      />
      {/* Nervura central da pena */}
      <line
        x1="117" y1="95"
        x2="143" y2="63"
        stroke="#E91E8C"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* ── GESTÃO DE CARREIRA ── */}
      <text
        x="2" y="114"
        fontFamily="system-ui, sans-serif"
        fontSize="7"
        fontWeight="700"
        fill="rgba(255,255,255,0.38)"
        letterSpacing="2.5"
      >GESTÃO DE CARREIRA</text>
    </svg>
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
