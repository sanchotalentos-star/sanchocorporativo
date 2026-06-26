import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Select } from '@/components/ui/Select'
import { RankingTable } from '@/components/membro/RankingTable'
import { mockMembers } from '@/lib/mocks'

export const Route = createFileRoute('/dashboard/membro/ranking')({
  component: RankingPage,
})

function RankingPage() {
  const [period, setPeriod] = useState('all')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[#7C7C9C] text-sm">{mockMembers.length} participantes</p>
        <Select
          options={[
            { value: 'all', label: 'Geral' },
            { value: 'month', label: 'Este mês' },
            { value: 'week', label: 'Esta semana' },
          ]}
          value={period}
          onValueChange={setPeriod}
          className="w-44"
        />
      </div>

      <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl overflow-hidden">
        <RankingTable members={mockMembers} currentMemberId="mem-001" />
      </div>
    </div>
  )
}
