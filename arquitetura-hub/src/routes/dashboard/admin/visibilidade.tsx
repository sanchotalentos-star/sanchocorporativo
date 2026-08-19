import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Mic2, Globe, Key, Eye, Calendar, Plus, Trash2, X, Check, TrendingUp,
  Users, ChevronDown,
} from 'lucide-react'
import type { AcaoTipo, VisibilityAction } from '@/routes/dashboard/membro/visibilidade'
import { VIS_KEY } from '@/routes/dashboard/membro/visibilidade'

export const Route = createFileRoute('/dashboard/admin/visibilidade')({
  component: AdminVisibilidadePage,
})

/* ─────────────────────────────────────────────
   KNOWN MEMBERS  (mirrors AuthContext MOCK_USERS + mockMembers)
───────────────────────────────────────────── */
const KNOWN_MEMBERS = [
  { id: 'member-1', name: 'Ana Lima',      email: 'demo@membro.com'             },
  { id: 'member-3', name: 'Vitor Braga',   email: 'vitorlvbraga@gmail.com'      },
  { id: 'member-4', name: 'Rodrigo Cunha', email: 'rodrigocunhapro@gmail.com'   },
]

/* ─────────────────────────────────────────────
   TIPO CONFIG
───────────────────────────────────────────── */
const tipoConfig: Record<AcaoTipo, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  palco:           { label: 'Palco',           icon: <Mic2 size={14} />, color: '#7B2FBE', bg: 'rgba(123,47,190,0.10)'  },
  relacao_publica: { label: 'Relação Pública', icon: <Globe size={14} />, color: '#0EA5E9', bg: 'rgba(14,165,233,0.10)'  },
  acesso:          { label: 'Acesso',          icon: <Key size={14} />,  color: '#C5A880', bg: 'rgba(197,168,128,0.12)' },
  exposicao:       { label: 'Exposição',       icon: <Eye size={14} />,  color: '#10B981', bg: 'rgba(16,185,129,0.10)'  },
}

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const D = {
  bg:      '#F8F7F5',
  card:    '#FFFFFF',
  border:  'rgba(0,0,0,0.07)',
  text:    '#1C1A17',
  textMid: '#3A3530',
  textSub: '#75716B',
  gold:    '#C5A880',
  goldBg:  'rgba(197,168,128,0.08)',
  input:   {
    bg:     '#F8F7F5',
    border: 'rgba(0,0,0,0.12)',
    focus:  '#C5A880',
  },
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function safeJson<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback }
  catch { return fallback }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

/* ─────────────────────────────────────────────
   FORM STATE
───────────────────────────────────────────── */
interface FormState {
  tipo: AcaoTipo
  titulo: string
  descricao: string
  data: string
  plataforma: string
  alcance_estimado: string
  link_evidencia: string
}

const emptyForm = (): FormState => ({
  tipo: 'palco',
  titulo: '',
  descricao: '',
  data: new Date().toISOString().slice(0, 10),
  plataforma: '',
  alcance_estimado: '',
  link_evidencia: '',
})

/* ─────────────────────────────────────────────
   FIELD COMPONENT
───────────────────────────────────────────── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: D.textSub, marginBottom: 5,
      }}>
        {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 11px',
  fontSize: 13, color: D.text,
  background: D.input.bg,
  border: `1px solid ${D.input.border}`,
  borderRadius: 6, outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
function AdminVisibilidadePage() {
  const [selectedMemberId, setSelectedMemberId] = useState(KNOWN_MEMBERS[0].id)
  const [actions, setActions]                   = useState<VisibilityAction[]>([])
  const [showForm, setShowForm]                 = useState(false)
  const [form, setForm]                         = useState<FormState>(emptyForm())
  const [saving, setSaving]                     = useState(false)
  const [filterTipo, setFilterTipo]             = useState<AcaoTipo | 'all'>('all')
  const [deleteConfirm, setDeleteConfirm]       = useState<string | null>(null)

  /* load member's actions */
  function loadActions(memberId: string) {
    const key = `${VIS_KEY}_${memberId}`
    const stored = safeJson<VisibilityAction[]>(key, [])
    setActions(stored.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()))
  }

  useEffect(() => {
    loadActions(selectedMemberId)
    setFilterTipo('all')
  }, [selectedMemberId])

  /* save action */
  function handleSave() {
    if (!form.titulo.trim() || !form.data) return
    setSaving(true)
    const newAction: VisibilityAction = {
      id: uid(),
      tipo: form.tipo,
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      data: form.data,
      plataforma: form.plataforma.trim() || undefined,
      alcance_estimado: form.alcance_estimado ? parseInt(form.alcance_estimado, 10) : undefined,
      link_evidencia: form.link_evidencia.trim() || undefined,
      created_at: new Date().toISOString(),
    }
    const key = `${VIS_KEY}_${selectedMemberId}`
    const existing = safeJson<VisibilityAction[]>(key, [])
    const updated = [newAction, ...existing]
    localStorage.setItem(key, JSON.stringify(updated))
    setActions(updated.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()))
    setForm(emptyForm())
    setShowForm(false)
    setSaving(false)
  }

  /* delete action */
  function handleDelete(id: string) {
    const key = `${VIS_KEY}_${selectedMemberId}`
    const updated = actions.filter(a => a.id !== id)
    localStorage.setItem(key, JSON.stringify(updated))
    setActions(updated)
    setDeleteConfirm(null)
  }

  const selectedMember = KNOWN_MEMBERS.find(m => m.id === selectedMemberId)!
  const filtered = filterTipo === 'all' ? actions : actions.filter(a => a.tipo === filterTipo)
  const totalAlcance = actions.reduce((s, a) => s + (a.alcance_estimado ?? 0), 0)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 0 64px' }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: D.text, margin: 0 }}>Visibilidade Estratégica</h1>
          <p style={{ fontSize: 13, color: D.textSub, marginTop: 4 }}>
            Registre e gerencie ações estratégicas realizadas pelos membros.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setForm(emptyForm()) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 16px', borderRadius: 7,
            background: D.gold, color: '#1A1208',
            border: 'none', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.03em',
            flexShrink: 0,
          }}
        >
          <Plus size={15} />
          Nova ação
        </button>
      </div>

      {/* ── MEMBER SELECTOR ── */}
      <div style={{
        background: D.card,
        border: `1px solid ${D.border}`,
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={15} style={{ color: D.textSub }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: D.textSub, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Membro
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedMemberId}
            onChange={e => setSelectedMemberId(e.target.value)}
            style={{
              appearance: 'none',
              padding: '7px 32px 7px 12px',
              fontSize: 13, fontWeight: 600,
              color: D.text, background: D.bg,
              border: `1.5px solid ${D.gold}`,
              borderRadius: 6, cursor: 'pointer',
              fontFamily: 'inherit', outline: 'none',
            }}
          >
            {KNOWN_MEMBERS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: D.textSub, pointerEvents: 'none' }} />
        </div>

        {/* quick stats for selected member */}
        <div style={{ display: 'flex', gap: 20, marginLeft: 'auto', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: D.text, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{actions.length}</p>
            <p style={{ fontSize: 10, color: D.textSub, margin: 0 }}>Ações</p>
          </div>
          {totalAlcance > 0 && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#10B981', margin: 0, fontVariantNumeric: 'tabular-nums' }}>~{formatNum(totalAlcance)}</p>
              <p style={{ fontSize: 10, color: D.textSub, margin: 0 }}>Alcance</p>
            </div>
          )}
        </div>
      </div>

      {/* ── ADD FORM ── */}
      {showForm && (
        <div style={{
          background: D.card,
          border: `1.5px solid ${D.gold}`,
          borderRadius: 10,
          padding: '22px 24px',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: D.text, margin: 0 }}>
              Nova ação para {selectedMember.name}
            </h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: D.textSub, padding: 4 }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Tipo */}
            <Field label="Tipo" required>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(Object.entries(tipoConfig) as [AcaoTipo, typeof tipoConfig[AcaoTipo]][]).map(([tipo, cfg]) => (
                  <button
                    key={tipo}
                    onClick={() => setForm(f => ({ ...f, tipo }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '5px 10px', borderRadius: 5, fontSize: 11, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.12s',
                      background: form.tipo === tipo ? cfg.color : 'transparent',
                      color: form.tipo === tipo ? '#fff' : D.textSub,
                      border: `1.5px solid ${form.tipo === tipo ? cfg.color : D.border}`,
                    }}
                  >
                    {cfg.icon}&nbsp;{cfg.label}
                  </button>
                ))}
              </div>
            </Field>

            {/* Data */}
            <Field label="Data" required>
              <input
                type="date"
                value={form.data}
                onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                style={{ ...inputStyle, maxWidth: 180 }}
              />
            </Field>

            {/* Título — full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Título" required>
                <input
                  type="text"
                  placeholder="Ex: Palestra no evento XP Summit 2025"
                  value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                  style={inputStyle}
                />
              </Field>
            </div>

            {/* Descrição — full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Descrição">
                <textarea
                  rows={3}
                  placeholder="Contexto, impacto esperado e detalhes da ação..."
                  value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </Field>
            </div>

            {/* Plataforma */}
            <Field label="Plataforma / Veículo">
              <input
                type="text"
                placeholder="Ex: LinkedIn, Globo, Instagram"
                value={form.plataforma}
                onChange={e => setForm(f => ({ ...f, plataforma: e.target.value }))}
                style={inputStyle}
              />
            </Field>

            {/* Alcance */}
            <Field label="Alcance estimado (pessoas)">
              <input
                type="number"
                placeholder="Ex: 50000"
                value={form.alcance_estimado}
                onChange={e => setForm(f => ({ ...f, alcance_estimado: e.target.value }))}
                style={inputStyle}
              />
            </Field>

            {/* Link — full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Link de evidência">
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.link_evidencia}
                  onChange={e => setForm(f => ({ ...f, link_evidencia: e.target.value }))}
                  style={inputStyle}
                />
              </Field>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: 'transparent', color: D.textSub,
                border: `1px solid ${D.border}`, cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.titulo.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                background: form.titulo.trim() ? D.gold : 'rgba(197,168,128,0.3)',
                color: form.titulo.trim() ? '#1A1208' : '#999',
                border: 'none', cursor: form.titulo.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              <Check size={14} />
              Salvar ação
            </button>
          </div>
        </div>
      )}

      {/* ── FILTER TABS ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {(['all', ...Object.keys(tipoConfig)] as Array<AcaoTipo | 'all'>).map(t => {
          const active = filterTipo === t
          const label = t === 'all' ? 'Todas' : tipoConfig[t as AcaoTipo].label
          const color = t === 'all' ? D.gold : tipoConfig[t as AcaoTipo].color
          const count = t === 'all' ? actions.length : actions.filter(a => a.tipo === t).length
          return (
            <button
              key={t}
              onClick={() => setFilterTipo(t)}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
                background: active ? color : 'transparent',
                color: active ? '#fff' : D.textSub,
                border: `1px solid ${active ? color : D.border}`,
              }}
            >
              {label} <span style={{ opacity: 0.7 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* ── ACTIONS LIST ── */}
      {filtered.length === 0 ? (
        <div style={{
          background: D.card, border: `1px solid ${D.border}`,
          borderRadius: 8, padding: '40px 24px', textAlign: 'center',
        }}>
          <TrendingUp size={28} style={{ color: 'rgba(0,0,0,0.15)', marginBottom: 10 }} />
          <p style={{ fontSize: 13, color: D.textSub, margin: 0 }}>
            {actions.length === 0
              ? `Nenhuma ação registrada para ${selectedMember.name} ainda.`
              : 'Nenhuma ação deste tipo.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(action => {
            const cfg = tipoConfig[action.tipo]
            return (
              <div
                key={action.id}
                style={{
                  background: D.card, border: `1px solid ${D.border}`,
                  borderRadius: 8, padding: '14px 18px',
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                }}
              >
                {/* icon */}
                <div style={{
                  width: 34, height: 34, borderRadius: 7, flexShrink: 0,
                  background: cfg.bg, color: cfg.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {cfg.icon}
                </div>

                {/* content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: cfg.color, background: cfg.bg, padding: '2px 6px', borderRadius: 3,
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: 11, color: D.textSub }}>
                      <Calendar size={10} style={{ display: 'inline', marginRight: 3 }} />
                      {formatDate(action.data)}
                    </span>
                    {action.plataforma && (
                      <span style={{ fontSize: 11, color: D.textSub }}>· {action.plataforma}</span>
                    )}
                    {action.alcance_estimado ? (
                      <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>
                        ~{formatNum(action.alcance_estimado)} pessoas
                      </span>
                    ) : null}
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: '5px 0 0' }}>
                    {action.titulo}
                  </p>
                  {action.descricao && (
                    <p style={{ fontSize: 12, color: D.textSub, margin: '4px 0 0', lineHeight: 1.5 }}>
                      {action.descricao}
                    </p>
                  )}
                </div>

                {/* delete */}
                <div style={{ flexShrink: 0 }}>
                  {deleteConfirm === action.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleDelete(action.id)}
                        style={{
                          padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700,
                          background: '#EF4444', color: '#fff', border: 'none', cursor: 'pointer',
                        }}
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{
                          padding: '4px 8px', borderRadius: 5, fontSize: 11,
                          background: 'transparent', color: D.textSub,
                          border: `1px solid ${D.border}`, cursor: 'pointer',
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(action.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(0,0,0,0.2)', padding: 6, borderRadius: 5,
                        transition: 'color 0.12s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.2)')}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
