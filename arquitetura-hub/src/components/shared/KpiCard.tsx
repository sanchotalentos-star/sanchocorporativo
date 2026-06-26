import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fadeInUp } from '@/lib/motion'

interface KpiCardProps {
  label: string
  value: string | number
  unit?: string
  trend?: number
  icon?: LucideIcon
  accent?: boolean
  className?: string
}

export function KpiCard({ label, value, unit, trend, icon: Icon, accent, className }: KpiCardProps) {
  const trendUp = trend !== undefined && trend > 0
  const trendDown = trend !== undefined && trend < 0

  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        'rounded-xl border p-5 bg-white shadow-sm',
        accent ? 'border-[#D97706] bg-gradient-to-br from-amber-50 to-white' : 'border-[#E2E8F0]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#475569] font-medium truncate">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={cn('text-2xl font-bold', accent ? 'text-[#B45309]' : 'text-[#0F172A]')}>
              {value}
            </span>
            {unit && <span className="text-sm text-[#94A3B8]">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div className={cn('flex items-center gap-1 mt-1 text-xs font-medium',
              trendUp ? 'text-green-600' : trendDown ? 'text-red-500' : 'text-[#94A3B8]'
            )}>
              {trendUp ? <TrendingUp size={12} /> : trendDown ? <TrendingDown size={12} /> : <Minus size={12} />}
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
            accent ? 'bg-[#D97706]/15' : 'bg-[#1B3A5C]/10'
          )}>
            <Icon size={20} className={accent ? 'text-[#D97706]' : 'text-[#1B3A5C]'} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
