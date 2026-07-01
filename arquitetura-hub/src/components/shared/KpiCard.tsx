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
  const trendUp = trend !== undefined && trend > 0
  const trendDown = trend !== undefined && trend < 0

  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        'rounded-2xl border p-5 bg-white relative overflow-hidden',
        accent ? 'border-[#7B2FBE]/25' : 'border-gray-200',
        className
      )}
    >
      {accent && <div className="absolute top-0 left-0 w-1 h-full bg-[#7B2FBE] rounded-l-2xl" />}
      <div className={cn('flex flex-col gap-3', accent && 'pl-1')}>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{label}</p>
          {Icon && <Icon size={14} className={accent ? 'text-[#7B2FBE]' : 'text-gray-300'} />}
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className={cn('text-3xl font-black leading-none', accent ? 'text-[#7B2FBE]' : 'text-gray-900')}>
              {value}
            </span>
            {unit && <span className="text-xs text-gray-400 font-medium">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div className={cn('flex items-center gap-1 mt-2 text-xs font-bold',
              trendUp ? 'text-emerald-500' : trendDown ? 'text-red-400' : 'text-gray-400'
            )}>
              {trendUp ? <TrendingUp size={10} /> : trendDown ? <TrendingDown size={10} /> : null}
              {trend > 0 ? '+' : ''}{trend}% este mês
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
