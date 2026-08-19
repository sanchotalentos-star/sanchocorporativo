import { cn } from '@/lib/utils'

type Status = 'green' | 'yellow' | 'red'

interface StatusChipProps {
  status: Status
  label?: string
  className?: string
}

const labels: Record<Status, string> = { green: 'No alvo', yellow: 'Atenção', red: 'Crítico' }
const styles: Record<Status, string> = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
}

export function StatusChip({ status, label, className }: StatusChipProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold', styles[status], className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', {
        'bg-green-500': status === 'green',
        'bg-yellow-500': status === 'yellow',
        'bg-red-500': status === 'red',
      })} />
      {label ?? labels[status]}
    </span>
  )
}
