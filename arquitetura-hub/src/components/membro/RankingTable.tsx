import { Trophy, Medal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Member } from '@/types'

interface RankingTableProps {
  members: Member[]
  currentUserId?: string
}

export function RankingTable({ members, currentUserId }: RankingTableProps) {
  const sorted = [...members].sort((a, b) => b.score - a.score)

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
            <th className="text-left px-4 py-3 font-semibold text-[#475569] w-16">Pos.</th>
            <th className="text-left px-4 py-3 font-semibold text-[#475569]">Nome</th>
            <th className="text-center px-4 py-3 font-semibold text-[#475569]">Score</th>
            <th className="text-center px-4 py-3 font-semibold text-[#475569] hidden sm:table-cell">Leads</th>
            <th className="text-center px-4 py-3 font-semibold text-[#475569] hidden md:table-cell">Alcance</th>
            <th className="text-center px-4 py-3 font-semibold text-[#475569] hidden lg:table-cell">Tendência</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((member, idx) => {
            const pos = idx + 1
            const isCurrentUser = member.id === currentUserId
            return (
              <tr
                key={member.id}
                className={cn(
                  'border-b border-[#E2E8F0] last:border-0 transition-colors',
                  isCurrentUser ? 'bg-amber-50 border-amber-200' : 'hover:bg-[#F8FAFC]'
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm">
                    {pos === 1 ? (
                      <Trophy size={20} className="text-yellow-500" />
                    ) : pos === 2 ? (
                      <Medal size={20} className="text-gray-400" />
                    ) : pos === 3 ? (
                      <Medal size={20} className="text-amber-600" />
                    ) : (
                      <span className="text-[#94A3B8]">#{pos}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0',
                      pos === 1 ? 'bg-yellow-500' : pos === 2 ? 'bg-gray-400' : pos === 3 ? 'bg-amber-600' : 'bg-[#1B3A5C]'
                    )}>
                      {member.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className={cn('font-medium', isCurrentUser ? 'text-[#B45309]' : 'text-[#0F172A]')}>
                        {member.full_name}
                        {isCurrentUser && <span className="ml-2 text-xs font-normal text-[#D97706]">(você)</span>}
                      </p>
                      <p className="text-xs text-[#94A3B8]">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn('text-lg font-bold', pos === 1 ? 'text-yellow-600' : 'text-[#0F172A]')}>
                    {member.score}
                  </span>
                  <span className="text-xs text-[#94A3B8] ml-0.5">pts</span>
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell text-[#475569] font-medium">
                  {member.leads}
                </td>
                <td className="px-4 py-3 text-center hidden md:table-cell text-[#475569]">
                  {member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance}
                </td>
                <td className="px-4 py-3 text-center hidden lg:table-cell">
                  <span className="text-xs font-medium text-green-600">+{Math.round(Math.random() * 15 + 5)}%</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
