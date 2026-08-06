// config/metas.ts
// ─────────────────────────────────────────────────────────────────────────────
// Metas mensais e operacionais da Sancho Gestão de Carreiras
// Fonte: Manual do Colaborador 2026
//
// ⚠️  Editável manualmente — altere os números abaixo conforme atualização
//     das metas pela diretoria. Nenhuma interface de UI altera este arquivo.
// ─────────────────────────────────────────────────────────────────────────────

export const METAS_MENSAIS = {
  // ── Eixo 2 — Palestras & Apresentações de Eventos ────────────────────────

  /** Palestras: contratos de palestrantes fechados no mês */
  palestras: {
    label: "Palestras",
    metaEventos: 4,
    faturamentoEsperado: 50_000,
  },

  /** Apresentações: contratos de apresentadores fechados no mês */
  apresentacoes: {
    label: "Apresentações",
    metaEventos: 4,
    faturamentoEsperado: 30_000,
  },

  // ── Eixo 3 — Publicidade ──────────────────────────────────────────────────

  /** Publicidades: contratos de criadores de conteúdo/publicidade fechados */
  publicidades: {
    label: "Publicidades",
    metaContratos: 4,
    faturamentoEsperado: 40_000,
  },

  // ── Consolidado geral ─────────────────────────────────────────────────────

  total: {
    /** Soma das três áreas: 50k + 30k + 40k */
    faturamentoMeta: 120_000,
    /** 4 palestras + 4 apresentações + 4 publicidades */
    entregasMeta: 12,
  },

  // ── Eixo 1 — Cadência operacional diária e semanal ───────────────────────

  operacional: {
    /** Novos contatos/leads prospectados por dia */
    prospeccoesporDia: 10,

    /** Contatos realizados via WhatsApp ou e-mail por dia */
    contatosDiarios: 5,

    /** Reuniões agendadas por semana */
    agendamentosPorSemana: 5,

    /** Negócios fechados por semana */
    fechamentosPorSemana: 3,

    /** Reuniões comerciais realizadas por semana */
    reunioesComercaisPorSemana: 5,

    /** Propostas efetivamente fechadas por semana */
    propostasFechadasPorSemana: 3,

    /** Novos clientes conquistados por mês */
    novosClientesPorMes: 2,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Tipos derivados — não alterar manualmente
// ─────────────────────────────────────────────────────────────────────────────
export type MetasMensais   = typeof METAS_MENSAIS;
export type MetaArea       = "palestras" | "apresentacoes" | "publicidades";
export type MetaOperacional = keyof typeof METAS_MENSAIS.operacional;
