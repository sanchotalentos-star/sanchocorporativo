import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'brand' | 'accent' | 'success' | 'neon'
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const colorMap = {
  brand: 'from-[#2979FF] to-[#7B2FBE]',
  accent: 'from-[#2979FF] to-[#5C9DFF]',
  success: 'from-[#22C55E] to-[#16A34A]',
  neon: 'from-[#7B2FBE] to-[#BF5AF2]',
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
  size = 'md',
  color = 'brand',
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-[#7C7C9C]">Progresso</span>
          <span className="text-xs font-semibold text-[#C4B5FD]">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-[#2A2A40] rounded-full overflow-hidden', sizeMap[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full bg-gradient-to-r', colorMap[color])}
        />
      </div>
    </div>
  )
}
