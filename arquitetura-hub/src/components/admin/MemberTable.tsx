import { useNavigate } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import type { Member } from '@/types'

interface MemberTableProps {
  members: Member[]
}

export function MemberTable({ members }: MemberTableProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest">Membro</th>
            <th className="text-center px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest">Score</th>
            <th className="text-center px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest hidden sm:table-cell">Leads</th>
            <th className="text-center px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest hidden md:table-cell">Alcance</th>
            <th className="text-left px-4 py-3 font-black text-gray-400 text-[10px] uppercase tracking-widest hidden lg:table-cell">Progresso</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {members.map(member => {
            const pct = member.score
            const scoreColor = pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444'
            return (
              <tr key={member.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                      {member.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{member.full_name}</p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-base font-black" style={{ color: scoreColor }}>{member.score}</span>
                  <span className="text-xs text-gray-400 ml-0.5">pts</span>
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-700 font-semibold">{member.leads}</td>
                <td className="px-4 py-3 text-center hidden md:table-cell text-gray-500">
                  {member.alcance >= 1000 ? `${(member.alcance / 1000).toFixed(1)}k` : member.alcance}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-1.5 rounded-full bg-gray-100">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: scoreColor }} />
                    </div>
                    <span className="text-xs font-black" style={{ color: scoreColor }}>{pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => void navigate({ to: '/dashboard/membro' })}
                    className="p-1.5 text-gray-300 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
