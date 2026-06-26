import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { TrailCard } from '@/components/membro/TrailCard'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { BookOpen } from 'lucide-react'
import { mockTrails } from '@/lib/mocks'

export const Route = createFileRoute('/dashboard/membro/trilhas')({
  component: TrilhasMembroPage,
})

function TrilhasMembroPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')

  const filtered = mockTrails.filter((t) => {
    if (!t.published) return false
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || t.category === category
    const matchLevel = level === 'all' || t.level === level
    return matchSearch && matchCat && matchLevel
  })

  const mockProgress: Record<string, number> = {
    'trail-001': 65,
    'trail-002': 30,
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C7C9C]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar trilha..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#18182A] border border-[#2A2A40] text-sm text-white placeholder:text-[#7C7C9C] focus:outline-none focus:border-[#7B2FBE]"
          />
        </div>
        <Select
          options={[
            { value: 'all', label: 'Todas categorias' },
            { value: 'comunicacao', label: 'Comunicação' },
            { value: 'lideranca', label: 'Liderança' },
            { value: 'negociacao', label: 'Negociação' },
            { value: 'apresentacao', label: 'Apresentação' },
            { value: 'escrita', label: 'Escrita' },
          ]}
          value={category}
          onValueChange={setCategory}
          className="w-48"
        />
        <Select
          options={[
            { value: 'all', label: 'Todos níveis' },
            { value: 'iniciante', label: 'Iniciante' },
            { value: 'intermediario', label: 'Intermediário' },
            { value: 'avancado', label: 'Avançado' },
          ]}
          value={level}
          onValueChange={setLevel}
          className="w-44"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="Nenhuma trilha encontrada" description="Tente ajustar os filtros para encontrar o conteúdo certo." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((trail) => (
            <TrailCard key={trail.id} trail={trail} progress={mockProgress[trail.id]} />
          ))}
        </div>
      )}
    </div>
  )
}
