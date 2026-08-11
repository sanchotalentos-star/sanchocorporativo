// config/metas.ts
// ─────────────────────────────────────────────────────────────────────────────
// Metas mensais e operacionais da Sancho Gestão de Carreiras
// Fonte: Framework Comercial 2026 — Metas Financeiras
//
// Meta anual: R$ 2.000.000
//   PH Santos R$500k · Marcelo Paz R$400k · Wladson Sidney R$400k
//   Projetos/Sebrae R$400k · Outros R$200k · Alexandre Pereira R$90k
//   Eduardo Gomes R$70k · Felipão R$60k · Frota R$30k · Altamir R$30k
//
// ⚠️  Valores mensais = meta anual ÷ 12. Edite via /admin → Metas
//     para ajustar mês a mês sem alterar este arquivo.
// ─────────────────────────────────────────────────────────────────────────────

export const METAS_MENSAIS = {
  // ── Eixo 2 — Palestras (PH Santos, Wladson, Eduardo, Pereira, Felipão…)
  //    Meta anual agentes de palestra: ~R$ 1.150.000 → ÷12 ≈ R$ 96.000/mês

  palestras: {
    label: "Palestras",
    metaEventos: 5,
    faturamentoEsperado: 96_000,
  },

  // ── Apresentações (Marcelo Paz)
  //    Meta anual: R$ 400.000 → ÷12 ≈ R$ 33.000/mês

  apresentacoes: {
    label: "Apresentações",
    metaEventos: 3,
    faturamentoEsperado: 33_000,
  },

  // ── Publicidades / Projetos (Sebrae + Outros + Frota + Altamir)
  //    Meta anual: R$ 630.000 → ÷12 ≈ R$ 52.000/mês

  publicidades: {
    label: "Publicidades",
    metaContratos: 4,
    faturamentoEsperado: 52_000,
  },

  // ── Consolidado geral ─────────────────────────────────────────────────────

  total: {
    /** Soma das três áreas: 96k + 33k + 52k ≈ R$ 181k/mês → R$ 2,17M/ano */
    faturamentoMeta: 181_000,
    /** 5 palestras + 3 apresentações + 4 publicidades */
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
