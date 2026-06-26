import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, FileText, Video, Mic, Presentation, Download } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

export const Route = createFileRoute('/dashboard/membro/materiais')({
  component: MateriaisPage,
})

interface Material {
  id: string
  title: string
  type: 'pdf' | 'video' | 'audio' | 'slides'
  trail: string
  size: string
  date: string
}

const mockMaterials: Material[] = [
  { id: '1', title: 'Guia de Comunicação Não-Verbal', type: 'pdf', trail: 'Fundamentos da Comunicação', size: '2.4 MB', date: '2024-03-01' },
  { id: '2', title: 'Checklist de Apresentações', type: 'pdf', trail: 'Apresentações que Convencem', size: '856 KB', date: '2024-04-10' },
  { id: '3', title: 'Template de E-mail Executivo', type: 'slides', trail: 'Escrita Profissional', size: '1.2 MB', date: '2024-04-20' },
  { id: '4', title: 'Workbook — Negociação', type: 'pdf', trail: 'Negociação de Alto Impacto', size: '3.8 MB', date: '2024-05-05' },
  { id: '5', title: 'Exercícios de Escuta Ativa', type: 'audio', trail: 'Fundamentos da Comunicação', size: '18 MB', date: '2024-02-14' },
  { id: '6', title: 'Slides — Estilos de Liderança', type: 'slides', trail: 'Liderança e Influência', size: '4.1 MB', date: '2024-03-18' },
]

const typeIcon: Record<string, React.ElementType> = { pdf: FileText, video: Video, audio: Mic, slides: Presentation }
const typeBadge: Record<string, 'accent' | 'danger' | 'neon' | 'warning'> = { pdf: 'danger', video: 'accent', audio: 'warning', slides: 'neon' }

import type React from 'react'

function MateriaisPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = mockMaterials.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.trail.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || m.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C7C9C]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar material..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#18182A] border border-[#2A2A40] text-sm text-white placeholder:text-[#7C7C9C] focus:outline-none focus:border-[#7B2FBE]"
          />
        </div>
        <Select
          options={[
            { value: 'all', label: 'Todos tipos' },
            { value: 'pdf', label: 'PDF' },
            { value: 'video', label: 'Vídeo' },
            { value: 'audio', label: 'Áudio' },
            { value: 'slides', label: 'Slides' },
          ]}
          value={typeFilter}
          onValueChange={setTypeFilter}
          className="w-44"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhum material encontrado" description="Tente ajustar a busca ou os filtros." />
      ) : (
        <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl overflow-hidden">
          <div className="divide-y divide-[#2A2A40]">
            {filtered.map((m) => {
              const Icon = typeIcon[m.type]
              return (
                <div key={m.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#1E1E34] transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[#2A2A40] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#7C7C9C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{m.title}</p>
                    <p className="text-xs text-[#7C7C9C]">{m.trail} · {m.size} · {new Date(m.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <Badge variant={typeBadge[m.type]}>{m.type.toUpperCase()}</Badge>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
