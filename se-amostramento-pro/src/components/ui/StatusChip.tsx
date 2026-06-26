import { cn } from '@/lib/utils'

type StatusType = 'active' | 'inactive' | 'pending' | 'suspended' | 'trial' | 'live' | 'upcoming' | 'ended'

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: { label: 'Ativo', className: 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30' },
  inactive: { label: 'Inativo', className: 'bg-[#7C7C9C]/20 text-[#7C7C9C] border border-[#7C7C9C]/30' },
  pending: { label: 'Pendente', className: 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30' },
  suspended: { label: 'Suspenso', className: 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30' },
  trial: { label: 'Trial', className: 'bg-[#2979FF]/20 text-[#5C9DFF] border border-[#2979FF]/30' },
  live: { label: 'Ao Vivo', className: 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 animate-pulse' },
  upcoming: { label: 'Em breve', className: 'bg-[#7B2FBE]/20 text-[#9D4FE3] border border-[#7B2FBE]/30' },
  ended: { label: 'Encerrado', className: 'bg-[#2A2A40] text-[#7C7C9C]' },
}

interface StatusChipProps {
  status: StatusType
  className?: string
}

export function StatusChip({ status, className }: StatusChipProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className
      )}
    >
      {status === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] inline-block" />
      )}
      {config.label}
    </span>
  )
}
