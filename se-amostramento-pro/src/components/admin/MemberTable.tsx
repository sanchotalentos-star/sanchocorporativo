import { MoreHorizontal, Edit, Trash2, Eye, ShieldCheck } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Badge } from '@/components/ui/Badge'
import { StatusChip } from '@/components/ui/StatusChip'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Member } from '@/lib/mocks'

interface MemberTableProps {
  members: Member[]
}

const roleConfig: Record<string, { label: string; variant: 'primary' | 'accent' | 'neon' }> = {
  admin: { label: 'Admin', variant: 'neon' },
  manager: { label: 'Gestor', variant: 'accent' },
  member: { label: 'Membro', variant: 'primary' },
}

export function MemberTable({ members }: MemberTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A2A40]">
            {['Membro', 'Organização', 'Função', 'Progresso', 'Pontos', 'Status', ''].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#7C7C9C] uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2A2A40]">
          {members.map((m) => (
            <tr key={m.id} className="hover:bg-[#1E1E34] transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full border border-[#2A2A40]" />
                  <div>
                    <p className="font-medium text-white">{m.name}</p>
                    <p className="text-xs text-[#7C7C9C]">{m.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-[#C4B5FD]">{m.orgName}</td>
              <td className="px-4 py-3">
                <Badge variant={roleConfig[m.role]?.variant ?? 'default'}>
                  {m.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-1" />}
                  {roleConfig[m.role]?.label ?? m.role}
                </Badge>
              </td>
              <td className="px-4 py-3 w-40">
                <div className="space-y-1">
                  <span className="text-white text-xs font-medium">{m.progress}%</span>
                  <ProgressBar value={m.progress} size="sm" />
                </div>
              </td>
              <td className="px-4 py-3 font-semibold text-[#BF5AF2]">{m.points.toLocaleString()}</td>
              <td className="px-4 py-3">
                <StatusChip status={m.status} />
              </td>
              <td className="px-4 py-3">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7C7C9C] hover:bg-[#2A2A40] hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="z-50 min-w-40 bg-[#18182A] border border-[#2A2A40] rounded-xl shadow-xl p-1.5" align="end">
                      {[{ icon: Eye, label: 'Ver perfil' }, { icon: Edit, label: 'Editar' }, { icon: Trash2, label: 'Remover' }].map(({ icon: Icon, label }) => (
                        <DropdownMenu.Item key={label} className="flex items-center gap-2 px-3 py-2 text-sm text-[#C4B5FD] rounded-lg hover:bg-[#2A2A40] cursor-pointer focus:outline-none">
                          <Icon className="w-4 h-4" />
                          {label}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
