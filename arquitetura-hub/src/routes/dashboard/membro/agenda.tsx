import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Calendar, Target, Megaphone, ChevronRight, Filter } from 'lucide-react'
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

const STATUS_CONFIG: Record<AcaoStatus, { label: string; bg: string; text: string; dot: string }> = {
  feito:     { label: 'Feito',      bg: '#DCFCE7', text: '#166534', dot: '#22C55E' },
  nao_feito: { label: 'Não feito',  bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
  bloqueado: { label: 'Bloqueado',  bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  pendente:  { label: 'Pendente',   bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
}

function StatusChip({ status }: { status: AcaoStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 500,
      background: cfg.bg,
      color: cfg.text,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  )
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

  const totalOkr   = itens.filter(i => i.tipo === 'okr').length
  const totalMkt   = itens.filter(i => i.tipo === 'marketing').length
  const feitos     = itens.filter(i => i.status === 'feito').length
  const pendentes  = itens.filter(i => i.status === 'pendente').length
  const bloqueados = itens.filter(i => i.status === 'bloqueado').length

  const semanas = [1, 2, 3, 4]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Agenda Executiva</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Visão integrada das suas ações de OKR e Marketing
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

      {/* Summary strip */}
      {itens.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Target size={12} className="text-[#7B2FBE]" />
            <span className="text-xs text-gray-500">{totalOkr} OKRs</span>
          </div>
          <span className="text-gray-200">·</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Megaphone size={12} className="text-[#7B2FBE]" />
            <span className="text-xs text-gray-500">{totalMkt} Marketing</span>
          </div>
          <span className="text-gray-200">·</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
            <span className="text-xs text-gray-500">{feitos} feitos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#9CA3AF', flexShrink: 0 }} />
            <span className="text-xs text-gray-500">{pendentes} pendentes</span>
          </div>
          {bloqueados > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
              <span className="text-xs text-gray-500">{bloqueados} bloqueados</span>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {itens.length === 0 && (
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-10 text-center">
          <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500 mb-1">Agenda ainda vazia</p>
          <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed mb-5">
            Adicione ações nos seus OKRs e no Marketing Anual. Elas aparecem aqui automaticamente.
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
        </div>
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

          {/* OKR por semana */}
          {(filtro === 'todos' || filtro === 'okr') && (
            <div className="space-y-4">
              {semanas.map(semana => {
                const acoesSem = filtered.filter(i => i.tipo === 'okr' && i.semana === semana)
                if (acoesSem.length === 0) return null

                return (
                  <div key={semana} className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                    {/* Column headers */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                      <div className="flex items-center gap-2">
                        <Target size={12} className="text-[#7B2FBE]" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Semana {semana}: OKRs</p>
                      </div>
                      <span className="text-[10px] text-gray-400">{acoesSem.length} ações</span>
                    </div>

                    {/* Column header row */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 110px 100px',
                      padding: '6px 20px',
                      borderBottom: '1px solid #F3F4F6',
                    }}>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Ação</span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Status</span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Prazo</span>
                    </div>

                    <div className="divide-y divide-gray-50">
                      {acoesSem.map(item => (
                        <div key={item.id} style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 110px 100px',
                          padding: '10px 20px',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <div className="min-w-0">
                            <p className={cn(
                              'text-sm leading-snug truncate',
                              item.status === 'feito' ? 'line-through text-gray-400' : 'text-gray-800'
                            )}>
                              {item.titulo}
                            </p>
                            {item.objetivo && (
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate">→ {item.objetivo}</p>
                            )}
                          </div>
                          <StatusChip status={item.status ?? 'pendente'} />
                          <span className="text-[11px] text-gray-400">
                            {item.dataLimite
                              ? new Date(item.dataLimite + 'T00:00:00').toLocaleDateString('pt-BR')
                              : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Plano de entregas */}
              {(() => {
                const planoItems = filtered.filter(i => i.tipo === 'okr' && !i.semana && i.titulo !== '(sem descrição)')
                if (planoItems.length === 0) return null
                return (
                  <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                      <div className="flex items-center gap-2">
                        <Target size={12} className="text-[#7B2FBE]" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Plano de Entregas</p>
                      </div>
                      <span className="text-[10px] text-gray-400">{planoItems.length} entregas</span>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 100px',
                      padding: '6px 20px',
                      borderBottom: '1px solid #F3F4F6',
                    }}>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Entrega</span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Prazo</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {planoItems.map(item => (
                        <div key={item.id} style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 100px',
                          padding: '10px 20px',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-800 leading-snug truncate">{item.titulo}</p>
                            {item.objetivo && (
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate">→ {item.objetivo}</p>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {item.dataLimite
                              ? new Date(item.dataLimite + 'T00:00:00').toLocaleDateString('pt-BR')
                              : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                  <div key={mes} className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                      <div className="flex items-center gap-2">
                        <Megaphone size={12} className="text-[#7B2FBE]" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{mes}: Marketing</p>
                      </div>
                      <span className="text-[10px] text-gray-400">{acoesMes.length} ações</span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 110px 80px',
                      padding: '6px 20px',
                      borderBottom: '1px solid #F3F4F6',
                    }}>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Conteúdo</span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Status</span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Canal</span>
                    </div>

                    <div className="divide-y divide-gray-50">
                      {acoesMes.map(item => (
                        <div key={item.id} style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 110px 80px',
                          padding: '10px 20px',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <p className={cn(
                            'text-sm leading-snug truncate',
                            item.status === 'feito' ? 'line-through text-gray-400' : 'text-gray-800'
                          )}>
                            {item.titulo}
                          </p>
                          <StatusChip status={item.status ?? 'pendente'} />
                          <span className="text-[11px] text-gray-400 truncate">{item.canal ?? ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-sm text-gray-400">Nenhuma ação para este filtro</p>
            </div>
          )}
        </>
      )}

      {/* Integração futura */}
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-5 text-center">
        <Calendar size={20} className="text-gray-300 mx-auto mb-2" />
        <p className="text-xs font-medium text-gray-500 mb-1">Integração com Google Agenda</p>
        <p className="text-xs text-gray-400">
          Em breve, suas ações serão sincronizadas automaticamente com o Google Agenda.
        </p>
      </div>
    </div>
  )
}
