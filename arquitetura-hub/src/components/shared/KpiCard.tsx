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
        'rounded-2xl border p-5 relative overflow-hidden',
        accent
          ? 'bg-gradient-to-br from-[#1A2A0A] to-[#0D1B2E] border-[#F59E0B]/30'
          : 'bg-[#0D1B2E] border-[#1A2E4A]',
        className
      )}
    >
      {accent && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/5 to-transparent pointer-events-none" />
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#4A7FA5] font-medium uppercase tracking-wider truncate">{label}</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className={cn('text-2xl font-bold', accent ? 'text-[#F59E0B]' : 'text-white')}>
              {value}
            </span>
            {unit && <span className="text-sm text-[#4A7FA5]">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-medium',
              trendUp ? 'text-emerald-400' : trendDown ? 'text-red-400' : 'text-[#4A7FA5]'
            )}>
              {trendUp ? <TrendingUp size={11} /> : trendDown ? <TrendingDown size={11} /> : <Minus size={11} />}
              {trend > 0 ? '+' : ''}{trend}% este mês
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            accent ? 'bg-[#F59E0B]/15' : 'bg-[#112240]'
          )}>
            <Icon size={19} className={accent ? 'text-[#F59E0B]' : 'text-[#4A7FA5]'} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
