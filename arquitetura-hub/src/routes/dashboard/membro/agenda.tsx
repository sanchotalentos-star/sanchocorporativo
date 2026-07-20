import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Circle, XCircle, AlertCircle, Target, Megaphone, ChevronRight, Filter } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/membro/agenda')({
  component: AgendaPage,
})

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const OKR_KEY = 'okr_store_v1'
const MARKETING_KEY = 'marketing_store_v1'

type AcaoStatus = 'pendente' | 'feito' | 'nao_feito' | 'bloqueado'

interface ItemAgenda {
  id: string
  titulo: string
  tipo: 'okr' | 'marketing'
  semana?: number
  mes?: number
  status?: AcaoStatus
  canal?: string
  objetivo?: string
  dataLimite?: string
}

const statusIcon: Record<AcaoStatus, React.ReactNode> = {
  feito:     <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />,
  nao_feito: <XCircle      size={14} className="text-red-400 flex-shrink-0"     />,
  bloqueado: <AlertCircle  size={14} className="text-amber-400 flex-shrink-0"   />,
  pendente:  <Circle       size={14} className="text-gray-300 flex-shrink-0"    />,
}

const statusLabel: Record<AcaoStatus, string> = {
  feito: 'Feito', nao_feito: 'Não feito', bloqueado: 'Bloqueado', pendente: 'Pendente',
}

function loadFromStorage<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? [] }
  catch { return [] }
}

function AgendaPage() {
  const [filtro, setFiltro] = useState<'todos' | 'okr' | 'marketing'>('todos')
  const [mesFiltro, setMesFiltro] = useState<number | null>(null)
  const [semanaFiltro, setSemanaFiltro] = useState<number | null>(null)

  const itens = useMemo<ItemAgenda[]>(() => {
    const okrs = loadFromStorage<{
      id: string
      titulo: string
      categoria: string
      pdca: { acoes: Array<{ id: string; descricao: string; semana: number; status: AcaoStatus; dataLimite?: string }>; plano: Array<{ id: string; entrega: string; dataLimite: string }> }
    }>(OKR_KEY)

    const marketing = loadFromStorage<{
      id: string
      titulo: string
      canal: string
      mes: number
      concluida: boolean
    }>(MARKETING_KEY)

    const okrItems: ItemAgenda[] = okrs.flatMap(obj =>
      [
        ...(obj.pdca?.acoes ?? []).map(a => ({
          id: `okr-acao-${a.id}`,
          titulo: a.descricao || '(sem descrição)',
          tipo: 'okr' as const,
          semana: a.semana,
          status: a.status,
          objetivo: obj.titulo,
          dataLimite: a.dataLimite,
        })),
        ...(obj.pdca?.plano ?? []).map(p => ({
          id: `okr-plano-${p.id}`,
          titulo: p.entrega || '(sem descrição)',
          tipo: 'okr' as const,
          objetivo: obj.titulo,
          dataLimite: p.dataLimite,
          status: 'pendente' as AcaoStatus,
        })),
      ]
    )

    const marketingItems: ItemAgenda[] = marketing.map(a => ({
      id: `mkt-${a.id}`,
      titulo: a.titulo,
      tipo: 'marketing' as const,
      mes: a.mes,
      status: a.concluida ? 'feito' : 'pendente',
      canal: a.canal,
    }))

    return [...okrItems, ...marketingItems]
  }, [])

  const filtered = itens.filter(item => {
    if (filtro !== 'todos' && item.tipo !== filtro) return false
    if (mesFiltro !== null && item.mes !== mesFiltro) return false
    if (semanaFiltro !== null && item.semana !== semanaFiltro) return false
    return true
  })

  const totalOkr = itens.filter(i => i.tipo === 'okr').length
  const totalMkt = itens.filter(i => i.tipo === 'marketing').length
  const feitos   = itens.filter(i => i.status === 'feito').length
  const pendentes = itens.filter(i => i.status === 'pendente').length
  const bloqueados = itens.filter(i => i.status === 'bloqueado').length

  const mesSelecionadoMkt = mesFiltro !== null
    ? filtered.filter(i => i.tipo === 'marketing')
    : []

  const semanas = [1, 2, 3, 4]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Agenda Executiva</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Visão integrada das suas ações de OKR e Marketing — tudo em um só lugar
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
          <Link to="/dashboard/membro/okr">
            <span className="hover:text-[#7B2FBE] transition-colors">OKRs</span>
          </Link>
          <span>·</span>
          <Link to="/dashboard/membro/marketing">
            <span className="hover:text-[#7B2FBE] transition-colors">Marketing</span>
          </Link>
        </div>
      </div>

      {/* Sumário */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target size={13} className="text-[#7B2FBE]" />
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">OKR</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{totalOkr}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">ações do plano</p>
        </motion.div>
        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Megaphone size={13} className="text-[#7B2FBE]" />
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Marketing</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{totalMkt}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">ações de conteúdo</p>
        </motion.div>
        <motion.div variants={fadeInUp} className="rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wide">Feito</p>
          </div>
          <p className="text-2xl font-semibold text-emerald-700">{feitos}</p>
        </motion.div>
        {bloqueados > 0 ? (
          <motion.div variants={fadeInUp} className="rounded-2xl bg-amber-50 border border-amber-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={13} className="text-amber-500" />
              <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wide">Bloqueado</p>
            </div>
            <p className="text-2xl font-semibold text-amber-700">{bloqueados}</p>
          </motion.div>
        ) : (
          <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <Circle size={13} className="text-gray-300" />
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Pendente</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{pendentes}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Estado vazio */}
      {itens.length === 0 && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible"
          className="rounded-2xl bg-white border border-gray-100 shadow-sm p-10 text-center"
        >
          <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500 mb-1">Agenda ainda vazia</p>
          <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed mb-5">
            Adicione ações nos seus OKRs e no Marketing Anual — elas aparecem aqui automaticamente.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/dashboard/membro/okr"
              className="flex items-center gap-1.5 text-xs font-medium text-[#7B2FBE] hover:underline"
            >
              <Target size={12} /> Ir para OKRs <ChevronRight size={11} />
            </Link>
            <Link to="/dashboard/membro/marketing"
              className="flex items-center gap-1.5 text-xs font-medium text-[#7B2FBE] hover:underline"
            >
              <Megaphone size={12} /> Ir para Marketing <ChevronRight size={11} />
            </Link>
          </div>
        </motion.div>
      )}

      {itens.length > 0 && (
        <>
          {/* Filtros */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {(['todos', 'okr', 'marketing'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={cn(
                    'text-xs font-medium px-3 py-1.5 rounded-md transition-colors capitalize',
                    filtro === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'
                  )}
                >
                  {f === 'todos' ? 'Tudo' : f === 'okr' ? 'OKRs' : 'Marketing'}
                </button>
              ))}
            </div>

            {/* Semana filter — only for OKR */}
            {filtro !== 'marketing' && (
              <div className="flex items-center gap-1">
                <Filter size={12} className="text-gray-300" />
                {semanas.map(s => (
                  <button key={s} onClick={() => setSemanaFiltro(semanaFiltro === s ? null : s)}
                    className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-lg transition-colors',
                      semanaFiltro === s ? 'bg-[#7B2FBE] text-white' : 'bg-gray-100 text-gray-400 hover:text-gray-700'
                    )}
                  >
                    Sem {s}
                  </button>
                ))}
              </div>
            )}

            {/* Mês filter — for marketing */}
            {filtro !== 'okr' && (
              <div className="flex gap-1 overflow-x-auto">
                {meses.map((m, i) => (
                  <button key={m} onClick={() => setMesFiltro(mesFiltro === i + 1 ? null : i + 1)}
                    className={cn(
                      'flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors',
                      mesFiltro === i + 1 ? 'bg-[#7B2FBE] text-white' : 'bg-gray-100 text-gray-400 hover:text-gray-700'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lista por semana (OKR) */}
          {(filtro === 'todos' || filtro === 'okr') && (
            <div className="space-y-4">
              {semanas.map(semana => {
                const acoesSem = filtered.filter(i => i.tipo === 'okr' && i.semana === semana)
                const semPlano = filtered.filter(i => i.tipo === 'okr' && !i.semana)
                if (semana > 1 && acoesSem.length === 0) return null
                if (semana === 1 && acoesSem.length === 0 && semPlano.length === 0 && filtro === 'todos') return null

                return (
                  <motion.div key={semana} variants={fadeInUp} initial="hidden" animate="visible"
                    className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Target size={13} className="text-[#7B2FBE]" />
                        <p className="text-sm font-semibold text-gray-900">Semana {semana} — OKRs</p>
                      </div>
                      <span className="text-[10px] text-gray-400">{acoesSem.length} ações</span>
                    </div>
                    {acoesSem.length === 0 ? (
                      <p className="px-5 py-4 text-sm text-gray-300 italic">Nenhuma ação para esta semana</p>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {acoesSem.map(item => (
                          <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                            {statusIcon[item.status ?? 'pendente']}
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                'text-sm leading-snug',
                                item.status === 'feito' ? 'line-through text-gray-400' : 'text-gray-800'
                              )}>
                                {item.titulo}
                              </p>
                              {item.objetivo && (
                                <p className="text-[10px] text-gray-400 mt-0.5 truncate">→ {item.objetivo}</p>
                              )}
                              {item.dataLimite && (
                                <p className="text-[10px] text-gray-400">
                                  Até {new Date(item.dataLimite + 'T00:00:00').toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                            <span className={cn(
                              'text-[9px] font-medium px-1.5 py-0.5 rounded flex-shrink-0',
                              item.status === 'feito'     ? 'bg-emerald-100 text-emerald-700' :
                              item.status === 'bloqueado' ? 'bg-amber-100 text-amber-700' :
                              item.status === 'nao_feito' ? 'bg-red-100 text-red-600' :
                              'bg-gray-100 text-gray-500'
                            )}>
                              {statusLabel[item.status ?? 'pendente']}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {/* Plano de entregas (sem semana) */}
              {(() => {
                const planoItems = filtered.filter(i => i.tipo === 'okr' && !i.semana && i.titulo !== '(sem descrição)')
                if (planoItems.length === 0) return null
                return (
                  <motion.div variants={fadeInUp} initial="hidden" animate="visible"
                    className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Target size={13} className="text-[#7B2FBE]" />
                        <p className="text-sm font-semibold text-gray-900">Plano de Entregas</p>
                      </div>
                      <span className="text-[10px] text-gray-400">{planoItems.length} entregas</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {planoItems.map(item => (
                        <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                          <div className="w-2 h-2 rounded-full bg-[#7B2FBE]/30 flex-shrink-0 mt-1.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 leading-snug">{item.titulo}</p>
                            {item.objetivo && (
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate">→ {item.objetivo}</p>
                            )}
                          </div>
                          {item.dataLimite && (
                            <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                              até {new Date(item.dataLimite + 'T00:00:00').toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })()}
            </div>
          )}

          {/* Marketing por mês */}
          {(filtro === 'todos' || filtro === 'marketing') && (
            <div className="space-y-4">
              {meses.map((mes, idx) => {
                const acoesMes = filtered.filter(i => i.tipo === 'marketing' && i.mes === idx + 1)
                if (acoesMes.length === 0) return null
                return (
                  <motion.div key={mes} variants={fadeInUp} initial="hidden" animate="visible"
                    className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Megaphone size={13} className="text-[#7B2FBE]" />
                        <p className="text-sm font-semibold text-gray-900">{mes} — Marketing</p>
                      </div>
                      <span className="text-[10px] text-gray-400">{acoesMes.length} ações</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {acoesMes.map(item => (
                        <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                          {statusIcon[item.status ?? 'pendente']}
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm leading-snug',
                              item.status === 'feito' ? 'line-through text-gray-400' : 'text-gray-800'
                            )}>
                              {item.titulo}
                            </p>
                            {item.canal && (
                              <p className="text-[10px] text-gray-400 mt-0.5">{item.canal}</p>
                            )}
                          </div>
                          <span className={cn(
                            'text-[9px] font-medium px-1.5 py-0.5 rounded flex-shrink-0',
                            item.status === 'feito' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                          )}>
                            {item.status === 'feito' ? 'Feito' : 'Pendente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-sm text-gray-400">Nenhuma ação para este filtro</p>
            </div>
          )}
        </>
      )}

      {/* Integração futura */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-5 text-center"
      >
        <Calendar size={20} className="text-gray-300 mx-auto mb-2" />
        <p className="text-xs font-medium text-gray-500 mb-1">Integração com Google Agenda</p>
        <p className="text-xs text-gray-400">
          Em breve, suas ações serão sincronizadas automaticamente com o Google Agenda.
        </p>
      </motion.div>
    </div>
  )
}
