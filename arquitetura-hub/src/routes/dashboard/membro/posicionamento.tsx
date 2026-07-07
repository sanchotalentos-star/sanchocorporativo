import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Unlock, Edit3, Save, Check, Sparkles } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/membro/posicionamento')({
  component: PosicionamentoPage,
})

/* ─────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────── */
interface PosicionamentoData {
  zonaGenialidade: string
  publicoAlvo:     string
  proposta:        string
  storytelling:    string
  formatoProduto:  string
  diferenciais:    string[]
}

type PilarStatus = 'bloqueado' | 'descobrindo' | 'definido' | 'validado'

interface PilarState {
  locked:    boolean
  status:    PilarStatus
}

/* ─────────────────────────────────────────────
   CONFIG DE STATUS VISUAL
───────────────────────────────────────────── */
const statusConfig: Record<PilarStatus, { label: string; color: string; bg: string }> = {
  bloqueado:   { label: 'Aguardando sessão',   color: '#9CA3AF', bg: '#F3F4F6' },
  descobrindo: { label: 'Em descoberta',        color: '#D97706', bg: '#FEF3C7' },
  definido:    { label: 'Definido',             color: '#3B82F6', bg: '#EFF6FF' },
  validado:    { label: 'Validado pelo mentor', color: '#7B2FBE', bg: '#F3E8FF' },
}

/* ─────────────────────────────────────────────
   OS 4 PILARES
───────────────────────────────────────────── */
type PilarField = 'publicoAlvo' | 'proposta' | 'storytelling' | 'formatoProduto'

const PILARES: {
  id:          PilarField
  num:         string
  label:       string
  desc:        string
  lockDesc:    string
  dica:        string
  placeholder: string
}[] = [
  {
    id:          'publicoAlvo',
    num:         '01',
    label:       'Para Quem Você Fala',
    desc:        'A pessoa exata que mais se transforma com o seu trabalho',
    lockDesc:    'Na sessão de posicionamento, você e seu mentor vão mapear quem é a pessoa ideal que se transforma com o que você faz. Esse bloco é construído juntos.',
    dica:        'Seja específico: cargo, momento de vida, principal dor, o que ela já tentou antes de te encontrar.',
    placeholder: 'Ex: Profissionais liberais entre 35–50 anos que têm expertise consolidada mas ainda trocam horas por dinheiro e querem criar um produto de alto valor...',
  },
  {
    id:          'proposta',
    num:         '02',
    label:       'O Que Você Entrega de Diferente',
    desc:        'O resultado transformador que só você entrega do seu jeito',
    lockDesc:    'Sua proposta de valor nasce do cruzamento entre o que você faz de melhor e o que seu público mais precisa. Isso é trabalhado com seu mentor na sessão de posicionamento.',
    dica:        'Foque no RESULTADO da transformação, não no processo. O que a pessoa tem depois de trabalhar com você que não tinha antes?',
    placeholder: 'Ex: Em 90 dias, profissionais de saúde saem de uma agenda lotada para um produto digital estruturado e a primeira venda realizada...',
  },
  {
    id:          'storytelling',
    num:         '03',
    label:       'Sua História que Conecta',
    desc:        'O momento de virada que explica por que você faz o que faz',
    lockDesc:    'Toda autoridade tem uma história de transformação. Na sessão de storytelling, vocês vão construir a narrativa que conecta quem você era ao que você entrega hoje.',
    dica:        'Boa história tem: o antes (dor/limitação), o momento de virada, e o depois (o que você conquistou e como isso te capacita a ajudar outros).',
    placeholder: 'Ex: Por 8 anos fui consultor trocando horas por dinheiro. Quando criei meu primeiro produto, percebi que meu conhecimento valia muito mais do que meu tempo disponível...',
  },
  {
    id:          'formatoProduto',
    num:         '04',
    label:       'Como Você Chega ao Mercado',
    desc:        'O formato, a estrutura e o preço do que você oferece',
    lockDesc:    'A formatação do seu produto é definida com base no seu público, no seu diferencial e no modelo de negócio que faz sentido para você. Isso é trabalhado na fase de MVP.',
    dica:        'Descreva: formato (mentoria, grupo, curso, consultoria), duração, frequência de encontros, canais e faixa de preço.',
    placeholder: 'Ex: Mentoria individual de 3 meses — 6 sessões de 1h via Google Meet + canal de suporte no WhatsApp. Investimento: R$ 4.800 à vista ou 3× R$ 1.700...',
  },
]

/* ─────────────────────────────────────────────
   ESTADO INICIAL
   Todos os blocos começam BLOQUEADOS para um
   novo mentorado. O mentor desbloqueia no admin.
───────────────────────────────────────────── */
const initialData: PosicionamentoData = {
  zonaGenialidade: '',
  publicoAlvo:     '',
  proposta:        '',
  storytelling:    '',
  formatoProduto:  '',
  diferenciais:    ['', '', ''],
}

const initialPilarStates: Record<PilarField, PilarState> = {
  publicoAlvo:    { locked: true, status: 'bloqueado' },
  proposta:       { locked: true, status: 'bloqueado' },
  storytelling:   { locked: true, status: 'bloqueado' },
  formatoProduto: { locked: true, status: 'bloqueado' },
}

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
function PosicionamentoPage() {
  const [data, setData]               = useState<PosicionamentoData>(initialData)
  const [editing, setEditing]         = useState<string | null>(null)
  const [saved, setSaved]             = useState(false)
  const [genLocked, setGenLocked]     = useState(true)
  const [pilarStates, setPilarStates] = useState(initialPilarStates)

  function updateField(field: PilarField, value: string) {
    setData(prev => ({ ...prev, [field]: value }))
    setPilarStates(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        status: value.trim().length > 0 ? 'definido' : 'descobrindo',
      },
    }))
  }

  function handleSave() {
    setSaved(true)
    setEditing(null)
    setTimeout(() => setSaved(false), 2000)
  }

  const totalBlocos = PILARES.length + 1
  const preenchidos = PILARES.filter(p => data[p.id].trim().length > 0).length
                    + (data.zonaGenialidade.trim() ? 1 : 0)
  const desbloqueados = PILARES.filter(p => !pilarStates[p.id].locked).length
                      + (genLocked ? 0 : 1)
  const completionPct = desbloqueados === 0
    ? 0
    : Math.round((preenchidos / totalBlocos) * 100)

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quem Você É no Mercado</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Construído sessão a sessão com seu mentor — cada bloco desbloqueado é um passo da sua jornada
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#6D28D9] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
        >
          <Save size={15} />
          {saved ? 'Salvo!' : 'Salvar'}
        </button>
      </div>

      {/* ── Progresso ── */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">Seu Perfil de Autoridade</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {desbloqueados} de {totalBlocos} blocos desbloqueados pelo mentor
            </p>
          </div>
          <span className="text-xl font-bold text-[#7B2FBE]">{completionPct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${completionPct}%`, background: 'linear-gradient(90deg, #7B2FBE, #a855f7)' }}
          />
        </div>
        {desbloqueados === 0 && (
          <p className="text-xs text-gray-400 mt-3 text-center">
            Os blocos serão desbloqueados à medida que você avança nas sessões com seu mentor
          </p>
        )}
      </motion.div>

      {/* ── BLOCO 00 — Seu Maior Diferencial ── */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className={cn(
          'rounded-2xl border p-6 transition-all duration-300',
          genLocked
            ? 'bg-gray-50 border-gray-100'
            : data.zonaGenialidade
              ? 'bg-[#7B2FBE]/5 border-[#7B2FBE]/25'
              : 'bg-white border-gray-100 shadow-sm'
        )}
      >
        {/* Header do bloco */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
              genLocked ? 'bg-gray-200' : 'bg-[#7B2FBE]/10'
            )}>
              {genLocked
                ? <Lock size={15} className="text-gray-400" />
                : <Sparkles size={15} className="text-[#7B2FBE]" />
              }
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">00</span>
                <p className={cn('text-base font-bold', genLocked ? 'text-gray-400' : 'text-gray-900')}>
                  Seu Maior Diferencial
                </p>
                <span
                  className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    color:      genLocked ? statusConfig.bloqueado.color : data.zonaGenialidade ? statusConfig.validado.color : statusConfig.descobrindo.color,
                    background: genLocked ? statusConfig.bloqueado.bg   : data.zonaGenialidade ? statusConfig.validado.bg   : statusConfig.descobrindo.bg,
                  }}
                >
                  {genLocked ? 'Aguardando sessão' : data.zonaGenialidade ? 'Definido' : 'Em descoberta'}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Onde seu talento, sua paixão e o impacto que você gera convergem em algo único
              </p>
            </div>
          </div>
          {!genLocked && data.zonaGenialidade && (
            <button
              onClick={() => setEditing(editing === 'gen' ? null : 'gen')}
              className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <Edit3 size={14} />
            </button>
          )}
        </div>

        {/* Conteúdo — bloqueado */}
        {genLocked ? (
          <div className="ml-11 space-y-3">
            <p className="text-sm text-gray-500 leading-relaxed">
              Seu maior diferencial será revelado ao longo da mentoria. A cada sessão, você vai descobrir mais sobre o que te torna único no mercado.
            </p>
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-gray-200">
              <Lock size={13} className="text-gray-300 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-400 leading-relaxed">
                Este bloco é desbloqueado pelo seu mentor quando chega o momento certo na sua jornada — geralmente após as sessões de mapeamento do seu potencial.
              </p>
            </div>
          </div>
        ) : (
          /* Conteúdo — desbloqueado */
          <div className="ml-11 space-y-3">
            {editing === 'gen' || !data.zonaGenialidade ? (
              <>
                <textarea
                  autoFocus={editing === 'gen'}
                  value={data.zonaGenialidade}
                  onChange={e => setData(prev => ({ ...prev, zonaGenialidade: e.target.value }))}
                  placeholder="Descreva em uma frase o que te torna único — o cruzamento entre o que você faz de melhor e o impacto que isso gera..."
                  rows={3}
                  className="w-full bg-white border border-[#7B2FBE]/30 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 resize-none"
                />
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5 leading-relaxed">
                  Dica: seja específico. Não é "sou bom em comunicação" — é "transformo conhecimento técnico em narrativas simples que fazem pessoas decidirem agir".
                </p>
              </>
            ) : (
              <div className="bg-white rounded-xl border border-[#7B2FBE]/20 px-4 py-3.5">
                <p className="text-sm text-gray-800 leading-relaxed italic">"{data.zonaGenialidade}"</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* ── OS 4 PILARES ── */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          Os 4 Pilares da Sua Marca
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-4"
        >
          {PILARES.map((pilar) => {
            const state    = pilarStates[pilar.id]
            const isLocked = state.locked
            const status   = state.status
            const sConfig  = statusConfig[status]
            const value    = data[pilar.id]
            const isEditing = editing === pilar.id

            return (
              <motion.div
                key={pilar.id}
                variants={fadeInUp}
                className={cn(
                  'rounded-2xl border p-5 transition-all duration-300',
                  isLocked
                    ? 'bg-gray-50 border-gray-100'
                    : isEditing
                      ? 'bg-white border-[#7B2FBE]/40 shadow-md'
                      : 'bg-white border-gray-100 shadow-sm hover:border-gray-200 hover:shadow'
                )}
              >
                {/* Pilar header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-2.5">
                    <div className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                      isLocked ? 'bg-gray-200' : 'bg-[#7B2FBE]/10'
                    )}>
                      {isLocked
                        ? <Lock size={13} className="text-gray-400" />
                        : <Unlock size={13} className="text-[#7B2FBE]" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">{pilar.num}</span>
                        <p className={cn('text-sm font-semibold', isLocked ? 'text-gray-400' : 'text-gray-900')}>
                          {pilar.label}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{pilar.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ color: sConfig.color, background: sConfig.bg }}
                    >
                      {sConfig.label}
                    </span>
                    {!isLocked && (
                      <button
                        onClick={() => setEditing(isEditing ? null : pilar.id)}
                        className="text-gray-300 hover:text-gray-600 transition-colors"
                      >
                        <Edit3 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Pilar content */}
                {isLocked ? (
                  <div className="ml-9 space-y-3">
                    <p className="text-xs text-gray-400 leading-relaxed">{pilar.lockDesc}</p>
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-white border border-gray-200">
                      <Lock size={11} className="text-gray-300 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-gray-400 italic">
                        Desbloqueado pelo mentor na sessão correspondente da sua jornada
                      </p>
                    </div>
                  </div>
                ) : isEditing ? (
                  <div className="ml-9 space-y-2.5">
                    <textarea
                      autoFocus
                      value={value}
                      onChange={e => updateField(pilar.id, e.target.value)}
                      placeholder={pilar.placeholder}
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-2 focus:ring-[#7B2FBE]/10 resize-none"
                    />
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 leading-relaxed">
                      {pilar.dica}
                    </p>
                  </div>
                ) : (
                  <div
                    className="ml-9 min-h-[64px] cursor-text rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"
                    onClick={() => setEditing(pilar.id)}
                  >
                    {value.trim() ? (
                      <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
                    ) : (
                      <p className="text-sm text-gray-300 italic flex items-center gap-1.5">
                        <Edit3 size={11} /> Clique para preencher...
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* ── O QUE TE DESTACA ── */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5"
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">05</span>
            <p className="text-sm font-semibold text-gray-900">O Que Te Destaca da Concorrência</p>
          </div>
          <p className="text-xs text-gray-500">
            Diferenciais concretos descobertos e validados ao longo da sua mentoria
          </p>
        </div>
        <div className="space-y-2.5">
          {data.diferenciais.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                d.trim() ? 'bg-[#7B2FBE]' : 'border-2 border-gray-200'
              )}>
                {d.trim() && <Check size={11} className="text-white" />}
              </div>
              <input
                type="text"
                value={d}
                onChange={e => {
                  const next = [...data.diferenciais]
                  next[i] = e.target.value
                  setData(prev => ({ ...prev, diferenciais: next }))
                }}
                placeholder={`Diferencial ${i + 1} — ex: único no Brasil a combinar X com Y para Z`}
                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]/20"
              />
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}
