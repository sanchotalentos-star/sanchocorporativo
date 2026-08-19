import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: LucideIcon
}

export function EmptyState({ title = 'Nenhum dado encontrado', description, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon size={48} className="text-[#94A3B8] mb-4" />
      <p className="text-[#0F172A] font-medium">{title}</p>
      {description && <p className="text-sm text-[#475569] mt-1 max-w-xs">{description}</p>}
    </div>
  )
}
