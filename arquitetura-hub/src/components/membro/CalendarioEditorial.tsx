import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Evento, EventoTipo } from '@/types'

interface CalendarioEditorialProps {
  eventos: Evento[]
}

const tipoColors: Record<EventoTipo, string> = {
  'Conteúdo': 'blue',
  'Evento': 'purple',
  'Mídia': 'accent',
  'Relacionamento': 'green',
  'Meta': 'yellow',
}

const tipoDots: Record<EventoTipo, string> = {
  'Conteúdo': 'bg-blue-500',
  'Evento': 'bg-purple-500',
  'Mídia': 'bg-amber-500',
  'Relacionamento': 'bg-green-500',
  'Meta': 'bg-yellow-500',
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
    setCurrent(c => {
      if (c.month === 0) return { year: c.year - 1, month: 11 }
      return { year: c.year, month: c.month - 1 }
    })
  }
  function next() {
    setCurrent(c => {
      if (c.month === 11) return { year: c.year + 1, month: 0 }
      return { year: c.year, month: c.month + 1 }
    })
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#0F172A]">
            {monthNames[current.month]} {current.year}
          </h2>
          <div className="flex gap-1">
            <button onClick={prev} className="p-1 rounded hover:bg-[#F1F5F9] text-[#475569]"><ChevronLeft size={18} /></button>
            <button onClick={next} className="p-1 rounded hover:bg-[#F1F5F9] text-[#475569]"><ChevronRight size={18} /></button>
          </div>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 mb-2">
          {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
            <div key={d} className="text-center text-xs font-medium text-[#94A3B8] py-1">{d}</div>
          ))}
        </div>

        {/* Days grid */}
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
                  'relative aspect-square flex flex-col items-center justify-start pt-1 rounded-lg text-sm transition-colors',
                  isSelected ? 'bg-[#1B3A5C] text-white' : isToday ? 'bg-[#1B3A5C]/10 text-[#1B3A5C] font-bold' : 'hover:bg-[#F1F5F9] text-[#0F172A]'
                )}
              >
                <span className="text-xs font-medium">{day}</span>
                {dayEvs.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                    {dayEvs.slice(0, 3).map(ev => (
                      <span key={ev.id} className={cn('w-1.5 h-1.5 rounded-full', tipoDots[ev.tipo], isSelected ? 'opacity-80' : '')} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day detail */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
        <h3 className="font-semibold text-[#0F172A] mb-4">
          {selectedDay ? `Dia ${selectedDay}` : 'Selecione um dia'}
        </h3>
        {selectedDayEvents.length === 0 ? (
          <p className="text-sm text-[#94A3B8] text-center py-8">Nenhum evento neste dia</p>
        ) : (
          <div className="space-y-3">
            {selectedDayEvents.map(ev => (
              <div key={ev.id} className="p-3 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0]">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-[#0F172A]">{ev.titulo}</p>
                  <Badge variant={tipoColors[ev.tipo] as 'blue' | 'purple' | 'accent' | 'green' | 'yellow'}>
                    {ev.tipo}
                  </Badge>
                </div>
                {ev.hora && <p className="text-xs text-[#94A3B8] mt-1">{ev.hora}</p>}
                {ev.local && <p className="text-xs text-[#475569] mt-0.5">{ev.local}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-2">Legenda</p>
          <div className="space-y-1.5">
            {(Object.entries(tipoDots) as [EventoTipo, string][]).map(([tipo, dot]) => (
              <div key={tipo} className="flex items-center gap-2 text-xs text-[#475569]">
                <span className={cn('w-2 h-2 rounded-full flex-shrink-0', dot)} />
                {tipo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
