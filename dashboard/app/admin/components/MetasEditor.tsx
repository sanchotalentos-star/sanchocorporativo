"use client";

import { useState, useEffect } from "react";
import { Save, ChevronDown, Loader2 } from "lucide-react";
import { formatBRL } from "@/lib/formatters";

interface MetasData {
  mes:                    string;
  palestras_eventos:      number;
  palestras_valor:        number;
  apresentacoes_eventos:  number;
  apresentacoes_valor:    number;
  publicidades_contratos: number;
  publicidades_valor:     number;
  prospeccoes_dia:        number;
  contatos_dia:           number;
  agendamentos_semana:    number;
  fechamentos_semana:     number;
  reunioes_semana:        number;
  propostas_semana:       number;
  novos_clientes_mes:     number;
  isDefault?:             boolean;
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function buildMonthOptions(): { value: string; label: string }[] {
  const options = [];
  const now = new Date();
  // 6 meses para trás + mês atual + 3 meses para frente
  for (let i = -6; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    options.push({ value, label });
  }
  return options.reverse();
}

function FieldRow({
  label, fieldKey, value, onChange, prefix, suffix, isFloat,
}: {
  label:    string;
  fieldKey: keyof MetasData;
  value:    number;
  onChange: (key: keyof MetasData, val: number) => void;
  prefix?:  string;
  suffix?:  string;
  isFloat?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b"
         style={{ borderColor: "rgba(255,255,255,.05)" }}>
      <label
        htmlFor={fieldKey}
        className="text-xs font-medium flex-1"
        style={{ color: "var(--sancho-gray-dark)" }}
      >
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        {prefix && (
          <span className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>{prefix}</span>
        )}
        <input
          id={fieldKey}
          type="number"
          value={value}
          min={0}
          step={isFloat ? 1000 : 1}
          onChange={(e) => onChange(fieldKey, isFloat ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0)}
          className="w-24 rounded-lg px-2 py-1 text-xs text-right font-semibold focus:outline-none focus-visible:ring-1 focus-visible:ring-pink-500"
          style={{
            backgroundColor: "rgba(255,255,255,.07)",
            border:          "1px solid rgba(255,255,255,.10)",
            color:           "var(--sancho-black)",
          }}
        />
        {suffix && (
          <span className="text-xs w-16" style={{ color: "var(--sancho-gray-mid)" }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

export function MetasEditor() {
  const monthOptions = buildMonthOptions();
  const now = new Date();
  const currentMes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [selectedMes, setSelectedMes] = useState(currentMes);
  const [metas,       setMetas]       = useState<MetasData | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => {
    void loadMetas(selectedMes);
  }, [selectedMes]);

  async function loadMetas(mes: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/metas/${mes}`);
      const data = await res.json() as MetasData;
      setMetas(data);
    } catch {
      setError("Erro ao carregar metas");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(key: keyof MetasData, val: number) {
    setMetas((prev) => prev ? { ...prev, [key]: val } : prev);
    setSaved(false);
  }

  async function handleSave() {
    if (!metas) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/metas/${selectedMes}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(metas),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erro ao salvar metas");
    } finally {
      setSaving(false);
    }
  }

  const totalMeta = metas
    ? metas.palestras_valor + metas.apresentacoes_valor + metas.publicidades_valor
    : 0;

  return (
    <div className="space-y-5">
      {/* Seletor de mês */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <select
            value={selectedMes}
            onChange={(e) => setSelectedMes(e.target.value)}
            className="w-full appearance-none rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            style={{
              backgroundColor: "rgba(255,255,255,.06)",
              border:          "1px solid rgba(255,255,255,.12)",
              color:           "var(--sancho-black)",
            }}
          >
            {monthOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--sancho-gray-mid)" }}
          />
        </div>

        {metas?.isDefault && (
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: "rgba(251,191,36,.08)",
              color:           "var(--sancho-pending)",
            }}
          >
            Usando valores padrão
          </span>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-4" style={{ color: "var(--sancho-gray-mid)" }}>
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs">Carregando...</span>
        </div>
      )}

      {!loading && metas && (
        <>
          {/* Metas de receita */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: "var(--sancho-gray-mid)" }}>
              Metas de Receita
            </h3>
            <div className="rounded-xl overflow-hidden"
                 style={{ border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }}>
              <div className="px-4">
                <FieldRow label="Palestras — eventos" fieldKey="palestras_eventos"
                  value={metas.palestras_eventos} onChange={handleChange} suffix="eventos" />
                <FieldRow label="Palestras — valor esperado" fieldKey="palestras_valor"
                  value={metas.palestras_valor} onChange={handleChange} prefix="R$" isFloat />
                <FieldRow label="Apresentações — eventos" fieldKey="apresentacoes_eventos"
                  value={metas.apresentacoes_eventos} onChange={handleChange} suffix="eventos" />
                <FieldRow label="Apresentações — valor esperado" fieldKey="apresentacoes_valor"
                  value={metas.apresentacoes_valor} onChange={handleChange} prefix="R$" isFloat />
                <FieldRow label="Publicidades — contratos" fieldKey="publicidades_contratos"
                  value={metas.publicidades_contratos} onChange={handleChange} suffix="contratos" />
                <FieldRow label="Publicidades — valor esperado" fieldKey="publicidades_valor"
                  value={metas.publicidades_valor} onChange={handleChange} prefix="R$" isFloat />
              </div>
              <div className="px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,.07)" }}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span style={{ color: "var(--sancho-gray-mid)" }}>Meta total mensal</span>
                  <span style={{ color: "var(--sancho-pink)" }}>{formatBRL(totalMeta)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cadência operacional */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: "var(--sancho-gray-mid)" }}>
              Cadência Operacional (Eixo 1)
            </h3>
            <div className="rounded-xl overflow-hidden px-4"
                 style={{ border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }}>
              <FieldRow label="Prospecções" fieldKey="prospeccoes_dia"
                value={metas.prospeccoes_dia} onChange={handleChange} suffix="/dia" />
              <FieldRow label="Contatos (WhatsApp / E-mail)" fieldKey="contatos_dia"
                value={metas.contatos_dia} onChange={handleChange} suffix="/dia" />
              <FieldRow label="Agendamentos" fieldKey="agendamentos_semana"
                value={metas.agendamentos_semana} onChange={handleChange} suffix="/semana" />
              <FieldRow label="Fechamentos" fieldKey="fechamentos_semana"
                value={metas.fechamentos_semana} onChange={handleChange} suffix="/semana" />
              <FieldRow label="Reuniões Comerciais" fieldKey="reunioes_semana"
                value={metas.reunioes_semana} onChange={handleChange} suffix="/semana" />
              <FieldRow label="Propostas Fechadas" fieldKey="propostas_semana"
                value={metas.propostas_semana} onChange={handleChange} suffix="/semana" />
              <FieldRow label="Novos Clientes" fieldKey="novos_clientes_mes"
                value={metas.novos_clientes_mes} onChange={handleChange} suffix="/mês" />
            </div>
          </div>

          {error && (
            <p className="text-xs" style={{ color: "var(--sancho-lost)" }}>{error}</p>
          )}

          <button
            onClick={() => void handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all disabled:opacity-50"
            style={{
              backgroundColor: "var(--sancho-pink)",
              boxShadow:       "0 0 16px rgba(233,30,140,.3)",
            }}
          >
            {saving
              ? <Loader2 size={14} className="animate-spin" />
              : <Save size={14} />
            }
            {saving ? "Salvando..." : saved ? "✓ Salvo" : "Salvar metas"}
          </button>
        </>
      )}
    </div>
  );
}
