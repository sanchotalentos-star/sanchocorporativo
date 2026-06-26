import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { CountUp } from '@/components/ui/CountUp'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: number
  trend?: number
  icon: LucideIcon
  prefix?: string
  suffix?: string
  decimals?: number
  iconColor?: string
  className?: string
}

export function KpiCard({
  label,
  value,
  trend,
  icon: Icon,
  prefix = '',
  suffix = '',
  decimals = 0,
  iconColor = '#7B2FBE',
  className,
}: KpiCardProps) {
  const positive = trend === undefined || trend >= 0

  return (
    <div
      className={cn(
        'bg-[#18182A] border border-[#2A2A40] rounded-xl p-5 hover:border-[#7B2FBE]/50 transition-all duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${iconColor}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        {trend !== undefined && (
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
              positive
                ? 'text-[#22C55E] bg-[#22C55E]/10'
                : 'text-[#EF4444] bg-[#EF4444]/10'
            )}
          >
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <CountUp
        end={value}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals}
        className="text-3xl font-display font-bold text-white"
      />
      <p className="text-sm text-[#7C7C9C] mt-1">{label}</p>
    </div>
  )
}
