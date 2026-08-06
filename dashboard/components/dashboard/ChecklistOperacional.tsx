"use client";

import {
  Search, MessageSquare, CalendarCheck, Handshake,
  Users, FileCheck, UserPlus,
} from "lucide-react";
import { METAS_MENSAIS } from "@/config/metas";

interface CadenciaMetas {
  prospeccoes_dia?:     number;
  contatos_dia?:        number;
  agendamentos_semana?: number;
  fechamentos_semana?:  number;
  reunioes_semana?:     number;
  propostas_semana?:    number;
  novos_clientes_mes?:  number;
}

interface ChecklistOperacionalProps {
  metas?: CadenciaMetas;
}

function buildItems(metas?: CadenciaMetas) {
  const m = metas ?? {};
  return [
    {
      label: "Prospecções",
      meta:  m.prospeccoes_dia     ?? METAS_MENSAIS.operacional.prospeccoesporDia,
      unit:  "por dia",
      icon:  <Search size={15} aria-hidden="true" />,
    },
    {
      label: "Contatos WhatsApp / E-mail",
      meta:  m.contatos_dia        ?? METAS_MENSAIS.operacional.contatosDiarios,
      unit:  "por dia",
      icon:  <MessageSquare size={15} aria-hidden="true" />,
    },
    {
      label: "Agendamentos",
      meta:  m.agendamentos_semana ?? METAS_MENSAIS.operacional.agendamentosPorSemana,
      unit:  "por semana",
      icon:  <CalendarCheck size={15} aria-hidden="true" />,
    },
    {
      label: "Fechamentos",
      meta:  m.fechamentos_semana  ?? METAS_MENSAIS.operacional.fechamentosPorSemana,
      unit:  "por semana",
      icon:  <Handshake size={15} aria-hidden="true" />,
    },
    {
      label: "Reuniões Comerciais",
      meta:  m.reunioes_semana     ?? METAS_MENSAIS.operacional.reunioesComercaisPorSemana,
      unit:  "por semana",
      icon:  <Users size={15} aria-hidden="true" />,
    },
    {
      label: "Propostas Fechadas",
      meta:  m.propostas_semana    ?? METAS_MENSAIS.operacional.propostasFechadasPorSemana,
      unit:  "por semana",
      icon:  <FileCheck size={15} aria-hidden="true" />,
    },
    {
      label: "Novos Clientes",
      meta:  m.novos_clientes_mes  ?? METAS_MENSAIS.operacional.novosClientesPorMes,
      unit:  "por mês",
      icon:  <UserPlus size={15} aria-hidden="true" />,
    },
  ];
}

export function ChecklistOperacional({ metas }: ChecklistOperacionalProps = {}) {
  const items = buildItems(metas);

  return (
    <section
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border:     "1px solid rgba(255,255,255,0.07)",
      }}
      aria-labelledby="checklist-heading"
    >
      <div className="mb-5">
        <h2
          id="checklist-heading"
          className="text-sm font-semibold"
          style={{ color: "var(--sancho-black)" }}
        >
          Cadência Operacional
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--sancho-gray-mid)" }}>
          Eixo 1 do Playbook — metas de rotina
        </p>
      </div>

      <ul className="flex flex-col gap-1" role="list">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
            style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}
          >
            {/* Icon */}
            <span
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "rgba(233,30,140,.10)",
                color:           "var(--sancho-pink)",
              }}
            >
              {item.icon}
            </span>

            {/* Label */}
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-medium leading-tight truncate"
                style={{ color: "var(--sancho-gray-dark)" }}
              >
                {item.label}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--sancho-gray-mid)" }}>
                {item.unit}
              </p>
            </div>

            {/* Target number */}
            <span
              className="ml-auto text-2xl font-black flex-shrink-0 tabular-nums"
              style={{ color: "var(--sancho-pink)" }}
              aria-label={`Meta: ${item.meta} ${item.unit}`}
            >
              {item.meta}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
