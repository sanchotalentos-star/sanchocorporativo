import { Clock, Users, Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Trail } from '@/lib/mocks'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

interface TrailCardProps {
  trail: Trail
  progress?: number
}

const levelLabel: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

const levelVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  iniciante: 'success',
  intermediario: 'warning',
  avancado: 'danger',
}

const categoryLabel: Record<string, string> = {
  comunicacao: 'Comunicação',
  lideranca: 'Liderança',
  negociacao: 'Negociação',
  apresentacao: 'Apresentação',
  escrita: 'Escrita',
}

export function TrailCard({ trail, progress }: TrailCardProps) {
  const hours = Math.floor(trail.duration / 60)
  const mins = trail.duration % 60

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-[#18182A] border border-[#2A2A40] rounded-xl overflow-hidden hover:border-[#7B2FBE] hover:shadow-[0_0_24px_rgba(123,47,190,0.3)] transition-all duration-300 cursor-pointer"
    >
      <Link to="/dashboard/membro/trilha/$id" params={{ id: trail.id }}>
        {/* Thumbnail 16:9 */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={trail.thumbnail}
            alt={trail.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18182A]/80 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={levelVariant[trail.level] ?? 'default'}>{levelLabel[trail.level]}</Badge>
            <Badge variant="accent">{categoryLabel[trail.category]}</Badge>
          </div>
          {!trail.published && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning">Rascunho</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-white text-base mb-1 line-clamp-2">{trail.title}</h3>
          <p className="text-xs text-[#7C7C9C] mb-3 line-clamp-2">{trail.description}</p>

          <div className="flex items-center gap-4 text-xs text-[#7C7C9C] mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {hours}h{mins > 0 ? ` ${mins}min` : ''}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {trail.enrollments.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-[#F59E0B]">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
              {trail.rating}
            </span>
          </div>

          {progress !== undefined && (
            <ProgressBar value={progress} showLabel size="sm" />
          )}
        </div>
      </Link>
    </motion.div>
  )
}
