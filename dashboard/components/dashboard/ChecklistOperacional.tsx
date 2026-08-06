"use client";

import {
  Search, MessageSquare, CalendarCheck, Handshake,
  Users, FileCheck, UserPlus,
} from "lucide-react";
import { METAS_MENSAIS } from "@/config/metas";

interface ChecklistItem {
  label:  string;
  meta:   number;
  unit:   string;
  icon:   React.ReactNode;
}

const items: ChecklistItem[] = [
  {
    label: "Prospecções",
    meta:  METAS_MENSAIS.operacional.prospeccoesporDia,
    unit:  "por dia",
    icon:  <Search size={16} aria-hidden="true" />,
  },
  {
    label: "Contatos WhatsApp / E-mail",
    meta:  METAS_MENSAIS.operacional.contatosDiarios,
    unit:  "por dia",
    icon:  <MessageSquare size={16} aria-hidden="true" />,
  },
  {
    label: "Agendamentos",
    meta:  METAS_MENSAIS.operacional.agendamentosPorSemana,
    unit:  "por semana",
    icon:  <CalendarCheck size={16} aria-hidden="true" />,
  },
  {
    label: "Fechamentos",
    meta:  METAS_MENSAIS.operacional.fechamentosPorSemana,
    unit:  "por semana",
    icon:  <Handshake size={16} aria-hidden="true" />,
  },
  {
    label: "Reuniões Comerciais",
    meta:  METAS_MENSAIS.operacional.reunioesComercaisPorSemana,
    unit:  "por semana",
    icon:  <Users size={16} aria-hidden="true" />,
  },
  {
    label: "Propostas Fechadas",
    meta:  METAS_MENSAIS.operacional.propostasFechadasPorSemana,
    unit:  "por semana",
    icon:  <FileCheck size={16} aria-hidden="true" />,
  },
  {
    label: "Novos Clientes",
    meta:  METAS_MENSAIS.operacional.novosClientesPorMes,
    unit:  "por mês",
    icon:  <UserPlus size={16} aria-hidden="true" />,
  },
];

export function ChecklistOperacional() {
  return (
    <section
      className="bg-white rounded-2xl p-5 shadow-card"
      aria-labelledby="checklist-heading"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-xs font-bold uppercase px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: "var(--sancho-pink)" }}
        >
          Eixo 1 — Operacional
        </span>
        <h2
          id="checklist-heading"
          className="text-base font-bold"
          style={{ color: "var(--sancho-black)" }}
        >
          Cadência Diária
        </h2>
      </div>

      {/* Grid */}
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        role="list"
      >
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors"
            style={{ borderColor: "var(--sancho-border)" }}
          >
            <span
              className="flex-shrink-0 p-2 rounded-lg"
              style={{ backgroundColor: "var(--sancho-pink-bg)" }}
            >
              <span style={{ color: "var(--sancho-pink)" }}>
                {item.icon}
              </span>
            </span>

            <div className="min-w-0">
              <p
                className="text-sm font-medium leading-tight truncate"
                style={{ color: "var(--sancho-gray-dark)" }}
              >
                {item.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--sancho-gray-mid)" }}>
                {item.unit}
              </p>
            </div>

            <span
              className="ml-auto text-2xl font-extrabold flex-shrink-0"
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
