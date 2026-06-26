import { useState } from 'react'
import * as Switch from '@radix-ui/react-switch'
import { mockOrganizations, mockTrails } from '@/lib/mocks'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type MatrixState = Record<string, Record<string, boolean>>

function buildInitialMatrix(): MatrixState {
  const matrix: MatrixState = {}
  for (const org of mockOrganizations) {
    matrix[org.id] = {}
    for (const trail of mockTrails) {
      matrix[org.id][trail.id] = org.status === 'active' && trail.published
    }
  }
  return matrix
}

export function AccessMatrix() {
  const [matrix, setMatrix] = useState<MatrixState>(buildInitialMatrix)

  const toggle = (orgId: string, trailId: string, value: boolean) => {
    setMatrix((prev) => ({
      ...prev,
      [orgId]: { ...prev[orgId], [trailId]: value },
    }))
    const org = mockOrganizations.find((o) => o.id === orgId)
    const trail = mockTrails.find((t) => t.id === trailId)
    if (value) {
      toast.success(`Acesso liberado: ${org?.name} → ${trail?.title}`)
    } else {
      toast(`Acesso revogado: ${org?.name} → ${trail?.title}`)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#7C7C9C] uppercase tracking-wider bg-[#0F0F1A] sticky left-0 z-10 min-w-48">
              Organização \ Trilha
            </th>
            {mockTrails.map((trail) => (
              <th key={trail.id} className="px-3 py-3 text-xs font-semibold text-[#7C7C9C] text-center min-w-36 bg-[#0F0F1A]">
                <span className="block truncate max-w-32">{trail.title}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2A2A40]">
          {mockOrganizations.map((org) => (
            <tr key={org.id} className="hover:bg-[#1E1E34] transition-colors">
              <td className="px-4 py-3 sticky left-0 bg-[#18182A] z-10 border-r border-[#2A2A40]">
                <div>
                  <p className="font-medium text-white">{org.name}</p>
                  <p className="text-xs text-[#7C7C9C]">{org.plan}</p>
                </div>
              </td>
              {mockTrails.map((trail) => (
                <td key={trail.id} className="px-3 py-3 text-center">
                  <Switch.Root
                    checked={matrix[org.id]?.[trail.id] ?? false}
                    onCheckedChange={(v) => toggle(org.id, trail.id, v)}
                    className={cn(
                      'w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2FBE]',
                      matrix[org.id]?.[trail.id] ? 'bg-[#7B2FBE]' : 'bg-[#2A2A40]'
                    )}
                  >
                    <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-5" />
                  </Switch.Root>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
