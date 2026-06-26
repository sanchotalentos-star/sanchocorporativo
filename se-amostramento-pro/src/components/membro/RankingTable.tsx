import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Member } from '@/lib/mocks'

interface RankingTableProps {
  members: Member[]
  currentMemberId?: string
}

export function RankingTable({ members, currentMemberId = 'mem-001' }: RankingTableProps) {
  const sorted = [...members].sort((a, b) => b.points - a.points)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A2A40]">
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#7C7C9C] uppercase tracking-wider w-16">#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#7C7C9C] uppercase tracking-wider">Membro</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#7C7C9C] uppercase tracking-wider">Organização</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-[#7C7C9C] uppercase tracking-wider">Pontos</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-[#7C7C9C] uppercase tracking-wider">Trilhas</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-[#7C7C9C] uppercase tracking-wider">Tendência</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2A2A40]">
          {sorted.map((m, i) => {
            const isMe = m.id === currentMemberId
            const position = i + 1

            return (
              <tr
                key={m.id}
                className={cn(
                  'transition-colors',
                  isMe
                    ? 'bg-[#7B2FBE]/15 border-l-2 border-[#7B2FBE] hover:bg-[#7B2FBE]/20'
                    : 'hover:bg-[#1E1E34]'
                )}
              >
                <td className="px-4 py-3">
                  {position <= 3 ? (
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs',
                      position === 1 && 'bg-[#F59E0B]/20 text-[#F59E0B]',
                      position === 2 && 'bg-[#C4B5FD]/20 text-[#C4B5FD]',
                      position === 3 && 'bg-[#CD7F32]/20 text-[#CD7F32]',
                    )}>
                      {position === 1 ? <Trophy className="w-4 h-4" /> : position}
                    </div>
                  ) : (
                    <span className="text-[#7C7C9C] font-mono text-xs pl-1">{position}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.name} className={cn('w-8 h-8 rounded-full border', isMe ? 'border-[#7B2FBE]' : 'border-[#2A2A40]')} />
                    <div>
                      <p className={cn('font-medium', isMe ? 'text-[#BF5AF2]' : 'text-white')}>
                        {m.name} {isMe && '(Você)'}
                      </p>
                      <p className="text-xs text-[#7C7C9C]">{m.completedTrails} trilhas concluídas</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#C4B5FD]">{m.orgName}</td>
                <td className="px-4 py-3 text-right">
                  <span className={cn('font-bold font-display text-base', isMe ? 'text-[#BF5AF2]' : 'text-white')}>
                    {m.points.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-[#C4B5FD]">{m.completedTrails}</td>
                <td className="px-4 py-3 text-right">
                  {i % 3 === 0 ? (
                    <TrendingUp className="w-4 h-4 text-[#22C55E] ml-auto" />
                  ) : i % 3 === 1 ? (
                    <TrendingDown className="w-4 h-4 text-[#EF4444] ml-auto" />
                  ) : (
                    <Minus className="w-4 h-4 text-[#7C7C9C] ml-auto" />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
