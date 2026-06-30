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
    <div className="rounded-2xl border border-[#1A2E4A] bg-[#0D1B2E] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1A2E4A] bg-[#0A1420]">
            <th className="text-left px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider w-16">Pos.</th>
            <th className="text-left px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider">Nome</th>
            <th className="text-center px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider">Score</th>
            <th className="text-center px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider hidden sm:table-cell">Leads</th>
            <th className="text-center px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider hidden md:table-cell">Alcance</th>
            <th className="text-center px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider hidden lg:table-cell">Tendência</th>
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
                  'border-b border-[#1A2E4A]/50 last:border-0 transition-colors',
                  isCurrentUser ? 'bg-[#F59E0B]/10' : 'hover:bg-[#112240]'
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm">
                    {pos === 1 ? (
                      <Trophy size={18} className="text-yellow-400" />
                    ) : pos === 2 ? (
                      <Medal size={18} className="text-[#94A3B8]" />
                    ) : pos === 3 ? (
                      <Medal size={18} className="text-amber-600" />
                    ) : (
                      <span className="text-[#4A7FA5] text-xs">#{pos}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                      pos === 1 ? 'bg-yellow-400 text-black' :
                      pos === 2 ? 'bg-[#94A3B8] text-white' :
                      pos === 3 ? 'bg-amber-600 text-white' :
                      'bg-[#112240] text-[#4A7FA5]'
                    )}>
                      {member.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className={cn('font-medium', isCurrentUser ? 'text-[#F59E0B]' : 'text-white')}>
                        {member.full_name}
                        {isCurrentUser && <span className="ml-2 text-xs font-normal text-[#4A7FA5]">(você)</span>}
                      </p>
                      <p className="text-xs text-[#4A7FA5]">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn('text-lg font-black', pos === 1 ? 'text-yellow-400' : 'text-white')}>
                    {member.score}
                  </span>
                  <span className="text-xs text-[#4A7FA5] ml-0.5">pts</span>
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell text-[#A0C0D8] font-medium">
                  {member.leads}
                </td>
                <td className="px-4 py-3 text-center hidden md:table-cell text-[#4A7FA5]">
                  {member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance}
                </td>
                <td className="px-4 py-3 text-center hidden lg:table-cell">
                  <span className="text-xs font-bold text-emerald-400">+{Math.round(Math.random() * 15 + 5)}%</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
