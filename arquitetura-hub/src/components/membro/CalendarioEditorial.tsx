import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Evento, EventoTipo } from '@/types'

interface CalendarioEditorialProps {
  eventos: Evento[]
}

const tipoColors: Record<EventoTipo, string> = {
  'Conteúdo': '#3B82F6',
  'Evento': '#7B2FBE',
  'Mídia': '#F59E0B',
  'Relacionamento': '#10B981',
  'Meta': '#EF4444',
}

export function CalendarioEditorial({ eventos }: CalendarioEditorialProps) {
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

  const firstDay = new Date(current.year, current.month, 1)
  const lastDay = new Date(current.year, current.month + 1, 0)
  const startPad = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const monthStr = `${current.year}-${String(current.month + 1).padStart(2, '0')}`

  function eventosForDay(day: number): Evento[] {
    const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`
    return eventos.filter(e => e.data === dateStr)
  }

  const selectedDayEvents = selectedDay ? eventosForDay(selectedDay) : []

  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

  function prev() {
    setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 })
  }
  function next() {
    setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 })
  }

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Calendar */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-gray-900 uppercase tracking-tight">
            {monthNames[current.month]} {current.year}
          </h2>
          <div className="flex gap-1">
            <button onClick={prev} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
              <ChevronLeft size={17} />
            </button>
            <button onClick={next} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1
            const dayEvs = eventosForDay(day)
            const isToday = today.getDate() === day && today.getMonth() === current.month && today.getFullYear() === current.year
            const isSelected = selectedDay === day
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                className={cn(
                  'relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl text-xs transition-all',
                  isSelected
                    ? 'bg-[#7B2FBE] text-white font-black shadow-sm shadow-[#7B2FBE]/20'
                    : isToday
                    ? 'bg-[#7B2FBE]/10 text-[#7B2FBE] font-black border border-[#7B2FBE]/25'
                    : 'hover:bg-gray-100 text-gray-700'
                )}
              >
                <span className="text-xs font-semibold">{day}</span>
                {dayEvs.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                    {dayEvs.slice(0, 3).map(ev => (
                      <span
                        key={ev.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isSelected ? 'rgba(255,255,255,0.7)' : tipoColors[ev.tipo] }}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day detail */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-black text-gray-900 uppercase tracking-tight mb-4">
          {selectedDay ? `Dia ${selectedDay} — ${monthNames[current.month]}` : 'Selecione um dia'}
        </h3>
        {selectedDayEvents.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Nenhum evento neste dia</p>
        ) : (
          <div className="space-y-3">
            {selectedDayEvents.map(ev => {
              const color = tipoColors[ev.tipo]
              return (
                <div key={ev.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">{ev.titulo}</p>
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-md flex-shrink-0 uppercase tracking-wide"
                      style={{ background: `${color}15`, color }}
                    >
                      {ev.tipo}
                    </span>
                  </div>
                  {ev.hora && <p className="text-xs text-gray-400 mt-1">{ev.hora}</p>}
                  {ev.local && <p className="text-xs text-gray-500 mt-0.5">{ev.local}</p>}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Legenda</p>
          <div className="space-y-2">
            {(Object.entries(tipoColors) as [EventoTipo, string][]).map(([tipo, color]) => (
              <div key={tipo} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                {tipo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
