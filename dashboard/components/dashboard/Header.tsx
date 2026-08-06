"use client";

import { RefreshCw } from "lucide-react";
import { formatUpdateTimestamp } from "@/lib/formatters";

interface HeaderProps {
  updatedAt: string | null;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function Header({ updatedAt, onRefresh, isLoading = false }: HeaderProps) {
  const timestamp = updatedAt
    ? formatUpdateTimestamp(new Date(updatedAt))
    : "Carregando...";

  return (
    <header
      className="sticky top-0 z-30 bg-white border-b-2 shadow-sm"
      style={{ borderBottomColor: "var(--sancho-pink)" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex flex-col leading-none">
          <span
            className="text-xl sm:text-2xl font-extrabold tracking-tight"
            style={{ color: "var(--sancho-black)", letterSpacing: "-0.02em" }}
          >
            SANCHO
          </span>
          <span
            className="text-[10px] sm:text-xs font-medium uppercase"
            style={{
              color:          "var(--sancho-gray-dark)",
              letterSpacing: "0.15em",
            }}
          >
            Gestão de Carreiras
          </span>
        </div>

        {/* Título central (desktop) */}
        <div className="hidden md:flex flex-col items-center">
          <h1
            className="text-base font-bold"
            style={{ color: "var(--sancho-black)" }}
          >
            Dashboard Comercial
          </h1>
          <p
            className="text-xs"
            style={{ color: "var(--sancho-gray-mid)" }}
          >
            {timestamp}
          </p>
        </div>

        {/* Botão atualizar */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all
                     disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            backgroundColor: "var(--sancho-pink)",
          }}
          aria-label="Atualizar dados do CRM"
        >
          <RefreshCw
            size={15}
            className={isLoading ? "animate-spin" : ""}
            aria-hidden="true"
          />
          <span className="hidden sm:inline">
            {isLoading ? "Atualizando..." : "Atualizar Dados"}
          </span>
        </button>
      </div>

      {/* Timestamp mobile */}
      <div
        className="md:hidden px-4 pb-2 text-xs"
        style={{ color: "var(--sancho-gray-mid)" }}
      >
        {timestamp}
      </div>
    </header>
  );
}
