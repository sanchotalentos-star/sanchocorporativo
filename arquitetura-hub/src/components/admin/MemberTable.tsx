import { useNavigate } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import type { Member } from '@/types'

interface MemberTableProps {
  members: Member[]
}

export function MemberTable({ members }: MemberTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
            <th className="text-left px-4 py-3 font-semibold text-[#475569]">Membro</th>
            <th className="text-center px-4 py-3 font-semibold text-[#475569]">Score</th>
            <th className="text-center px-4 py-3 font-semibold text-[#475569] hidden sm:table-cell">Leads</th>
            <th className="text-center px-4 py-3 font-semibold text-[#475569] hidden md:table-cell">Alcance</th>
            <th className="text-left px-4 py-3 font-semibold text-[#475569] hidden lg:table-cell">Progresso</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {members.map(member => {
            const pct = member.score
            const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            return (
              <tr key={member.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1B3A5C] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {member.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-[#0F172A]">{member.full_name}</p>
                      <p className="text-xs text-[#94A3B8]">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn('text-base font-bold',
                    pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'
                  )}>{member.score}</span>
                  <span className="text-xs text-[#94A3B8] ml-0.5">pts</span>
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell text-[#475569] font-medium">{member.leads}</td>
                <td className="px-4 py-3 text-center hidden md:table-cell text-[#475569]">
                  {member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Progress value={pct} className="w-28 h-1.5" indicatorClassName={color} />
                    <span className="text-xs text-[#475569]">{pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => void navigate({ to: '/dashboard/membro' })}
                    className="p-1.5 text-[#94A3B8] hover:text-[#1B3A5C] hover:bg-[#F1F5F9] rounded-lg"
                    title="Ver dashboard"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
