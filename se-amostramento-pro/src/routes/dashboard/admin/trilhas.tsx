import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit, Trash2, BookOpen, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { mockTrails } from '@/lib/mocks'
import type { Trail } from '@/lib/mocks'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/admin/trilhas')({
  component: TrilhasAdminPage,
})

const levelLabel: Record<string, string> = { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' }

function TrilhasAdminPage() {
  const [trails, setTrails] = useState<Trail[]>(mockTrails)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Trail | null>(null)
  const [form, setForm] = useState({ title: '', description: '', category: 'comunicacao', level: 'iniciante' })

  const handleEdit = (trail: Trail) => {
    setEditing(trail)
    setForm({ title: trail.title, description: trail.description, category: trail.category, level: trail.level })
    setOpen(true)
  }

  const handleNew = () => {
    setEditing(null)
    setForm({ title: '', description: '', category: 'comunicacao', level: 'iniciante' })
    setOpen(true)
  }

  const handleSave = () => {
    if (editing) {
      setTrails((prev) => prev.map((t) => t.id === editing.id ? { ...t, ...form, category: form.category as Trail['category'], level: form.level as Trail['level'] } : t))
      toast.success('Trilha atualizada!')
    } else {
      const newTrail: Trail = {
        id: `trail-${Date.now()}`,
        title: form.title,
        description: form.description,
        category: form.category as Trail['category'],
        level: form.level as Trail['level'],
        duration: 0,
        modules: [],
        thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
        instructor: 'A definir',
        instructorBio: '',
        enrollments: 0,
        rating: 0,
        published: false,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setTrails((prev) => [newTrail, ...prev])
      toast.success('Trilha criada!')
    }
    setOpen(false)
  }

  const handleDelete = (id: string) => {
    setTrails((prev) => prev.filter((t) => t.id !== id))
    toast('Trilha removida.')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-[#7C7C9C] text-sm">{trails.length} trilhas cadastradas</p>
        <Button variant="primary" onClick={handleNew}>
          <Plus className="w-4 h-4" />
          Nova Trilha
        </Button>
      </div>

      <div className="space-y-3">
        {trails.map((trail) => (
          <div key={trail.id} className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-5 flex gap-4 items-center hover:border-[#7B2FBE]/40 transition-all">
            <img src={trail.thumbnail} alt={trail.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white truncate">{trail.title}</h3>
                <Badge variant={trail.published ? 'success' : 'warning'}>{trail.published ? 'Publicado' : 'Rascunho'}</Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#7C7C9C]">
                <span>{levelLabel[trail.level]}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{trail.enrollments}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#F59E0B]" />{trail.rating}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{trail.modules.length} módulos</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(trail)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(trail.id)}>
                <Trash2 className="w-4 h-4 text-[#EF4444]" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen} title={editing ? 'Editar Trilha' : 'Nova Trilha'}>
        <div className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título da trilha" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#C4B5FD]">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg bg-[#0F0F1A] border border-[#2A2A40] px-4 py-2.5 text-sm text-white placeholder:text-[#7C7C9C] focus:outline-none focus:border-[#7B2FBE] resize-none"
              placeholder="Descrição da trilha"
            />
          </div>
          <Select
            label="Categoria"
            options={[
              { value: 'comunicacao', label: 'Comunicação' },
              { value: 'lideranca', label: 'Liderança' },
              { value: 'negociacao', label: 'Negociação' },
              { value: 'apresentacao', label: 'Apresentação' },
              { value: 'escrita', label: 'Escrita' },
            ]}
            value={form.category}
            onValueChange={(v) => setForm({ ...form, category: v })}
          />
          <Select
            label="Nível"
            options={[
              { value: 'iniciante', label: 'Iniciante' },
              { value: 'intermediario', label: 'Intermediário' },
              { value: 'avancado', label: 'Avançado' },
            ]}
            value={form.level}
            onValueChange={(v) => setForm({ ...form, level: v })}
          />
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1">Cancelar</Button>
            <Button variant="primary" onClick={handleSave} className="flex-1">Salvar</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
