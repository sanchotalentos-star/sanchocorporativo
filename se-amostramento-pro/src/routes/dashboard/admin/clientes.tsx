import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { OrgTable } from '@/components/admin/OrgTable'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { mockOrganizations } from '@/lib/mocks'

export const Route = createFileRoute('/dashboard/admin/clientes')({
  component: ClientesPage,
})

function ClientesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')

  const filtered = mockOrganizations.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.contactEmail.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const matchPlan = planFilter === 'all' || o.plan === planFilter
    return matchSearch && matchStatus && matchPlan
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div className="flex gap-3 flex-wrap flex-1">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C7C9C]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar organização..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#0F0F1A] border border-[#2A2A40] text-sm text-white placeholder:text-[#7C7C9C] focus:outline-none focus:border-[#7B2FBE]"
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'Todos status' },
              { value: 'active', label: 'Ativo' },
              { value: 'trial', label: 'Trial' },
              { value: 'suspended', label: 'Suspenso' },
            ]}
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="w-48"
          />
          <Select
            options={[
              { value: 'all', label: 'Todos planos' },
              { value: 'Solo', label: 'Solo' },
              { value: 'Team', label: 'Team' },
              { value: 'Empresa', label: 'Empresa' },
              { value: 'Corporativo', label: 'Corporativo' },
            ]}
            value={planFilter}
            onValueChange={setPlanFilter}
            className="w-48"
          />
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4" />
          Nova Organização
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2A2A40] flex items-center justify-between">
          <h3 className="font-semibold text-white">{filtered.length} organizações</h3>
        </div>
        <OrgTable orgs={filtered} />
      </div>
    </div>
  )
}
