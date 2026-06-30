import { useNavigate } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import type { Member } from '@/types'

interface MemberTableProps {
  members: Member[]
}

export function MemberTable({ members }: MemberTableProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl border border-[#1A2E4A] bg-[#0D1B2E] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1A2E4A] bg-[#0A1420]">
            <th className="text-left px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider">Membro</th>
            <th className="text-center px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider">Score</th>
            <th className="text-center px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider hidden sm:table-cell">Leads</th>
            <th className="text-center px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider hidden md:table-cell">Alcance</th>
            <th className="text-left px-4 py-3 font-semibold text-[#4A7FA5] text-xs uppercase tracking-wider hidden lg:table-cell">Progresso</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {members.map(member => {
            const pct = member.score
            const scoreColor = pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444'
            return (
              <tr key={member.id} className="border-b border-[#1A2E4A]/50 last:border-0 hover:bg-[#112240] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-black text-sm font-bold flex-shrink-0">
                      {member.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{member.full_name}</p>
                      <p className="text-xs text-[#4A7FA5]">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-base font-black" style={{ color: scoreColor }}>{member.score}</span>
                  <span className="text-xs text-[#4A7FA5] ml-0.5">pts</span>
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell text-[#A0C0D8] font-medium">{member.leads}</td>
                <td className="px-4 py-3 text-center hidden md:table-cell text-[#4A7FA5]">
                  {member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-1.5 rounded-full bg-[#112240]">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: scoreColor }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: scoreColor }}>{pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => void navigate({ to: '/dashboard/membro' })}
                    className="p-1.5 text-[#4A7FA5] hover:text-white hover:bg-[#112240] rounded-lg transition-colors"
                    title="Ver dashboard"
                  >
                    <Eye size={15} />
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
