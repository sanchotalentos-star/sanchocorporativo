"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, UserCircle } from "lucide-react";
import type { MembroRow } from "@/lib/supabase-types";

interface FormState {
  nome:       string;
  email:      string;
  funcao:     string;
  rd_user_id: string;
  foto_url:   string;
}

const EMPTY_FORM: FormState = {
  nome:       "",
  email:      "",
  funcao:     "",
  rd_user_id: "",
  foto_url:   "",
};

function MembroModal({
  membro,
  onClose,
  onSaved,
}: {
  membro?: MembroRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form,    setForm]    = useState<FormState>(
    membro
      ? {
          nome:       membro.nome,
          email:      membro.email      ?? "",
          funcao:     membro.funcao     ?? "",
          rd_user_id: membro.rd_user_id ?? "",
          foto_url:   membro.foto_url   ?? "",
        }
      : EMPTY_FORM
  );
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  async function handleSave() {
    if (!form.nome.trim()) { setError("Nome é obrigatório"); return; }
    setSaving(true);
    setError("");
    try {
      const payload = {
        nome:       form.nome.trim(),
        email:      form.email.trim()      || null,
        funcao:     form.funcao.trim()     || null,
        rd_user_id: form.rd_user_id.trim() || null,
        foto_url:   form.foto_url.trim()   || null,
      };
      const res = membro
        ? await fetch(`/api/membros/${membro.id}`, {
            method:  "PUT",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
          })
        : await fetch("/api/membros", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
          });

      if (!res.ok) throw new Error("Erro ao salvar");
      onSaved();
    } catch {
      setError("Erro ao salvar membro");
    } finally {
      setSaving(false);
    }
  }

  function Field({
    label, field, placeholder, type = "text",
  }: {
    label:       string;
    field:       keyof FormState;
    placeholder: string;
    type?:       string;
  }) {
    return (
      <div className="space-y-1">
        <label className="text-xs font-semibold" style={{ color: "var(--sancho-gray-mid)" }}>
          {label}
        </label>
        <input
          type={type}
          value={form[field]}
          placeholder={placeholder}
          onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
          className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-pink-500"
          style={{
            backgroundColor: "rgba(255,255,255,.07)",
            border:          "1px solid rgba(255,255,255,.10)",
            color:           "var(--sancho-black)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{
          background:  "rgba(18,18,18,1)",
          border:      "1px solid rgba(255,255,255,.12)",
          boxShadow:   "0 24px 64px rgba(0,0,0,.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold" style={{ color: "var(--sancho-black)" }}>
            {membro ? "Editar membro" : "Novo membro"}
          </h3>
          <button onClick={onClose} aria-label="Fechar">
            <X size={16} style={{ color: "var(--sancho-gray-mid)" }} />
          </button>
        </div>

        <Field label="Nome *"           field="nome"       placeholder="Nome completo" />
        <Field label="Função / Cargo"   field="funcao"     placeholder="Ex: Closer, SDR, Gerente Comercial" />
        <Field label="E-mail"           field="email"      placeholder="email@exemplo.com" type="email" />
        <Field label="ID no RD CRM"     field="rd_user_id" placeholder="Cole o _id do usuário no RD Station" />
        <Field label="URL da foto"      field="foto_url"   placeholder="https://... (opcional)" />

        <p className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
          O <strong>ID no RD CRM</strong> vincula este membro às negociações na tabela do dashboard.
          Encontre em RD Station CRM → Configurações → Usuários.
        </p>

        {error && <p className="text-xs" style={{ color: "var(--sancho-lost)" }}>{error}</p>}

        <button
          onClick={() => void handleSave()}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold text-white disabled:opacity-50"
          style={{
            backgroundColor: "var(--sancho-pink)",
            boxShadow:       "0 0 16px rgba(233,30,140,.25)",
          }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Salvando..." : membro ? "Salvar alterações" : "Adicionar membro"}
        </button>
      </div>
    </div>
  );
}

export function MembrosEditor() {
  const [membros,  setMembros]  = useState<MembroRow[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState<"new" | MembroRow | null>(null);

  async function loadMembros() {
    setLoading(true);
    try {
      const res = await fetch("/api/membros");
      const data = await res.json() as MembroRow[];
      setMembros(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadMembros(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Remover este membro?")) return;
    await fetch(`/api/membros/${id}`, { method: "DELETE" });
    void loadMembros();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "var(--sancho-gray-mid)" }}>
          {membros.length} {membros.length === 1 ? "membro cadastrado" : "membros cadastrados"}
        </p>
        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: "var(--sancho-pink)" }}
        >
          <Plus size={13} /> Novo membro
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-4" style={{ color: "var(--sancho-gray-mid)" }}>
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs">Carregando...</span>
        </div>
      ) : membros.length === 0 ? (
        <div
          className="rounded-2xl py-10 text-center"
          style={{ border: "1px dashed rgba(255,255,255,.10)" }}
        >
          <UserCircle size={32} className="mx-auto mb-3" style={{ color: "var(--sancho-gray-mid)" }} />
          <p className="text-sm" style={{ color: "var(--sancho-gray-mid)" }}>
            Nenhum membro cadastrado
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--sancho-gray-mid)" }}>
            Adicione os agentes responsáveis pelas negociações do CRM
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {membros.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background:  "rgba(255,255,255,.03)",
                border:      "1px solid rgba(255,255,255,.07)",
              }}
            >
              {/* Avatar */}
              {m.foto_url ? (
                <img
                  src={m.foto_url}
                  alt={m.nome}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{
                    background: "rgba(233,30,140,.15)",
                    color:      "var(--sancho-pink)",
                  }}
                >
                  {m.nome.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--sancho-black)" }}>
                  {m.nome}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--sancho-gray-mid)" }}>
                  {m.funcao ?? "—"} {m.rd_user_id ? `· ID: ${m.rd_user_id.slice(0, 8)}…` : "· Sem ID no CRM"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setModal(m)}
                  className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                  style={{ color: "var(--sancho-gray-mid)" }}
                  aria-label="Editar"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => void handleDelete(m.id)}
                  className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                  style={{ color: "var(--sancho-lost)" }}
                  aria-label="Remover"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <MembroModal
          membro={modal === "new" ? undefined : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); void loadMembros(); }}
        />
      )}
    </div>
  );
}
