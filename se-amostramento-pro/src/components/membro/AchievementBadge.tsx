import { Star, Map, MessageCircle, Flame, Trophy, Handshake, Video, Zap, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Achievement } from '@/lib/mocks'
import { ProgressBar } from '@/components/ui/ProgressBar'

const iconMap: Record<string, React.ElementType> = {
  star: Star,
  map: Map,
  'message-circle': MessageCircle,
  flame: Flame,
  trophy: Trophy,
  handshake: Handshake,
  video: Video,
  zap: Zap,
}

import type React from 'react'

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon] ?? Star
  const sizeMap = { sm: 'w-12 h-12', md: 'w-16 h-16', lg: 'w-20 h-20' }
  const iconSizeMap = { sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-9 h-9' }

  return (
    <div className="flex flex-col items-center gap-2 group cursor-default">
      <div
        className={cn(
          'rounded-2xl flex items-center justify-center relative transition-all duration-300',
          sizeMap[size],
          achievement.unlocked
            ? 'bg-gradient-to-br from-[#7B2FBE] to-[#2979FF] shadow-[0_0_20px_rgba(123,47,190,0.5)] group-hover:shadow-[0_0_30px_rgba(123,47,190,0.7)]'
            : 'bg-[#2A2A40] grayscale opacity-60'
        )}
      >
        {achievement.unlocked ? (
          <Icon className={cn(iconSizeMap[size], 'text-white')} />
        ) : (
          <Lock className={cn(iconSizeMap[size], 'text-[#7C7C9C]')} />
        )}
      </div>

      {size !== 'sm' && (
        <div className="text-center">
          <p className={cn('text-xs font-semibold', achievement.unlocked ? 'text-white' : 'text-[#7C7C9C]')}>
            {achievement.title}
          </p>
          {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
            <div className="mt-1 w-16">
              <ProgressBar value={achievement.progress} max={achievement.maxProgress} size="sm" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
