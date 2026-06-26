import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { RequestCard } from '@/components/admin/RequestCard'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { ClipboardList } from 'lucide-react'
import { mockRequests } from '@/lib/mocks'

export const Route = createFileRoute('/dashboard/admin/solicitacoes')({
  component: SolicitacoesPage,
})

function SolicitacoesPage() {
  const [statusFilter, setStatusFilter] = useState('pending')
  const [planFilter, setPlanFilter] = useState('all')

  const filtered = mockRequests.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchPlan = planFilter === 'all' || r.plan === planFilter
    return matchStatus && matchPlan
  })

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Select
          options={[{ value: 'all', label: 'Todas' }, { value: 'pending', label: 'Pendentes' }, { value: 'approved', label: 'Aprovadas' }, { value: 'rejected', label: 'Rejeitadas' }]}
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="w-48"
        />
        <Select
          options={[{ value: 'all', label: 'Todos planos' }, { value: 'Solo', label: 'Solo' }, { value: 'Team', label: 'Team' }, { value: 'Empresa', label: 'Empresa' }, { value: 'Corporativo', label: 'Corporativo' }]}
          value={planFilter}
          onValueChange={setPlanFilter}
          className="w-48"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nenhuma solicitação" description="Não há solicitações neste filtro no momento." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      )}
    </div>
  )
}
