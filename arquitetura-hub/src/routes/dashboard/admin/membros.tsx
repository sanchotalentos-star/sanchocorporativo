import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, Lock, Unlock, Check, Users } from 'lucide-react'
import { fadeInUp } from '@/lib/motion'
import { mockMembers } from '@/lib/mocks/members'
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

const FASES: { num: Fase; label: string }[] = [
  { num: 1, label: 'OKR e MVP'          },
  { num: 2, label: 'Primeiras Vitórias' },
  { num: 3, label: 'Plano em Ação'      },
  { num: 4, label: 'Escala'             },
]

const BLOCOS_IDENTIDADE: { id: keyof MenteeControls['identidade']; num: string; label: string; placeholder: string }[] = [
  { id: 'publicoAlvo',    num: '01', label: 'Para Quem Você Fala',            placeholder: 'Análise do mentor sobre o público ideal...' },
  { id: 'proposta',       num: '02', label: 'O Que Você Entrega de Diferente', placeholder: 'Análise do mentor sobre a proposta de valor...' },
  { id: 'storytelling',   num: '03', label: 'Sua História que Conecta',        placeholder: 'Análise do mentor sobre a narrativa...' },
  { id: 'formatoProduto', num: '04', label: 'Como Você Chega ao Mercado',      placeholder: 'Análise do mentor sobre o formato e precificação...' },
  { id: 'diferencial',    num: '00', label: 'Seu Maior Diferencial',           placeholder: 'Declaração do diferencial construída com o mentor...' },
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

  function setFase(memberId: string, fase: Fase) {
    setControls(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], fase },
    }))
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
        <h1 className="text-2xl font-bold text-gray-900">Mentorados</h1>
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

          return (
            <motion.div key={member.id} variants={fadeInUp} initial="hidden" animate="visible"
              className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
            >
              {/* Linha do mentorado */}
              <button
                onClick={() => setExpanded(isOpen ? null : member.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7B2FBE] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {member.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{member.full_name}</p>
                  <p className="text-xs text-gray-400">{member.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-right flex-shrink-0">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Fase</p>
                    <p className="text-xs font-bold text-gray-700">{ctrl.fase} — {faseLabel}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Identidade</p>
                    <p className="text-xs font-bold text-gray-700">{desbloqueados}/5 blocos</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Pontos</p>
                    <p className="text-xs font-bold text-[#7B2FBE]">{member.score} pts</p>
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
                    <div className="border-t border-gray-100 px-5 py-5 space-y-6 bg-gray-50/50">

                      {/* Fase da jornada */}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Fase da Jornada</p>
                        <div className="flex flex-wrap gap-2">
                          {FASES.map(fase => (
                            <button
                              key={fase.num}
                              onClick={() => setFase(member.id, fase.num)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
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
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Identidade de Marca</p>
                        <div className="space-y-2.5">
                          {BLOCOS_IDENTIDADE.map(bloco => {
                            const blocoState  = ctrl.identidade[bloco.id]
                            const isUnlocked  = blocoState.desbloqueado
                            const analiseVal  = 'analise' in blocoState ? blocoState.analise : (blocoState as { texto: string }).texto

                            return (
                              <div key={bloco.id}
                                className={`rounded-xl border p-4 transition-all ${
                                  isUnlocked ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-100'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3 mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-[#7B2FBE] tracking-widest">{bloco.num}</span>
                                    <p className={`text-sm font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                                      {bloco.label}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => toggleBloco(member.id, bloco.id)}
                                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                      isUnlocked
                                        ? 'bg-[#7B2FBE]/10 text-[#7B2FBE] hover:bg-[#7B2FBE]/20'
                                        : 'bg-white border border-gray-200 text-gray-500 hover:border-[#7B2FBE]/30 hover:text-[#7B2FBE]'
                                    }`}
                                  >
                                    {isUnlocked ? <Unlock size={12} /> : <Lock size={12} />}
                                    {isUnlocked ? 'Desbloqueado' : 'Bloquear / Desbloquear'}
                                  </button>
                                </div>

                                {isUnlocked && (
                                  <div className="space-y-2">
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
                                        className="text-xs font-semibold text-[#7B2FBE] hover:underline"
                                      >
                                        Salvar análise
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
