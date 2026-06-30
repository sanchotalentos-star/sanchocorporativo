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
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest w-16">Pos.</th>
            <th className="text-left px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest">Nome</th>
            <th className="text-center px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest">Score</th>
            <th className="text-center px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest hidden sm:table-cell">Leads</th>
            <th className="text-center px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest hidden md:table-cell">Alcance</th>
            <th className="text-center px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest hidden lg:table-cell">Tendência</th>
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
                  'border-b border-gray-100 last:border-0 transition-colors',
                  isCurrentUser ? 'bg-[#7B2FBE]/5' : 'hover:bg-gray-50'
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm">
                    {pos === 1 ? (
                      <Trophy size={18} className="text-yellow-400" />
                    ) : pos === 2 ? (
                      <Medal size={18} className="text-gray-400" />
                    ) : pos === 3 ? (
                      <Medal size={18} className="text-amber-600" />
                    ) : (
                      <span className="text-gray-400 text-xs font-black">#{pos}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0',
                      pos === 1 ? 'bg-yellow-400 text-black' :
                      pos === 2 ? 'bg-gray-300 text-white' :
                      pos === 3 ? 'bg-amber-600 text-white' :
                      'bg-gray-100 text-gray-500'
                    )}>
                      {member.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className={cn('font-semibold', isCurrentUser ? 'text-[#7B2FBE]' : 'text-gray-900')}>
                        {member.full_name}
                        {isCurrentUser && <span className="ml-2 text-xs font-normal text-gray-400">(você)</span>}
                      </p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn('text-lg font-black', pos === 1 ? 'text-yellow-500' : 'text-gray-900')}>
                    {member.score}
                  </span>
                  <span className="text-xs text-gray-400 ml-0.5">pts</span>
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-700 font-semibold">
                  {member.leads}
                </td>
                <td className="px-4 py-3 text-center hidden md:table-cell text-gray-500">
                  {member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance}
                </td>
                <td className="px-4 py-3 text-center hidden lg:table-cell">
                  <span className="text-xs font-black text-emerald-500">+{Math.round(Math.random() * 15 + 5)}%</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
