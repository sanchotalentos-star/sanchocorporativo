import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
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
  const trendUp   = trend !== undefined && trend > 0
  const trendDown = trend !== undefined && trend < 0

  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        'border p-4 bg-white',
        accent ? 'border-[#7B2FBE]/25 border-l-2 border-l-[#7B2FBE]' : 'border-gray-200',
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        {Icon && <Icon size={13} className={accent ? 'text-[#7B2FBE]' : 'text-gray-300'} />}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={cn('text-2xl font-black leading-none', accent ? 'text-[#7B2FBE]' : 'text-gray-900')}>
          {value}
        </span>
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 mt-2 text-[10px] font-bold',
          trendUp ? 'text-emerald-500' : trendDown ? 'text-red-400' : 'text-gray-400'
        )}>
          {trendUp ? <TrendingUp size={10} /> : trendDown ? <TrendingDown size={10} /> : null}
          {trend > 0 ? '+' : ''}{trend}% este mês
        </div>
      )}
    </motion.div>
  )
}
