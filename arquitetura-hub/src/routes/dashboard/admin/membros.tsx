import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, Lock, Unlock, Check, PenLine, MessageSquare } from 'lucide-react'
import { fadeInUp } from '@/lib/motion'
import { mockMembers } from '@/lib/mocks/members'
import { IDENTIDADE_KEY } from '@/lib/identidade'
import type { Member } from '@/types'

export const Route = createFileRoute('/dashboard/admin/membros')({
  component: MembrosPage,
})

type Fase = 1 | 2 | 3 | 4

interface BlocoIdentidade {
  desbloqueado: boolean
  analise:      string
}

interface MenteeControls {
  fase:       Fase
  identidade: {
    publicoAlvo:    BlocoIdentidade
    proposta:       BlocoIdentidade
    storytelling:   BlocoIdentidade
    formatoProduto: BlocoIdentidade
    diferencial:    { desbloqueado: boolean; texto: string }
  }
}

interface IdentidadeStored {
  pilares: {
    publicoAlvo?:    { reflexao?: string }
    proposta?:       { reflexao?: string }
    storytelling?:   { reflexao?: string }
    formatoProduto?: { reflexao?: string }
  }
  diferenciais?: string[]
}

function loadIdentidade(): IdentidadeStored | null {
  try { return JSON.parse(localStorage.getItem(IDENTIDADE_KEY) ?? 'null') }
  catch { return null }
}

const FASES: { num: Fase; label: string }[] = [
  { num: 1, label: 'OKR e MVP'          },
  { num: 2, label: 'Primeiras Vitórias' },
  { num: 3, label: 'Plano em Ação'      },
  { num: 4, label: 'Escala'             },
]

const BLOCOS_IDENTIDADE: {
  id: keyof MenteeControls['identidade']
  num: string
  label: string
  placeholder: string
  reflexaoKey?: keyof IdentidadeStored['pilares']
}[] = [
  { id: 'publicoAlvo',    num: '01', label: 'Para Quem Você Fala',             placeholder: 'Análise do mentor sobre o público ideal...',          reflexaoKey: 'publicoAlvo'    },
  { id: 'proposta',       num: '02', label: 'O Que Você Entrega de Diferente',  placeholder: 'Análise do mentor sobre a proposta de valor...',       reflexaoKey: 'proposta'       },
  { id: 'storytelling',   num: '03', label: 'Sua História que Conecta',         placeholder: 'Análise do mentor sobre a narrativa...',               reflexaoKey: 'storytelling'   },
  { id: 'formatoProduto', num: '04', label: 'Como Você Chega ao Mercado',       placeholder: 'Análise do mentor sobre o formato e precificação...',  reflexaoKey: 'formatoProduto' },
  { id: 'diferencial',    num: '05', label: 'O Que Te Destaca da Concorrência', placeholder: 'Análise do mentor sobre os diferenciais...' },
]

function makeDefault(): MenteeControls {
  return {
    fase: 1,
    identidade: {
      publicoAlvo:    { desbloqueado: false, analise: '' },
      proposta:       { desbloqueado: false, analise: '' },
      storytelling:   { desbloqueado: false, analise: '' },
      formatoProduto: { desbloqueado: false, analise: '' },
      diferencial:    { desbloqueado: false, texto:   '' },
    },
  }
}

function MembrosPage() {
  const [controls, setControls] = useState<Record<string, MenteeControls>>(
    () => Object.fromEntries(mockMembers.map(m => [m.id, makeDefault()]))
  )
  const [expanded, setExpanded] = useState<string | null>(null)

  // Lê as respostas que o membro preencheu no navegador (localStorage compartilhado na demo)
  const identidadeData = loadIdentidade()

  function getMemberReflexao(memberId: string, reflexaoKey?: keyof IdentidadeStored['pilares']): string {
    // Na demo, o member-2 (Wladson) é quem preencheu os dados do localStorage
    if (memberId !== 'member-2' || !reflexaoKey || !identidadeData) return ''
    return identidadeData.pilares?.[reflexaoKey]?.reflexao?.trim() ?? ''
  }

  function getMemberDiferenciais(memberId: string): string[] {
    if (memberId !== 'member-2' || !identidadeData) return []
    return (identidadeData.diferenciais ?? []).filter(d => d.trim())
  }

  function setFase(memberId: string, fase: Fase) {
    setControls(prev => ({ ...prev, [memberId]: { ...prev[memberId], fase } }))
    const member = mockMembers.find(m => m.id === memberId)
    toast.success(`Fase atualizada para ${FASES.find(f => f.num === fase)?.label}`, {
      description: member?.full_name,
    })
  }

  function toggleBloco(memberId: string, blocoId: keyof MenteeControls['identidade']) {
    setControls(prev => {
      const current = prev[memberId].identidade[blocoId]
      const nowUnlocked = !current.desbloqueado
      const member = mockMembers.find(m => m.id === memberId)
      const bloco = BLOCOS_IDENTIDADE.find(b => b.id === blocoId)
      if (nowUnlocked) {
        toast.success(`Bloco desbloqueado: ${bloco?.label}`, { description: member?.full_name })
      }
      return {
        ...prev,
        [memberId]: {
          ...prev[memberId],
          identidade: {
            ...prev[memberId].identidade,
            [blocoId]: { ...current, desbloqueado: nowUnlocked },
          },
        },
      }
    })
  }

  function setAnalise(memberId: string, blocoId: keyof MenteeControls['identidade'], value: string) {
    setControls(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        identidade: {
          ...prev[memberId].identidade,
          [blocoId]: { ...prev[memberId].identidade[blocoId], analise: value, texto: value },
        },
      },
    }))
  }

  function saveAnalise(memberId: string) {
    const member = mockMembers.find(m => m.id === memberId)
    toast.success('Análise salva', { description: `Visível para ${member?.full_name} na plataforma` })
  }

  const desbloqueadosPor = (id: string) =>
    Object.values(controls[id]?.identidade ?? {}).filter(b => b.desbloqueado).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Mentorados</h1>
        <p className="text-gray-400 mt-1 text-sm">
          {mockMembers.length} participantes ativos. Clique em um mentorado para gerenciar a jornada.
        </p>
      </div>

      <div className="space-y-3">
        {mockMembers.map((member: Member) => {
          const ctrl          = controls[member.id]
          const isOpen        = expanded === member.id
          const faseLabel     = FASES.find(f => f.num === ctrl.fase)?.label ?? ''
          const desbloqueados = desbloqueadosPor(member.id)
          const reflexoesPreenchidas = BLOCOS_IDENTIDADE.filter(b =>
            b.reflexaoKey ? getMemberReflexao(member.id, b.reflexaoKey).length > 0 : getMemberDiferenciais(member.id).length > 0
          ).length

          return (
            <motion.div key={member.id} variants={fadeInUp} initial="hidden" animate="visible"
              className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
            >
              {/* Linha do mentorado */}
              <button
                onClick={() => setExpanded(isOpen ? null : member.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7B2FBE] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {member.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{member.full_name}</p>
                  <p className="text-xs text-gray-400">{member.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-right flex-shrink-0">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Fase</p>
                    <p className="text-xs font-semibold text-gray-700">{ctrl.fase} — {faseLabel}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Reflexões</p>
                    <p className="text-xs font-semibold" style={{ color: reflexoesPreenchidas > 0 ? '#7B2FBE' : '#9CA3AF' }}>
                      {reflexoesPreenchidas}/5 blocos
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Desbloqueados</p>
                    <p className="text-xs font-semibold text-gray-700">{desbloqueados}/5</p>
                  </div>
                </div>
                {isOpen
                  ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                  : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                }
              </button>

              {/* Painel expandido */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 px-5 py-5 space-y-6 bg-gray-50/30">

                      {/* Fase da jornada */}
                      <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">Fase da Jornada</p>
                        <div className="flex flex-wrap gap-2">
                          {FASES.map(fase => (
                            <button
                              key={fase.num}
                              onClick={() => setFase(member.id, fase.num)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                ctrl.fase === fase.num
                                  ? 'bg-[#7B2FBE] text-white shadow-sm'
                                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#7B2FBE]/30'
                              }`}
                            >
                              {ctrl.fase === fase.num && <Check size={13} />}
                              {fase.num}. {fase.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Blocos da Identidade */}
                      <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">Identidade de Marca</p>
                        <div className="space-y-3">
                          {BLOCOS_IDENTIDADE.map(bloco => {
                            const blocoState  = ctrl.identidade[bloco.id]
                            const isUnlocked  = blocoState.desbloqueado
                            const analiseVal  = 'analise' in blocoState ? blocoState.analise : (blocoState as { texto: string }).texto

                            const reflexao = bloco.reflexaoKey
                              ? getMemberReflexao(member.id, bloco.reflexaoKey)
                              : undefined
                            const difs = bloco.id === 'diferencial'
                              ? getMemberDiferenciais(member.id)
                              : undefined

                            const temReflexao = reflexao ? reflexao.length > 0 : (difs?.length ?? 0) > 0

                            return (
                              <div key={bloco.id}
                                className={`rounded-xl border overflow-hidden transition-all ${
                                  isUnlocked ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
                                }`}
                              >
                                {/* Cabeçalho do bloco */}
                                <div className="flex items-center justify-between gap-3 px-4 py-3">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-[10px] font-medium text-[#7B2FBE] flex-shrink-0">{bloco.num}</span>
                                    <p className={`text-sm font-semibold truncate ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                                      {bloco.label}
                                    </p>
                                    {temReflexao && (
                                      <span className="text-[9px] font-medium bg-[#7B2FBE]/10 text-[#7B2FBE] px-1.5 py-0.5 rounded-full flex-shrink-0">
                                        Preenchido
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => toggleBloco(member.id, bloco.id)}
                                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${
                                      isUnlocked
                                        ? 'bg-[#7B2FBE]/10 text-[#7B2FBE] hover:bg-[#7B2FBE]/20'
                                        : 'bg-white border border-gray-200 text-gray-500 hover:border-[#7B2FBE]/30 hover:text-[#7B2FBE]'
                                    }`}
                                  >
                                    {isUnlocked ? <Unlock size={12} /> : <Lock size={12} />}
                                    {isUnlocked ? 'Desbloqueado' : 'Desbloquear'}
                                  </button>
                                </div>

                                {/* Reflexão do membro — sempre visível para o mentor */}
                                {temReflexao && (
                                  <div className="px-4 pb-3 border-t border-gray-100">
                                    <div className="flex items-center gap-1.5 mt-3 mb-2">
                                      <PenLine size={11} className="text-[#7B2FBE]" />
                                      <p className="text-[10px] font-medium text-[#7B2FBE] uppercase tracking-wide">
                                        Resposta do mentorado
                                      </p>
                                    </div>
                                    {bloco.id === 'diferencial' && difs ? (
                                      <div className="rounded-xl bg-[#7B2FBE]/[0.04] border border-[#7B2FBE]/10 px-4 py-3 space-y-1.5">
                                        {difs.map((d, i) => (
                                          <div key={i} className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#7B2FBE]/50 flex-shrink-0" />
                                            <p className="text-sm text-gray-700">{d}</p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="rounded-xl bg-[#7B2FBE]/[0.04] border border-[#7B2FBE]/10 px-4 py-3">
                                        <p className="text-sm text-gray-700 leading-relaxed">{reflexao}</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Análise do mentor — aparece quando desbloqueado */}
                                {isUnlocked && (
                                  <div className="px-4 pb-4 border-t border-gray-100 space-y-2">
                                    <div className="flex items-center gap-1.5 mt-3">
                                      <MessageSquare size={11} className="text-gray-400" />
                                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                                        Análise do mentor
                                      </p>
                                    </div>
                                    <textarea
                                      value={analiseVal}
                                      onChange={e => setAnalise(member.id, bloco.id, e.target.value)}
                                      placeholder={bloco.placeholder}
                                      rows={3}
                                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]/20 resize-none"
                                    />
                                    {analiseVal.trim() && (
                                      <button
                                        onClick={() => saveAnalise(member.id)}
                                        className="text-xs font-medium text-[#7B2FBE] hover:underline"
                                      >
                                        Salvar análise →
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
