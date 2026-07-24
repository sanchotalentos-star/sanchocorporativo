import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, ChevronDown, ChevronUp, CheckCircle2, Circle, XCircle, AlertCircle,
  Target, TrendingUp, Crosshair, Rocket, ChevronRight, Sparkles,
  Pencil, Trash2, X, Check, Calendar,
} from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { getIdentidade } from '@/lib/identidade'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/membro/okr')({
  component: OkrPage,
})

/* ─────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────── */
interface KeyResult {
  id: string
  descricao: string
  meta: number
  atual: number
  unit: string
}

type AcaoStatus = 'pendente' | 'feito' | 'nao_feito' | 'bloqueado'

interface PdcaAcao {
  id: string
  descricao: string
  dataLimite: string
  semana: number
  status: AcaoStatus
  obs: string
}

interface PlanoAcao {
  id: string
  entrega: string
  dataLimite: string
}

interface PdcaCiclo {
  semanaAtual: number
  acoes: PdcaAcao[]
  plano: PlanoAcao[]
}

interface Objective {
  id: string
  titulo: string
  categoria: string
  trimestre: string
  keyResults: KeyResult[]
  expanded: boolean
  pdcaTab: 'okr' | 'p' | 'd' | 'a'
  pdca: PdcaCiclo
}

/* ─────────────────────────────────────────────
   CORES POR CATEGORIA
───────────────────────────────────────────── */
const catColor: Record<string, string> = {
  'Autoridade': '#7B2FBE',
  'Receita':    '#10B981',
  'Alcance':    '#3B82F6',
  'Produto':    '#F59E0B',
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function defaultPdca(): PdcaCiclo {
  return { semanaAtual: 1, acoes: [], plano: [] }
}

function getProgress(atual: number, meta: number) {
  if (meta === 0) return 0
  return Math.min(100, Math.round((atual / meta) * 100))
}

function autoPlanoFromKrs(krs: KeyResult[]): PlanoAcao[] {
  const result: PlanoAcao[] = []
  const stamp = Date.now()
  krs.forEach((kr, i) => {
    const t = detectKrType(kr.descricao)
    const base = `auto-${kr.id}-${stamp}-${i}`
    if (t === 'conteudo') {
      const pw = Math.max(1, Math.ceil(kr.meta / 12))
      result.push({ id: `${base}-a`, entrega: `Montar calendário editorial com ${kr.meta} ${kr.unit || 'conteúdos'} planejados`, dataLimite: '' })
      result.push({ id: `${base}-b`, entrega: `Criar e publicar ${pw} ${kr.unit || 'peça'} por semana consistentemente`, dataLimite: '' })
    } else if (t === 'vendas') {
      result.push({ id: `${base}-a`, entrega: `Prospectar e qualificar ${kr.meta * 3} leads ao longo do trimestre`, dataLimite: '' })
      result.push({ id: `${base}-b`, entrega: `Conduzir conversa de descoberta e enviar proposta para cada lead quente`, dataLimite: '' })
    } else if (t === 'eventos') {
      result.push({ id: `${base}-a`, entrega: `Mapear ${kr.meta * 2} oportunidades: podcasts, eventos e convites`, dataLimite: '' })
      result.push({ id: `${base}-b`, entrega: `Confirmar e preparar material para ${kr.meta} ${kr.unit || 'aparições'}`, dataLimite: '' })
    } else if (t === 'alcance') {
      result.push({ id: `${base}-a`, entrega: `Publicar conteúdo de posicionamento 3× por semana para crescer ${kr.unit}`, dataLimite: '' })
      result.push({ id: `${base}-b`, entrega: `Engajar ativamente com a comunidade e ampliar rede de contatos`, dataLimite: '' })
    } else if (t === 'produto') {
      result.push({ id: `${base}-a`, entrega: `Agendar e conduzir ${kr.meta} sessões de descoberta / demo`, dataLimite: '' })
      result.push({ id: `${base}-b`, entrega: `Coletar feedback estruturado após cada sessão e aplicar melhorias`, dataLimite: '' })
    } else {
      result.push({ id: `${base}-a`, entrega: `Definir e executar estratégia para: ${kr.descricao.slice(0, 65)}`, dataLimite: '' })
    }
  })
  return result
}

const statusIcon = {
  feito:     <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />,
  nao_feito: <XCircle      size={15} className="text-red-400 flex-shrink-0"     />,
  bloqueado: <AlertCircle  size={15} className="text-amber-400 flex-shrink-0"   />,
  pendente:  <Circle       size={15} className="text-gray-300 flex-shrink-0"    />,
}

const statusLabel: Record<AcaoStatus, string> = {
  feito: 'Feito', nao_feito: 'Não feito', bloqueado: 'Bloqueado', pendente: 'Pendente',
}

const OKR_KEY = 'okr_store_v1'

/* ─── KR type detection ─── */
type KrType = 'conteudo' | 'vendas' | 'eventos' | 'alcance' | 'produto' | 'geral'
function detectKrType(desc: string): KrType {
  const d = desc.toLowerCase()
  if (d.includes('publicar') || d.includes('conteúdo') || d.includes('post') || d.includes('vídeo') || d.includes('artigo')) return 'conteudo'
  if (d.includes('cliente') || d.includes('contrato') || d.includes('proposta') || d.includes('conversa') || d.includes('fechar') || d.includes('venda')) return 'vendas'
  if (d.includes('aparição') || d.includes('podcast') || d.includes('evento') || d.includes('palco') || d.includes('convidado') || d.includes('entrevista')) return 'eventos'
  if (d.includes('seguidor') || d.includes('conexão') || d.includes('menção') || d.includes('alcance') || d.includes('indicação') || d.includes('depoimento')) return 'alcance'
  if (d.includes('produto') || d.includes('sessão') || d.includes('demo') || d.includes('feedback') || d.includes('iteração') || d.includes('melhoria')) return 'produto'
  return 'geral'
}

const krActionLink: Record<KrType, { label: string; to: string; color: string; bg: string }> = {
  conteudo: { label: 'Planejar no Marketing Anual →', to: '/dashboard/membro/marketing', color: '#7B2FBE', bg: 'rgba(123,47,190,0.08)' },
  vendas:   { label: 'Registrar na Agenda →',         to: '/dashboard/membro/agenda',    color: '#10B981', bg: 'rgba(16,185,129,0.08)'  },
  eventos:  { label: 'Planejar aparição na Agenda →', to: '/dashboard/membro/agenda',    color: '#3B82F6', bg: 'rgba(59,130,246,0.08)'  },
  alcance:  { label: 'Acompanhar nos Indicadores →',  to: '/dashboard/membro/kpis',      color: '#EC4899', bg: 'rgba(236,72,153,0.08)'  },
  produto:  { label: 'Acompanhar nos Indicadores →',  to: '/dashboard/membro/kpis',      color: '#F59E0B', bg: 'rgba(245,158,11,0.08)'  },
  geral:    { label: 'Ver tarefas relacionadas →',    to: '/dashboard/membro',           color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
}

/* ─────────────────────────────────────────────
   SUGESTÕES DE OKR
───────────────────────────────────────────── */
interface SugestaoOkr {
  id: string
  titulo: string
  categoria: string
  krs: { descricao: string; meta: number; unit: string }[]
}

function SugestoesDeOkr({ onAddOkr }: { onAddOkr: (obj: Objective) => void }) {
  const identidade = getIdentidade()
  const [open, setOpen] = useState(true)
  const [adicionados, setAdicionados] = useState<Set<string>>(new Set())

  const publicoAlvo    = identidade?.pilares.publicoAlvo?.reflexao?.trim()
  const proposta       = identidade?.pilares.proposta?.reflexao?.trim()
  const formatoProduto = identidade?.pilares.formatoProduto?.reflexao?.trim()
  const diferencial    = identidade?.diferenciais?.[0] ?? ''

  const sugestoes: SugestaoOkr[] = [
    {
      id: 'autoridade',
      titulo: proposta
        ? `Ser reconhecido por: ${proposta}`
        : 'Construir autoridade reconhecida no mercado',
      categoria: 'Autoridade',
      krs: [
        {
          descricao: publicoAlvo
            ? `Publicar conteúdos de posicionamento direcionados a ${publicoAlvo}`
            : 'Publicar conteúdos de posicionamento no trimestre',
          meta: 12,
          unit: 'conteúdos',
        },
        {
          descricao: 'Aparecer como convidado em eventos, podcasts ou entrevistas do setor',
          meta: 3,
          unit: 'aparições',
        },
        {
          descricao: 'Receber pedidos de conexão ou menções espontâneas de pessoas do público-alvo',
          meta: 15,
          unit: 'contatos',
        },
      ],
    },
    (publicoAlvo || proposta) ? {
      id: 'conversao',
      titulo: proposta
        ? `Converter autoridade em receita com: ${proposta}`
        : 'Gerar conversões e receita com consistência',
      categoria: 'Receita',
      krs: [
        {
          descricao: publicoAlvo
            ? `Ter conversas de descoberta com ${publicoAlvo}`
            : 'Ter conversas de descoberta com potenciais clientes',
          meta: 10,
          unit: 'conversas',
        },
        {
          descricao: 'Enviar propostas comerciais personalizadas para leads qualificados',
          meta: 5,
          unit: 'propostas',
        },
        {
          descricao: 'Fechar novos clientes ou contratos no trimestre',
          meta: 3,
          unit: 'clientes',
        },
      ],
    } : null,
    diferencial ? {
      id: 'diferencial',
      titulo: `Ser referência por: ${diferencial}`,
      categoria: 'Autoridade',
      krs: [
        {
          descricao: 'Coletar e publicar depoimentos de clientes atendidos',
          meta: 5,
          unit: 'depoimentos',
        },
        {
          descricao: 'Receber indicações ativas de clientes satisfeitos',
          meta: 8,
          unit: 'indicações',
        },
        {
          descricao: 'Aparecer em mídias ou conteúdos de terceiros referenciando seu diferencial',
          meta: 2,
          unit: 'aparições',
        },
      ],
    } : null,
    formatoProduto ? {
      id: 'produto',
      titulo: `Escalar: ${formatoProduto}`,
      categoria: 'Produto',
      krs: [
        {
          descricao: 'Realizar sessões de descoberta ou demos do produto com potenciais clientes',
          meta: 10,
          unit: 'sessões',
        },
        {
          descricao: 'Coletar feedbacks estruturados de clientes ou leads após cada sessão',
          meta: 8,
          unit: 'feedbacks',
        },
        {
          descricao: 'Aplicar melhorias concretas no produto com base nos feedbacks coletados',
          meta: 3,
          unit: 'iterações',
        },
      ],
    } : null,
  ].filter(Boolean) as SugestaoOkr[]

  if (sugestoes.length === 0) return null

  function usar(s: SugestaoOkr) {
    const novoObj: Objective = {
      id: `sug-${s.id}-${Date.now()}`,
      titulo: s.titulo,
      categoria: s.categoria,
      trimestre: 'Q3 2026',
      expanded: true,
      pdcaTab: 'okr',
      pdca: defaultPdca(),
      keyResults: s.krs.map((kr, i) => ({
        id: `kr-${Date.now()}-${i}`,
        descricao: kr.descricao,
        meta: kr.meta,
        atual: 0,
        unit: kr.unit,
      })),
    }
    onAddOkr(novoObj)
    setAdicionados(prev => new Set([...prev, s.id]))
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible"
      className="rounded-xl border border-[#7B2FBE]/15 bg-white shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#7B2FBE]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles size={12} className="text-[#7B2FBE]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Sugestões de OKRs</p>
            <p className="text-xs text-gray-400">Objetivos gerados a partir da sua identidade de marca</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-full">
            {sugestoes.length} objetivos
          </span>
          {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-5 space-y-3">
          {sugestoes.map(s => {
            const adicionado = adicionados.has(s.id)
            const cor = catColor[s.categoria] ?? '#7B2FBE'
            return (
              <div key={s.id} className="rounded-xl border border-gray-100 p-4 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${cor}15`, color: cor }}>
                        {s.categoria}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{s.titulo}</p>
                  </div>
                  <button
                    onClick={() => !adicionado && usar(s)}
                    disabled={adicionado}
                    className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                    style={adicionado
                      ? { background: '#f3f4f6', color: '#9ca3af' }
                      : { background: `${cor}15`, color: cor }
                    }
                  >
                    {adicionado ? 'Adicionado ✓' : 'Usar objetivo'}
                  </button>
                </div>
                <div className="space-y-2 pl-1">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">Key Results sugeridos</p>
                  {s.krs.map((kr, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Target size={11} className="text-gray-300 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {kr.descricao}
                        {kr.meta > 0 && (
                          <span className="ml-1 font-medium" style={{ color: cor }}>
                            → meta: {kr.meta} {kr.unit}
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
            Ajuste os valores das metas com seu mentor — eles conhecem seu contexto e ritmo real.
          </p>
        </div>
      )}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   KR ITEM — inline editável
───────────────────────────────────────────── */
function KrItem({
  kr, color, objId,
  onUpdate, onDelete, onUpdateAtual,
}: {
  kr: KeyResult
  color: string
  objId: string
  onUpdate: (objId: string, krId: string, patch: Partial<KeyResult>) => void
  onDelete: (objId: string, krId: string) => void
  onUpdateAtual: (objId: string, krId: string, atual: number) => void
}) {
  const [editDesc, setEditDesc] = useState(false)
  const [descVal, setDescVal] = useState(kr.descricao)
  const [editMeta, setEditMeta] = useState(false)
  const [metaVal, setMetaVal] = useState(String(kr.meta))
  const [unitVal, setUnitVal] = useState(kr.unit)
  const [showPauta, setShowPauta] = useState(false)
  const [pautaFormato, setPautaFormato] = useState('carousel')
  const [pautaPlataforma, setPautaPlataforma] = useState('instagram')
  const [pautaTema, setPautaTema] = useState('')
  const descRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editDesc) descRef.current?.focus() }, [editDesc])

  const pct  = getProgress(kr.atual, kr.meta)
  const done = pct >= 100
  const krType = detectKrType(kr.descricao)
  const actionLink = krActionLink[krType]

  function commitDesc() {
    const v = descVal.trim()
    if (v) onUpdate(objId, kr.id, { descricao: v })
    else setDescVal(kr.descricao)
    setEditDesc(false)
  }

  function commitMeta() {
    const m = parseFloat(metaVal)
    const u = unitVal.trim()
    if (!isNaN(m) && m >= 0) onUpdate(objId, kr.id, { meta: m, unit: u || kr.unit })
    else { setMetaVal(String(kr.meta)); setUnitVal(kr.unit) }
    setEditMeta(false)
  }

  return (
    <div className="group px-5 py-4 flex items-start gap-3 border-b border-gray-100 last:border-0">
      <button className="flex-shrink-0 mt-0.5">
        {done
          ? <CheckCircle2 size={15} className="text-emerald-500" />
          : <Circle size={15} className="text-gray-300" />
        }
      </button>
      <div className="flex-1 min-w-0">
        {/* Descrição editável */}
        {editDesc ? (
          <input
            ref={descRef}
            value={descVal}
            onChange={e => setDescVal(e.target.value)}
            onBlur={commitDesc}
            onKeyDown={e => { if (e.key === 'Enter') commitDesc(); if (e.key === 'Escape') { setDescVal(kr.descricao); setEditDesc(false) } }}
            className="w-full text-sm text-gray-700 bg-transparent border-b border-[#7B2FBE] focus:outline-none pb-0.5 mb-2"
          />
        ) : (
          <p
            className={cn('text-sm leading-relaxed cursor-pointer hover:text-[#7B2FBE] transition-colors', done ? 'text-gray-400 line-through' : 'text-gray-700')}
            onClick={() => setEditDesc(true)}
          >
            {kr.descricao}
          </p>
        )}

        {/* Meta editável */}
        {editMeta ? (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-400">Meta:</span>
            <input
              autoFocus
              type="number"
              value={metaVal}
              onChange={e => setMetaVal(e.target.value)}
              className="w-20 text-xs border border-gray-200 rounded px-2 py-0.5 text-gray-800 focus:outline-none focus:border-[#7B2FBE]"
            />
            <input
              value={unitVal}
              onChange={e => setUnitVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitMeta(); if (e.key === 'Escape') { setMetaVal(String(kr.meta)); setUnitVal(kr.unit); setEditMeta(false) } }}
              className="w-24 text-xs border border-gray-200 rounded px-2 py-0.5 text-gray-800 focus:outline-none focus:border-[#7B2FBE]"
              placeholder="unidade"
            />
            <button onClick={commitMeta} className="text-[#7B2FBE]"><Check size={13} /></button>
            <button onClick={() => { setMetaVal(String(kr.meta)); setUnitVal(kr.unit); setEditMeta(false) }} className="text-gray-300"><X size={13} /></button>
          </div>
        ) : (
          <button
            onClick={() => setEditMeta(true)}
            className="flex items-center gap-1.5 mt-2 group/meta"
          >
            <div className="flex-1 h-1 rounded-full bg-gray-100 w-32 sm:w-48">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: done ? '#10B981' : color }} />
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap group-hover/meta:text-[#7B2FBE] transition-colors">
              {kr.atual}/{kr.meta} {kr.unit}
            </span>
          </button>
        )}

        {/* Atalho de ação contextual */}
        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <Link to={actionLink.to as any}>
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
              style={{ background: actionLink.bg, color: actionLink.color }}
            >
              {actionLink.label}
            </span>
          </Link>
          {krType === 'conteudo' && (
            <button
              onClick={() => setShowPauta(p => !p)}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors"
              style={{ background: showPauta ? 'rgba(123,47,190,0.12)' : 'rgba(123,47,190,0.06)', color: '#7B2FBE' }}
            >
              <Sparkles size={10} />
              Planejar conteúdo
            </button>
          )}
        </div>

        {/* Pauta de conteúdo expandível */}
        {krType === 'conteudo' && showPauta && (
          <div className="mt-3 rounded-xl border border-[#7B2FBE]/15 bg-[#7B2FBE]/[0.03] p-4 space-y-3">
            <p className="text-[11px] font-semibold text-[#7B2FBE]">Planejar conteúdo para este KR</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Formato</label>
                <select value={pautaFormato} onChange={e => setPautaFormato(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 bg-white focus:outline-none focus:border-[#7B2FBE]">
                  <option value="carousel">Carrossel</option>
                  <option value="reels">Reels / Vídeo curto</option>
                  <option value="artigo">Artigo / Post longo</option>
                  <option value="stories">Stories</option>
                  <option value="live">Live / Podcast</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Plataforma</label>
                <select value={pautaPlataforma} onChange={e => setPautaPlataforma(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 bg-white focus:outline-none focus:border-[#7B2FBE]">
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Tema / Assunto</label>
              <input
                value={pautaTema}
                onChange={e => setPautaTema(e.target.value)}
                placeholder="Ex: Como eu ajudo profissionais a..."
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 bg-white focus:outline-none focus:border-[#7B2FBE] placeholder:text-gray-300"
              />
            </div>
            <Link to="/dashboard/membro/marketing">
              <div className="flex items-center justify-between bg-[#7B2FBE] text-white text-xs font-medium px-3 py-2.5 rounded-lg hover:bg-[#6a27a5] transition-colors cursor-pointer mt-1">
                <span>Ir para Marketing Anual e criar conteúdo</span>
                <ChevronRight size={12} />
              </div>
            </Link>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              No Marketing Anual, agende este conteúdo e vincule à sua meta de {kr.meta} {kr.unit}.
            </p>
          </div>
        )}
      </div>

      {/* Atual + ações */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <input
          type="number" value={kr.atual} min={0}
          onChange={e => onUpdateAtual(objId, kr.id, Number(e.target.value))}
          className="w-16 text-sm text-right bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-900 focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]/20"
        />
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
          <button onClick={() => setEditDesc(true)} className="p-1.5 rounded text-gray-300 hover:text-[#7B2FBE] transition-colors">
            <Pencil size={11} />
          </button>
          <button
            onClick={() => { if (confirm('Excluir este Key Result?')) onDelete(objId, kr.id) }}
            className="p-1.5 rounded text-gray-300 hover:text-red-400 transition-colors"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
function migrateOkrs(raw: Objective[]): Objective[] {
  const id = getIdentidade()
  const proposta       = id?.pilares.proposta?.reflexao?.trim() ?? ''
  const publicoAlvo    = id?.pilares.publicoAlvo?.reflexao?.trim() ?? ''
  const formatoProduto = id?.pilares.formatoProduto?.reflexao?.trim() ?? ''
  const diferencial    = id?.diferenciais?.[0] ?? ''

  const fixTitle = (t: string) => {
    if (proposta && t.startsWith('Ser reconhecido por: ') && t.endsWith('...'))
      return `Ser reconhecido por: ${proposta}`
    if (proposta && t.startsWith('Converter: ') && t.endsWith('...'))
      return `Converter: ${proposta}`
    if (diferencial && t.startsWith('Ser referência por: ') && t.endsWith('...'))
      return `Ser referência por: ${diferencial}`
    if (formatoProduto && t.startsWith('Escalar: ') && t.endsWith('...'))
      return `Escalar: ${formatoProduto}`
    return t
  }

  const fixKr = (desc: string) => {
    if (publicoAlvo && desc.startsWith('Publicar conteúdo de alta qualidade direcionado a ') && desc.endsWith('...'))
      return `Publicar conteúdo de alta qualidade direcionado a ${publicoAlvo}`
    if (publicoAlvo && desc.startsWith('Realizar conversas qualificadas com ') && desc.endsWith('...'))
      return `Realizar conversas qualificadas com ${publicoAlvo}`
    if (proposta && desc.startsWith('Converter: ') && desc.endsWith('...'))
      return `Converter: ${proposta}`
    return desc
  }

  return raw.map(obj => ({
    ...obj,
    titulo: fixTitle(obj.titulo),
    keyResults: obj.keyResults.map(kr => ({ ...kr, descricao: fixKr(kr.descricao) })),
  }))
}

function OkrPage() {
  const [okrs, setOkrs] = useState<Objective[]>(() => {
    try {
      const raw: Objective[] = JSON.parse(localStorage.getItem(OKR_KEY) ?? 'null') ?? []
      return migrateOkrs(raw)
    }
    catch { return [] }
  })
  const [showNovoObj, setShowNovoObj] = useState(false)
  const [novoForm, setNovoForm] = useState({ titulo: '', categoria: 'Autoridade', trimestre: 'Q3 2026' })

  useEffect(() => {
    localStorage.setItem(OKR_KEY, JSON.stringify(okrs))
  }, [okrs])

  function addObjective() {
    if (!novoForm.titulo.trim()) return
    const novo: Objective = {
      id: Date.now().toString(),
      titulo: novoForm.titulo.trim(),
      categoria: novoForm.categoria,
      trimestre: novoForm.trimestre,
      expanded: true,
      pdcaTab: 'okr',
      keyResults: [],
      pdca: defaultPdca(),
    }
    setOkrs(prev => [...prev, novo])
    setNovoForm({ titulo: '', categoria: 'Autoridade', trimestre: 'Q3 2026' })
    setShowNovoObj(false)
  }

  /* ── atualizadores ── */
  function setObj(id: string, patch: Partial<Objective>) {
    setOkrs(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o))
  }
  function setPdca(id: string, patch: Partial<PdcaCiclo>) {
    setOkrs(prev => prev.map(o => o.id === id ? { ...o, pdca: { ...o.pdca, ...patch } } : o))
  }
  function updateKr(objId: string, krId: string, patch: Partial<KeyResult>) {
    setOkrs(prev => prev.map(o => {
      if (o.id !== objId) return o
      return { ...o, keyResults: o.keyResults.map(kr => kr.id === krId ? { ...kr, ...patch } : kr) }
    }))
  }
  function updateKrAtual(objId: string, krId: string, atual: number) {
    updateKr(objId, krId, { atual })
  }
  function deleteKr(objId: string, krId: string) {
    setOkrs(prev => prev.map(o => {
      if (o.id !== objId) return o
      return { ...o, keyResults: o.keyResults.filter(kr => kr.id !== krId) }
    }))
  }
  function addKr(objId: string) {
    const kr: KeyResult = { id: `kr-${Date.now()}`, descricao: '', meta: 0, atual: 0, unit: '' }
    setOkrs(prev => prev.map(o => o.id !== objId ? o : { ...o, keyResults: [...o.keyResults, kr] }))
  }
  function deleteObjective(objId: string) {
    setOkrs(prev => prev.filter(o => o.id !== objId))
  }
  function updateAcao(objId: string, acaoId: string, patch: Partial<PdcaAcao>) {
    setOkrs(prev => prev.map(o => {
      if (o.id !== objId) return o
      return { ...o, pdca: { ...o.pdca, acoes: o.pdca.acoes.map(a => a.id === acaoId ? { ...a, ...patch } : a) } }
    }))
  }
  function deleteAcao(objId: string, acaoId: string) {
    setOkrs(prev => prev.map(o => {
      if (o.id !== objId) return o
      return { ...o, pdca: { ...o.pdca, acoes: o.pdca.acoes.filter(a => a.id !== acaoId) } }
    }))
  }
  function addAcao(objId: string, semana: number) {
    const nova: PdcaAcao = { id: Date.now().toString(), descricao: '', dataLimite: '', semana, status: 'pendente', obs: '' }
    setOkrs(prev => prev.map(o => o.id !== objId ? o : { ...o, pdca: { ...o.pdca, acoes: [...o.pdca.acoes, nova] } }))
  }
  function addPlanoAcao(objId: string) {
    const nova: PlanoAcao = { id: Date.now().toString(), entrega: '', dataLimite: '' }
    setOkrs(prev => prev.map(o => o.id !== objId ? o : { ...o, pdca: { ...o.pdca, plano: [...(o.pdca.plano ?? []), nova] } }))
  }
  function updatePlanoAcao(objId: string, acaoId: string, patch: Partial<PlanoAcao>) {
    setOkrs(prev => prev.map(o => {
      if (o.id !== objId) return o
      return { ...o, pdca: { ...o.pdca, plano: (o.pdca.plano ?? []).map(a => a.id === acaoId ? { ...a, ...patch } : a) } }
    }))
  }
  function deletePlanoAcao(objId: string, acaoId: string) {
    setOkrs(prev => prev.map(o => {
      if (o.id !== objId) return o
      return { ...o, pdca: { ...o.pdca, plano: (o.pdca.plano ?? []).filter(a => a.id !== acaoId) } }
    }))
  }
  function setPlano(objId: string, plano: PlanoAcao[]) {
    setOkrs(prev => prev.map(o => o.id !== objId ? o : { ...o, pdca: { ...o.pdca, plano } }))
  }

  /* ── sumário global ── */
  const totalKrs = okrs.flatMap(o => o.keyResults).length
  const doneKrs  = okrs.flatMap(o => o.keyResults).filter(kr => getProgress(kr.atual, kr.meta) >= 100).length
  const overallProgress = totalKrs > 0 ? Math.round((doneKrs / totalKrs) * 100) : 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link to="/dashboard/membro/posicionamento">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">01 Identidade</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <Link to="/dashboard/membro/pilares">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">02 Pilares</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <span className="text-xs font-bold text-[#7B2FBE] bg-[#7B2FBE]/10 px-2 py-0.5 rounded-md">
            03 OKRs
          </span>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <Link to="/dashboard/membro/marketing">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">04 Marketing</span>
          </Link>
          <ChevronRight size={12} className="text-gray-200 flex-shrink-0" />
          <Link to="/dashboard/membro/kpis">
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">05 Resultados</span>
          </Link>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Metas de Impacto</h1>
            <p className="text-gray-500 mt-1 text-sm">O que você quer conquistar nos próximos 3 meses — definido com seu mentor, executado por você</p>
          </div>
          <button
            onClick={() => setShowNovoObj(true)}
            className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#6a27a5] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex-shrink-0"
          >
            <Plus size={15} /> Novo Objetivo
          </button>
        </div>
      </div>

      {/* Modal novo objetivo */}
      {showNovoObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-xl bg-white border border-gray-200 shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Novo Objetivo</h2>
              <button onClick={() => setShowNovoObj(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1">Título do Objetivo</label>
                <input
                  type="text"
                  value={novoForm.titulo}
                  onChange={e => setNovoForm(f => ({ ...f, titulo: e.target.value }))}
                  placeholder="Ex: Tornar-me referência em..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE] transition-colors"
                  onKeyDown={e => e.key === 'Enter' && addObjective()}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Categoria</label>
                  <select
                    value={novoForm.categoria}
                    onChange={e => setNovoForm(f => ({ ...f, categoria: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE] transition-colors bg-white"
                  >
                    {Object.keys(catColor).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1">Trimestre</label>
                  <select
                    value={novoForm.trimestre}
                    onChange={e => setNovoForm(f => ({ ...f, trimestre: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7B2FBE] transition-colors bg-white"
                  >
                    {['Q1 2026','Q2 2026','Q3 2026','Q4 2026'].map(q => <option key={q}>{q}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowNovoObj(false)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addObjective}
                disabled={!novoForm.titulo.trim()}
                className="flex-1 bg-[#7B2FBE] hover:bg-[#6a27a5] disabled:opacity-40 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                Criar Objetivo
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sumário */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-3 gap-3">
        <motion.div variants={fadeInUp} className="rounded-xl bg-white border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-gray-300" />
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Objetivos</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{okrs.length}</p>
        </motion.div>
        <motion.div variants={fadeInUp} className="rounded-xl bg-white border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Crosshair size={14} className="text-gray-300" />
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Key Results</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{doneKrs}<span className="text-gray-400 text-sm font-normal">/{totalKrs}</span></p>
        </motion.div>
        <motion.div variants={fadeInUp} className="rounded-xl bg-white border border-[#7B2FBE]/25 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-[#7B2FBE]" />
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Progresso</p>
          </div>
          <p className="text-2xl font-semibold text-[#7B2FBE]">{overallProgress}%</p>
        </motion.div>
      </motion.div>

      {/* Sugestões baseadas na identidade */}
      <SugestoesDeOkr onAddOkr={(obj) => setOkrs(prev => [...prev, obj])} />

      {/* Empty state */}
      {okrs.length === 0 && (
        <motion.div
          variants={fadeInUp} initial="hidden" animate="visible"
          className="rounded-xl border border-gray-100 bg-white shadow-sm p-12 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-xl bg-[#7B2FBE]/10 flex items-center justify-center mb-5">
            <Rocket size={28} className="text-[#7B2FBE]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Suas metas ainda estão sendo desenhadas</h2>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">
            Na próxima sessão com seu mentor, vocês vão definir juntos o que você quer conquistar nos próximos 3 meses.
          </p>
          <div className="w-full max-w-lg border-t border-gray-100 pt-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">O que acontece em cada fase</p>
            <div className="grid grid-cols-2 gap-3 text-left">
              {[
                { fase: '01', nome: 'OKR & MVP',          desc: 'Suas metas de impacto + formatação do produto' },
                { fase: '02', nome: 'Primeiras Vitórias', desc: 'Posicionamento, marketing e agenda de eventos' },
                { fase: '03', nome: 'Plano em Ação',      desc: 'Execução do plano + revisão de metas + storytelling' },
                { fase: '04', nome: 'Escala',             desc: 'Segundo ciclo de execução + autoridade de mercado' },
              ].map(f => (
                <div key={f.fase} className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <span className="text-[10px] font-medium text-[#7B2FBE] tracking-widest block mb-1">Fase {f.fase}</span>
                  <p className="text-xs font-semibold text-gray-800 mb-1">{f.nome}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Cards de OKR */}
      <div className="space-y-3">
        {okrs.map((obj) => {
          const color  = catColor[obj.categoria] ?? '#6B7280'
          const objPct = obj.keyResults.length > 0
            ? Math.round(obj.keyResults.reduce((s, kr) => s + getProgress(kr.atual, kr.meta), 0) / obj.keyResults.length)
            : 0

          return (
            <OkrCard
              key={obj.id}
              obj={obj}
              color={color}
              objPct={objPct}
              onSetObj={setObj}
              onUpdateKr={updateKr}
              onUpdateKrAtual={updateKrAtual}
              onDeleteKr={deleteKr}
              onAddKr={addKr}
              onDeleteObjective={deleteObjective}
              onSetPdca={setPdca}
              onUpdateAcao={updateAcao}
              onDeleteAcao={deleteAcao}
              onAddAcao={addAcao}
              onAddPlanoAcao={addPlanoAcao}
              onUpdatePlanoAcao={updatePlanoAcao}
              onDeletePlanoAcao={deletePlanoAcao}
              onSetPlano={setPlano}
            />
          )
        })}
      </div>

      {/* Esta construção alimenta */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-4">Esta construção alimenta</p>
        <div className="grid sm:grid-cols-2 gap-3">

          <Link to="/dashboard/membro/marketing">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-[#7B2FBE]">04</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5">Marketing Anual</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                As metas definem as prioridades de conteúdo e presença — o calendário de marketing é construído para executar o que os OKRs exigem.
              </p>
            </div>
          </Link>

          <Link to="/dashboard/membro/agenda">
            <div className="group rounded-xl border border-gray-100 bg-gray-50 hover:border-[#7B2FBE]/20 hover:bg-[#7B2FBE]/[0.03] p-4 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-[#7B2FBE]">Agenda</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#7B2FBE] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1.5">Agenda Executiva</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Suas ações do plano aparecem na agenda integrada — semana a semana, saiba exatamente o que executar.
              </p>
            </div>
          </Link>

        </div>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   OKR CARD
───────────────────────────────────────────── */
interface OkrCardProps {
  obj: Objective
  color: string
  objPct: number
  onSetObj: (id: string, patch: Partial<Objective>) => void
  onUpdateKr: (objId: string, krId: string, patch: Partial<KeyResult>) => void
  onUpdateKrAtual: (objId: string, krId: string, atual: number) => void
  onDeleteKr: (objId: string, krId: string) => void
  onAddKr: (objId: string) => void
  onDeleteObjective: (objId: string) => void
  onSetPdca: (id: string, patch: Partial<PdcaCiclo>) => void
  onUpdateAcao: (objId: string, acaoId: string, patch: Partial<PdcaAcao>) => void
  onDeleteAcao: (objId: string, acaoId: string) => void
  onAddAcao: (objId: string, semana: number) => void
  onAddPlanoAcao: (objId: string) => void
  onUpdatePlanoAcao: (objId: string, acaoId: string, patch: Partial<PlanoAcao>) => void
  onDeletePlanoAcao: (objId: string, acaoId: string) => void
  onSetPlano: (objId: string, plano: PlanoAcao[]) => void
}

function OkrCard({
  obj, color, objPct,
  onSetObj, onUpdateKr, onUpdateKrAtual, onDeleteKr, onAddKr, onDeleteObjective,
  onSetPdca, onUpdateAcao, onDeleteAcao, onAddAcao,
  onAddPlanoAcao, onUpdatePlanoAcao, onDeletePlanoAcao, onSetPlano,
}: OkrCardProps) {
  const [editTitulo, setEditTitulo] = useState(false)
  const [tituloVal, setTituloVal] = useState(obj.titulo)
  const tituloRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editTitulo) tituloRef.current?.focus() }, [editTitulo])

  function commitTitulo() {
    const v = tituloVal.trim()
    if (v) onSetObj(obj.id, { titulo: v })
    else setTituloVal(obj.titulo)
    setEditTitulo(false)
  }

  const identidade = getIdentidade()
  const tabLabels = { okr: 'Como Vou Medir', p: 'Plano de Ação', d: 'Agenda Executiva', a: 'O Que Melhorar' }

  const plano = obj.pdca.plano ?? []

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible"
      className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 p-5">
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => !editTitulo && onSetObj(obj.id, { expanded: !obj.expanded })}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <select
              value={obj.categoria}
              onChange={e => { e.stopPropagation(); onSetObj(obj.id, { categoria: e.target.value }) }}
              onClick={e => e.stopPropagation()}
              className="text-[10px] font-medium px-2 py-0.5 rounded border-0 focus:outline-none focus:ring-1 focus:ring-[#7B2FBE]/30 cursor-pointer"
              style={{ background: `${color}15`, color }}
            >
              {Object.keys(catColor).map(c => <option key={c}>{c}</option>)}
            </select>
            <span className="text-[10px] text-gray-400 font-medium">{obj.trimestre}</span>
          </div>

          {editTitulo ? (
            <input
              ref={tituloRef}
              value={tituloVal}
              onChange={e => setTituloVal(e.target.value)}
              onBlur={commitTitulo}
              onKeyDown={e => { if (e.key === 'Enter') commitTitulo(); if (e.key === 'Escape') { setTituloVal(obj.titulo); setEditTitulo(false) } }}
              onClick={e => e.stopPropagation()}
              className="w-full text-sm font-semibold text-gray-900 bg-transparent border-b border-[#7B2FBE] focus:outline-none pb-0.5"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-900 leading-tight">{obj.titulo}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100">
              <div className="h-full rounded-full transition-all" style={{ width: `${objPct}%`, background: color }} />
            </div>
            <span className="text-xs font-semibold flex-shrink-0" style={{ color }}>{objPct}%</span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => { setEditTitulo(true); onSetObj(obj.id, { expanded: true }) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-[#7B2FBE] hover:bg-[#7B2FBE]/5 transition-colors"
            title="Editar título"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => { if (confirm(`Excluir o objetivo "${obj.titulo}"?`)) onDeleteObjective(obj.id) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            title="Excluir objetivo"
          >
            <Trash2 size={12} />
          </button>
          <button
            onClick={() => onSetObj(obj.id, { expanded: !obj.expanded })}
            className="w-7 h-7 flex items-center justify-center"
          >
            {obj.expanded
              ? <ChevronUp size={15} className="text-gray-300" />
              : <ChevronDown size={15} className="text-gray-300" />
            }
          </button>
        </div>
      </div>

      {obj.expanded && (
        <>
          {/* Tabs */}
          <div className="border-t border-gray-100 flex overflow-x-auto">
            {(['okr', 'p', 'd', 'a'] as const).map((tab) => {
              const active = obj.pdcaTab === tab
              return (
                <button key={tab} onClick={() => onSetObj(obj.id, { pdcaTab: tab })}
                  className={cn(
                    'flex-1 py-2.5 text-[10px] font-medium uppercase tracking-wide transition-colors border-b-2 whitespace-nowrap px-2',
                    active
                      ? 'border-[#7B2FBE] text-[#7B2FBE]'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  )}
                >
                  {tabLabels[tab]}
                </button>
              )
            })}
          </div>

          {/* ── COMO VOU MEDIR (Key Results) ── */}
          {obj.pdcaTab === 'okr' && (
            <div>
              {obj.keyResults.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <p className="text-sm text-gray-400 mb-1">Nenhum Key Result definido</p>
                  <p className="text-xs text-gray-300">Adicione métricas para acompanhar o progresso deste objetivo.</p>
                </div>
              ) : (
                obj.keyResults.map(kr => (
                  <KrItem
                    key={kr.id}
                    kr={kr}
                    color={color}
                    objId={obj.id}
                    onUpdate={onUpdateKr}
                    onDelete={onDeleteKr}
                    onUpdateAtual={onUpdateKrAtual}
                  />
                ))
              )}
              <div className="px-5 py-3 border-t border-gray-100">
                <button
                  onClick={() => onAddKr(obj.id)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#7B2FBE] font-medium transition-colors"
                >
                  <Plus size={14} />
                  Adicionar Key Result
                </button>
              </div>
            </div>
          )}

          {/* ── PLANO DE AÇÃO ── */}
          {obj.pdcaTab === 'p' && (
            <div className="p-5 space-y-4">
              {/* Orientação */}
              <div className="rounded-xl bg-[#7B2FBE]/[0.04] border border-[#7B2FBE]/10 p-4">
                <p className="text-xs font-semibold text-[#7B2FBE] mb-1.5">Aqui é o COMO, não o QUÊ</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Os KRs já dizem <em>o que</em> você quer atingir. Aqui você define <strong>como vai executar</strong> — as estratégias e rotinas concretas. Ex: não "publicar 12 posts", mas "criar e publicar 1 post por semana toda segunda-feira".
                </p>
              </div>

              {/* Auto-gerar estratégias a partir dos KRs */}
              {obj.keyResults.length > 0 && plano.length === 0 && (
                <button
                  onClick={() => onSetPlano(obj.id, autoPlanoFromKrs(obj.keyResults))}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-[#7B2FBE]/30 text-[#7B2FBE] text-xs font-medium py-3 rounded-xl hover:bg-[#7B2FBE]/5 transition-colors"
                >
                  <Sparkles size={12} />
                  Sugerir estratégias de execução para os meus KRs
                </button>
              )}

              {plano.length === 0 ? (
                <div className="py-3 text-center">
                  <p className="text-sm text-gray-300 italic">Nenhuma entrega planejada ainda</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {plano.map((acao, i) => {
                    const planType = detectKrType(acao.entrega)
                    const planLink = krActionLink[planType]
                    return (
                      <div key={acao.id} className="group rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                        <div className="flex items-center gap-2 px-3 py-2.5">
                          <div className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white" style={{ background: color }}>
                            {i + 1}
                          </div>
                          <input
                            value={acao.entrega}
                            onChange={e => onUpdatePlanoAcao(obj.id, acao.id, { entrega: e.target.value })}
                            placeholder="Ex: Prospectar 5 leads por semana no LinkedIn"
                            className="flex-1 text-sm text-gray-800 bg-transparent focus:outline-none placeholder:text-gray-300"
                          />
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Calendar size={12} className="text-gray-300" />
                            <input
                              type="date"
                              value={acao.dataLimite}
                              onChange={e => onUpdatePlanoAcao(obj.id, acao.id, { dataLimite: e.target.value })}
                              className="text-xs text-gray-500 bg-transparent focus:outline-none border-0 w-32"
                            />
                            <button
                              onClick={() => onDeletePlanoAcao(obj.id, acao.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-300 hover:text-red-400 transition-all"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                        {acao.entrega.trim() && (
                          <div className="border-t border-gray-100 px-3 py-1.5">
                            <Link to={planLink.to as any}>
                              <span className="text-[10px] font-medium hover:opacity-70 transition-opacity" style={{ color: planLink.color }}>
                                {planLink.label}
                              </span>
                            </Link>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              <button
                onClick={() => onAddPlanoAcao(obj.id)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#7B2FBE] font-medium transition-colors"
              >
                <Plus size={14} />
                Adicionar entrega
              </button>
            </div>
          )}

          {/* ── AGENDA EXECUTIVA ── */}
          {obj.pdcaTab === 'd' && (
            <div className="p-5 space-y-5">
              {/* Semana atual selector */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Semana atual do ciclo</p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4].map(s => (
                    <button key={s} onClick={() => onSetPdca(obj.id, { semanaAtual: s })}
                      className={cn(
                        'w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                        obj.pdca.semanaAtual === s
                          ? 'bg-[#7B2FBE] text-white'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      )}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {[1,2,3,4].map(semana => {
                const acoesSem = obj.pdca.acoes.filter(a => a.semana === semana)
                const isCurrent = semana === obj.pdca.semanaAtual
                const isPast = semana < obj.pdca.semanaAtual
                return (
                  <div key={semana}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        'text-[11px] font-medium px-2.5 py-0.5 rounded-md',
                        isCurrent ? 'bg-[#7B2FBE]/10 text-[#7B2FBE]' : 'text-gray-400'
                      )}>
                        Semana {semana}{isCurrent ? ' — atual' : isPast ? ' — concluída' : ''}
                      </span>
                      <button onClick={() => onAddAcao(obj.id, semana)}
                        className="text-xs font-medium text-[#7B2FBE] hover:text-[#6a27a5] flex items-center gap-1"
                      >
                        <Plus size={11} /> Ação
                      </button>
                    </div>

                    {acoesSem.length === 0 ? (
                      <p className="text-xs text-gray-300 italic py-2 pl-1">Nenhuma ação adicionada</p>
                    ) : (
                      <div className="space-y-2">
                        {acoesSem.map(acao => (
                          <div key={acao.id} className={cn(
                            'group rounded-xl border p-3 space-y-2 transition-colors',
                            acao.status === 'feito'     ? 'border-emerald-100 bg-emerald-50/50' :
                            acao.status === 'bloqueado' ? 'border-amber-100 bg-amber-50/50' :
                            acao.status === 'nao_feito' ? 'border-red-100 bg-red-50/50' :
                            'border-gray-100 bg-gray-50'
                          )}>
                            <div className="flex items-start gap-2">
                              {statusIcon[acao.status]}
                              <div className="flex-1 min-w-0">
                                <input
                                  type="text" value={acao.descricao}
                                  onChange={e => onUpdateAcao(obj.id, acao.id, { descricao: e.target.value })}
                                  placeholder="Ex: Publicar 3 posts de autoridade até 15/07"
                                  className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none"
                                />
                                {acao.dataLimite && (
                                  <p className="text-[10px] text-gray-400 mt-0.5">Até {new Date(acao.dataLimite + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <input
                                  type="date"
                                  value={acao.dataLimite}
                                  onChange={e => onUpdateAcao(obj.id, acao.id, { dataLimite: e.target.value })}
                                  className="text-[10px] text-gray-400 bg-transparent border-0 focus:outline-none w-28 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Data limite"
                                />
                                <button
                                  onClick={() => onDeleteAcao(obj.id, acao.id)}
                                  className="p-1 rounded text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 pl-6 flex-wrap">
                              {(['feito','nao_feito','bloqueado','pendente'] as AcaoStatus[]).map(s => (
                                <button key={s} onClick={() => onUpdateAcao(obj.id, acao.id, { status: s })}
                                  className={cn(
                                    'text-[9px] font-medium px-2 py-1 rounded transition-colors',
                                    acao.status === s
                                      ? s === 'feito'     ? 'bg-emerald-100 text-emerald-700'
                                      : s === 'bloqueado' ? 'bg-amber-100 text-amber-700'
                                      : s === 'nao_feito' ? 'bg-red-100 text-red-600'
                                      :                     'bg-gray-200 text-gray-600'
                                      : 'text-gray-300 hover:text-gray-500'
                                  )}>
                                  {statusLabel[s]}
                                </button>
                              ))}
                            </div>
                            {(acao.status === 'nao_feito' || acao.status === 'bloqueado') && (
                              <input
                                type="text" value={acao.obs}
                                onChange={e => onUpdateAcao(obj.id, acao.id, { obs: e.target.value })}
                                placeholder="O que aconteceu? (opcional)"
                                className="w-full pl-6 bg-transparent text-xs text-gray-500 placeholder:text-gray-300 focus:outline-none border-t border-gray-200 pt-2"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── O QUE MELHORAR ── */}
          {obj.pdcaTab === 'a' && (
            <OQueMelhorar obj={obj} color={color} identidade={identidade} />
          )}
        </>
      )}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   O QUE MELHORAR — contextual
───────────────────────────────────────────── */
function OQueMelhorar({
  obj, color, identidade,
}: {
  obj: Objective
  color: string
  identidade: ReturnType<typeof getIdentidade>
}) {
  const krsAbaixo = obj.keyResults.filter(kr => getProgress(kr.atual, kr.meta) < 50)
  const acoesPendentes = obj.pdca.acoes.filter(a => a.semana < obj.pdca.semanaAtual && a.status === 'pendente').length
  const acoesBloqueadas = obj.pdca.acoes.filter(a => a.status === 'bloqueado').length
  const totalAcoesPast = obj.pdca.acoes.filter(a => a.semana < obj.pdca.semanaAtual).length
  const acoesFeitasPast = obj.pdca.acoes.filter(a => a.semana < obj.pdca.semanaAtual && a.status === 'feito').length
  const ritmoExecucao = totalAcoesPast > 0 ? Math.round((acoesFeitasPast / totalAcoesPast) * 100) : null

  const proposta = identidade?.pilares.proposta?.reflexao?.trim()
  const publicoAlvo = identidade?.pilares.publicoAlvo?.reflexao?.trim()
  const diferencial = identidade?.diferenciais?.[0]

  const melhorias: { titulo: string; descricao: string; prioridade: 'alta' | 'media' | 'baixa' }[] = []

  if (ritmoExecucao !== null && ritmoExecucao < 60) {
    melhorias.push({
      titulo: 'Ritmo de execução abaixo do ideal',
      descricao: `Apenas ${ritmoExecucao}% das ações passadas foram concluídas. Revise se as ações são realistas para seu tempo disponível ou se há bloqueios não identificados.`,
      prioridade: ritmoExecucao < 40 ? 'alta' : 'media',
    })
  }

  if (acoesBloqueadas > 0) {
    melhorias.push({
      titulo: `${acoesBloqueadas} ação${acoesBloqueadas > 1 ? 'ões' : ''} bloqueada${acoesBloqueadas > 1 ? 's' : ''}`,
      descricao: 'Ações bloqueadas precisam de atenção imediata. Identifique a causa raiz: falta de recurso, dependência externa ou prioridade conflitante?',
      prioridade: 'alta',
    })
  }

  if (krsAbaixo.length > 0) {
    krsAbaixo.slice(0, 2).forEach(kr => {
      const pct = getProgress(kr.atual, kr.meta)
      melhorias.push({
        titulo: `KR abaixo de 50%: "${kr.descricao.slice(0, 55)}${kr.descricao.length > 55 ? '...' : ''}"`,
        descricao: pct === 0
          ? 'Nenhum progresso registrado ainda. Certifique-se de que há ações concretas no Plano de Ação e na Agenda Executiva para este resultado.'
          : `Progresso em ${pct}%. Adicione mais ações específicas ou reavalie se a meta está calibrada corretamente com seu mentor.`,
        prioridade: pct === 0 ? 'alta' : 'media',
      })
    })
  }

  if (proposta && krsAbaixo.length > 0) {
    melhorias.push({
      titulo: 'Alinhar ações à sua proposta de valor',
      descricao: `Suas ações estão comunicando "${proposta.slice(0, 80)}${proposta.length > 80 ? '...' : ''}"? Cada entrega semanal deve reforçar o que te diferencia.`,
      prioridade: 'media',
    })
  }

  if (publicoAlvo && acoesPendentes > 0) {
    melhorias.push({
      titulo: 'Ações pendentes de semanas anteriores',
      descricao: `${acoesPendentes} ação${acoesPendentes > 1 ? 'ões' : ''} de semanas passadas ainda pendente${acoesPendentes > 1 ? 's' : ''}. ${publicoAlvo ? `Seu público-alvo (${publicoAlvo.slice(0, 50)}${publicoAlvo.length > 50 ? '...' : ''}) precisa de consistência para te reconhecer.` : 'Consistência é fundamental para construir autoridade.'}`,
      prioridade: 'media',
    })
  }

  if (diferencial && obj.keyResults.length === 0) {
    melhorias.push({
      titulo: 'Objetivo sem métricas definidas',
      descricao: `Sem Key Results, não há como saber se está avançando. Defina indicadores que meçam se "${diferencial.slice(0, 60)}${diferencial.length > 60 ? '...' : ''}" está sendo percebido pelo seu mercado.`,
      prioridade: 'alta',
    })
  }

  if (melhorias.length === 0) {
    const hasDados = obj.pdca.acoes.filter(a => a.semana < obj.pdca.semanaAtual).length > 0

    return (
      <div className="p-6 text-center">
        {hasDados ? (
          <>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={20} className="text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Execução no ritmo certo!</p>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              Seus indicadores estão dentro do esperado. Continue executando e volte aqui ao final da semana.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-1">Ainda sem dados de execução</p>
            <p className="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto">
              Registre ações na <strong>Agenda Executiva</strong> e atualize os resultados em <strong>Como Vou Medir</strong>. Os ajustes aparecem aqui automaticamente.
            </p>
          </>
        )}
      </div>
    )
  }

  const priorColors = { alta: '#EF4444', media: '#F59E0B', baixa: '#10B981' }
  const priorLabel = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }

  return (
    <div className="p-5 space-y-3">
      <p className="text-xs text-gray-500 leading-relaxed">
        Baseado nos seus dados de execução e no diagnóstico da sua identidade:
      </p>
      {melhorias.slice(0, 4).map((m, i) => (
        <div key={i} className="rounded-xl border border-gray-100 p-4 bg-gray-50/50">
          <div className="flex items-start gap-3">
            <span className="text-[11px] font-semibold flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded"
              style={{ background: `${priorColors[m.prioridade]}15`, color: priorColors[m.prioridade] }}>
              {priorLabel[m.prioridade]}
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-800 leading-snug mb-1">{m.titulo}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{m.descricao}</p>
            </div>
          </div>
        </div>
      ))}
      <p className="text-[11px] text-gray-400 pt-1 border-t border-gray-100">
        Estes ajustes são gerados automaticamente com base na sua execução e identidade de marca.
      </p>
    </div>
  )
}
