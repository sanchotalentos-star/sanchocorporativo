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
        'rounded-2xl border p-5 relative overflow-hidden bg-white',
        accent
          ? 'border-[#7B2FBE]/30 shadow-sm shadow-[#7B2FBE]/10'
          : 'border-gray-200 shadow-sm',
        className
      )}
    >
      {accent && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#7B2FBE]/5 to-transparent pointer-events-none" />
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest truncate">{label}</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className={cn('text-2xl font-black', accent ? 'text-[#7B2FBE]' : 'text-gray-900')}>
              {value}
            </span>
            {unit && <span className="text-sm text-gray-400 font-medium">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-bold',
              trendUp ? 'text-emerald-500' : trendDown ? 'text-red-500' : 'text-gray-400'
            )}>
              {trendUp ? <TrendingUp size={11} /> : trendDown ? <TrendingDown size={11} /> : <Minus size={11} />}
              {trend > 0 ? '+' : ''}{trend}% este mês
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            accent ? 'bg-[#7B2FBE]/10' : 'bg-gray-100'
          )}>
            <Icon size={19} className={accent ? 'text-[#7B2FBE]' : 'text-gray-400'} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
