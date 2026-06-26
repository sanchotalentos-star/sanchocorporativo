import { Video, FileText, Mic, Presentation, CheckCircle2, PlayCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ContentType = 'video' | 'pdf' | 'audio' | 'slides'
type ContentStatus = 'not-started' | 'in-progress' | 'completed'

interface ContentItemProps {
  id: string
  title: string
  type: ContentType
  duration: number
  status: ContentStatus
  onClick?: () => void
}

const typeIcon: Record<ContentType, React.ElementType> = {
  video: Video,
  pdf: FileText,
  audio: Mic,
  slides: Presentation,
}

const typeLabel: Record<ContentType, string> = {
  video: 'Vídeo',
  pdf: 'PDF',
  audio: 'Áudio',
  slides: 'Slides',
}

import type React from 'react'

export function ContentItem({ title, type, duration, status, onClick }: ContentItemProps) {
  const Icon = typeIcon[type]

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-150 text-left',
        'hover:bg-[#2A2A40] group',
        status === 'in-progress' && 'bg-[#7B2FBE]/10 border-l-2 border-[#7B2FBE]'
      )}
    >
      {/* Type icon */}
      <div className={cn(
        'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
        status === 'completed' ? 'bg-[#22C55E]/20' : 'bg-[#2A2A40] group-hover:bg-[#7B2FBE]/20'
      )}>
        <Icon className={cn(
          'w-4.5 h-4.5',
          status === 'completed' ? 'text-[#22C55E]' : status === 'in-progress' ? 'text-[#9D4FE3]' : 'text-[#7C7C9C]'
        )} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          status === 'completed' ? 'text-[#7C7C9C] line-through' : 'text-white'
        )}>
          {title}
        </p>
        <p className="text-xs text-[#7C7C9C]">{typeLabel[type]} · {duration} min</p>
      </div>

      {/* Status */}
      <div className="flex-shrink-0">
        {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />}
        {status === 'in-progress' && <PlayCircle className="w-5 h-5 text-[#9D4FE3]" />}
        {status === 'not-started' && <Circle className="w-5 h-5 text-[#2A2A40]" />}
      </div>
    </button>
  )
}
