"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

interface HistoricoData {
  mes:                       string;
  ganhos:                    number;
  perdidos:                  number;
  faturamento_palestras:     number;
  faturamento_apresentacoes: number;
  faturamento_publicidades:  number;
  eventos_palestras:         number;
  eventos_apresentacoes:     number;
  contratos_publicidades:    number;
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function buildMonthOptions() {
  const options = [];
  const now = new Date();
  for (let i = 0; i <= 11; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    options.push({ value, label });
  }
  return options;
}

const EMPTY: Omit<HistoricoData, "mes"> = {
  ganhos: 0, perdidos: 0,
  faturamento_palestras: 0, faturamento_apresentacoes: 0, faturamento_publicidades: 0,
  eventos_palestras: 0, eventos_apresentacoes: 0, contratos_publicidades: 0,
};

function NumField({
  label, value, onChange, prefix,
}: {
  label:    string;
  value:    number;
  onChange: (v: number) => void;
  prefix?:  string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b"
         style={{ borderColor: "rgba(255,255,255,.05)" }}>
      <span className="text-xs" style={{ color: "var(--sancho-gray-dark)" }}>{label}</span>
      <div className="flex items-center gap-1.5">
        {prefix && <span className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>{prefix}</span>}
        <input
          type="number"
          min={0}
          step={prefix === "R$" ? 1000 : 1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-28 rounded-lg px-2 py-1 text-xs text-right font-semibold focus:outline-none focus-visible:ring-1 focus-visible:ring-pink-500"
          style={{
            backgroundColor: "rgba(255,255,255,.07)",
            border:          "1px solid rgba(255,255,255,.10)",
            color:           "var(--sancho-black)",
          }}
        />
      </div>
    </div>
  );
}

export function HistoricoEditor() {
  const monthOptions = buildMonthOptions();
  const [selectedMes, setSelectedMes] = useState(monthOptions[0].value);
  const [data,        setData]        = useState<Omit<HistoricoData, "mes">>(EMPTY);
  const [loading,     setLoading]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => { void loadHistorico(selectedMes); }, [selectedMes]);

  async function loadHistorico(mes: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/historico/${mes}`);
      if (res.ok) {
        const json = await res.json() as HistoricoData | null;
        setData(json ? { ...EMPTY, ...json } : EMPTY);
      }
    } catch {
      setData(EMPTY);
    } finally {
      setLoading(false);
    }
  }

  function set(key: keyof typeof EMPTY, val: number) {
    setData((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/historico/${selectedMes}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erro ao salvar histórico");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
        Registre aqui o resultado real de cada mês para acompanhar a evolução histórica.
      </p>

      {/* Seletor de mês */}
      <select
        value={selectedMes}
        onChange={(e) => setSelectedMes(e.target.value)}
        className="rounded-xl px-3 py-2.5 text-sm font-medium appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
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

      {loading ? (
        <div className="flex items-center gap-2 py-4" style={{ color: "var(--sancho-gray-mid)" }}>
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs">Carregando...</span>
        </div>
      ) : (
        <>
          <div className="rounded-xl overflow-hidden"
               style={{ border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }}>
            <div className="px-4 py-1">
              <p className="text-xs font-bold uppercase tracking-wider py-3"
                 style={{ color: "var(--sancho-gray-mid)" }}>Negócios</p>
              <NumField label="Ganhos"   value={data.ganhos}   onChange={(v) => set("ganhos",   v)} />
              <NumField label="Perdidos" value={data.perdidos} onChange={(v) => set("perdidos", v)} />

              <p className="text-xs font-bold uppercase tracking-wider pt-4 pb-2"
                 style={{ color: "var(--sancho-gray-mid)" }}>Receita</p>
              <NumField label="Palestras"     value={data.faturamento_palestras}     onChange={(v) => set("faturamento_palestras", v)}     prefix="R$" />
              <NumField label="Apresentações" value={data.faturamento_apresentacoes} onChange={(v) => set("faturamento_apresentacoes", v)} prefix="R$" />
              <NumField label="Publicidades"  value={data.faturamento_publicidades}  onChange={(v) => set("faturamento_publicidades", v)}  prefix="R$" />

              <p className="text-xs font-bold uppercase tracking-wider pt-4 pb-2"
                 style={{ color: "var(--sancho-gray-mid)" }}>Eventos realizados</p>
              <NumField label="Palestras realizadas"      value={data.eventos_palestras}     onChange={(v) => set("eventos_palestras", v)} />
              <NumField label="Apresentações realizadas"  value={data.eventos_apresentacoes} onChange={(v) => set("eventos_apresentacoes", v)} />
              <NumField label="Contratos de publicidade"  value={data.contratos_publicidades} onChange={(v) => set("contratos_publicidades", v)} />
            </div>
          </div>

          {error && <p className="text-xs" style={{ color: "var(--sancho-lost)" }}>{error}</p>}

          <button
            onClick={() => void handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--sancho-pink)", boxShadow: "0 0 16px rgba(233,30,140,.3)" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Salvando..." : saved ? "✓ Salvo" : "Salvar resultado"}
          </button>
        </>
      )}
    </div>
  );
}
