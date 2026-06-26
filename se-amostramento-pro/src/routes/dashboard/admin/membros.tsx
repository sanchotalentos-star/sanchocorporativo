import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import { MemberTable } from '@/components/admin/MemberTable'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { mockMembers } from '@/lib/mocks'

export const Route = createFileRoute('/dashboard/admin/membros')({
  component: MembrosPage,
})

function MembrosPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = mockMembers.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || m.status === statusFilter
    const matchRole = roleFilter === 'all' || m.role === roleFilter
    return matchSearch && matchStatus && matchRole
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div className="flex gap-3 flex-wrap flex-1">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C7C9C]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar membro..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#0F0F1A] border border-[#2A2A40] text-sm text-white placeholder:text-[#7C7C9C] focus:outline-none focus:border-[#7B2FBE]"
            />
          </div>
          <Select
            options={[{ value: 'all', label: 'Todos status' }, { value: 'active', label: 'Ativo' }, { value: 'inactive', label: 'Inativo' }, { value: 'pending', label: 'Pendente' }]}
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="w-44"
          />
          <Select
            options={[{ value: 'all', label: 'Todos' }, { value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Gestor' }, { value: 'member', label: 'Membro' }]}
            value={roleFilter}
            onValueChange={setRoleFilter}
            className="w-44"
          />
        </div>
        <Button variant="primary">
          <UserPlus className="w-4 h-4" />
          Convidar Membro
        </Button>
      </div>

      <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2A2A40]">
          <h3 className="font-semibold text-white">{filtered.length} membros</h3>
        </div>
        <MemberTable members={filtered} />
      </div>
    </div>
  )
}
