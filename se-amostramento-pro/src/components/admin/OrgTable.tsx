import { Building2, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Badge } from '@/components/ui/Badge'
import { StatusChip } from '@/components/ui/StatusChip'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Organization } from '@/lib/mocks'

interface OrgTableProps {
  orgs: Organization[]
}

const planBadgeVariant: Record<string, 'primary' | 'accent' | 'neon' | 'success'> = {
  Solo: 'accent',
  Team: 'primary',
  Empresa: 'neon',
  Corporativo: 'success',
}

export function OrgTable({ orgs }: OrgTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A2A40]">
            {['Organização', 'Plano', 'Membros', 'Status', 'Setor', 'Contato', ''].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#7C7C9C] uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2A2A40]">
          {orgs.map((org) => (
            <tr key={org.id} className="hover:bg-[#1E1E34] transition-colors">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7B2FBE]/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-[#9D4FE3]" />
                  </div>
                  <span className="font-medium text-white">{org.name}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge variant={planBadgeVariant[org.plan] ?? 'default'}>{org.plan}</Badge>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1">
                  <span className="text-white font-medium">{org.members}/{org.maxMembers}</span>
                  <ProgressBar value={org.members} max={org.maxMembers} size="sm" />
                </div>
              </td>
              <td className="px-4 py-4">
                <StatusChip status={org.status} />
              </td>
              <td className="px-4 py-4 text-[#C4B5FD]">{org.industry}</td>
              <td className="px-4 py-4 text-[#7C7C9C]">{org.contactEmail}</td>
              <td className="px-4 py-4">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7C7C9C] hover:bg-[#2A2A40] hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="z-50 min-w-40 bg-[#18182A] border border-[#2A2A40] rounded-xl shadow-xl p-1.5" align="end">
                      {[
                        { icon: Eye, label: 'Visualizar' },
                        { icon: Edit, label: 'Editar' },
                        { icon: Trash2, label: 'Remover' },
                      ].map(({ icon: Icon, label }) => (
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
