import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, PlayCircle, Trophy, Star } from 'lucide-react'
import { TrailCard } from '@/components/membro/TrailCard'
import { LiveCard } from '@/components/membro/LiveCard'
import { AchievementBadge } from '@/components/membro/AchievementBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { mockTrails, mockLives, mockAchievements } from '@/lib/mocks'
import { staggerContainer, fadeIn } from '@/lib/motion'
import { useAuth } from '@/components/layout/AuthGuard'

export const Route = createFileRoute('/dashboard/membro/')({
  component: MembroHome,
})

const inProgressTrails = [
  { trail: mockTrails[0], progress: 65 },
  { trail: mockTrails[1], progress: 30 },
]

function MembroHome() {
  const { user } = useAuth()
  const upcomingLive = mockLives.find((l) => l.status === 'upcoming')
  const unlockedAchievements = mockAchievements.filter((a) => a.unlocked).slice(0, 4)

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={fadeIn}
        className="relative rounded-2xl overflow-hidden p-7"
        style={{ background: 'linear-gradient(135deg, #1A0A2E 0%, #0D1533 100%)' }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'linear-gradient(135deg, #7B2FBE 0%, #2979FF 100%)' }} />
        <div className="relative">
          <p className="text-[#C4B5FD] text-sm mb-1">Bem-vindo de volta,</p>
          <h1 className="text-2xl font-display font-bold text-white mb-2">{user.name}</h1>
          <p className="text-[#7C7C9C] text-sm mb-4">Continue sua jornada de comunicação corporativa.</p>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-[#7C7C9C]">Progresso geral</p>
              <p className="text-2xl font-display font-bold text-white">67%</p>
            </div>
            <div className="flex-1 max-w-xs">
              <ProgressBar value={67} showLabel={false} size="md" />
            </div>
          </div>
        </div>
        <div className="absolute right-6 top-6 opacity-20">
          <Star className="w-24 h-24 text-[#BF5AF2]" />
        </div>
      </motion.div>

      {/* In progress */}
      <motion.div variants={fadeIn}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-white">Continuando...</h2>
          <Link to="/dashboard/membro/trilhas">
            <Button variant="ghost" size="sm">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {inProgressTrails.map(({ trail, progress }) => (
            <TrailCard key={trail.id} trail={trail} progress={progress} />
          ))}
        </div>
      </motion.div>

      {/* Trail Catalog */}
      <motion.div variants={fadeIn}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-white">Trilhas Disponíveis</h2>
          <Link to="/dashboard/membro/trilhas">
            <Button variant="ghost" size="sm">
              Explorar <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {mockTrails.filter((t) => t.published).slice(0, 3).map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}
        </div>
      </motion.div>

      {/* Next live + Achievements */}
      <motion.div variants={fadeIn} className="grid lg:grid-cols-3 gap-6">
        {/* Next live */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-display font-semibold text-white mb-4">
            <PlayCircle className="inline w-5 h-5 text-[#EF4444] mr-2" />
            Próxima Live
          </h2>
          {upcomingLive && <LiveCard session={upcomingLive} />}
        </div>

        {/* Recent achievements */}
        <div>
          <h2 className="text-lg font-display font-semibold text-white mb-4">
            <Trophy className="inline w-5 h-5 text-[#F59E0B] mr-2" />
            Conquistas
          </h2>
          <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4">
              {unlockedAchievements.map((ach) => (
                <AchievementBadge key={ach.id} achievement={ach} size="sm" />
              ))}
            </div>
            <Link to="/dashboard/membro/progresso">
              <Button variant="ghost" size="sm" className="w-full mt-4">
                Ver todas <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
