import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Award, Flame, Star } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { KpiCard } from '@/components/admin/KpiCard'
import { AchievementBadge } from '@/components/membro/AchievementBadge'
import { CertificateCard } from '@/components/membro/CertificateCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { mockAchievements, mockCertificates, mockWeeklyMetrics } from '@/lib/mocks'

export const Route = createFileRoute('/dashboard/membro/progresso')({
  component: ProgressoPage,
})

function ProgressoPage() {
  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Trilhas concluídas" value={3} icon={BookOpen} iconColor="#7B2FBE" />
        <KpiCard label="Certificados" value={3} icon={Award} iconColor="#F59E0B" />
        <KpiCard label="Dias consecutivos" value={7} icon={Flame} iconColor="#EF4444" />
        <KpiCard label="Pontos totais" value={4250} icon={Star} iconColor="#2979FF" />
      </div>

      {/* Overall progress */}
      <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-6">
        <h3 className="font-display font-semibold text-white mb-4">Progresso Geral</h3>
        <div className="space-y-4">
          {[
            { label: 'Fundamentos da Comunicação', value: 100 },
            { label: 'Liderança e Influência', value: 100 },
            { label: 'Apresentações que Convencem', value: 100 },
            { label: 'Negociação de Alto Impacto', value: 58 },
            { label: 'Escrita Profissional', value: 20 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#C4B5FD]">{item.label}</span>
                <span className="text-white font-semibold">{item.value}%</span>
              </div>
              <ProgressBar
                value={item.value}
                size="md"
                color={item.value === 100 ? 'success' : 'brand'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Weekly activity chart */}
      <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-6">
        <h3 className="font-display font-semibold text-white mb-4">Atividade Semanal</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mockWeeklyMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
            <XAxis dataKey="week" tick={{ fill: '#7C7C9C', fontSize: 12 }} />
            <YAxis tick={{ fill: '#7C7C9C', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#18182A', border: '1px solid #2A2A40', borderRadius: 8, color: '#fff' }} />
            <Bar dataKey="completions" fill="#7B2FBE" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Achievements */}
      <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-6">
        <h3 className="font-display font-semibold text-white mb-6">Conquistas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {mockAchievements.map((ach) => (
            <AchievementBadge key={ach.id} achievement={ach} size="md" />
          ))}
        </div>
      </div>

      {/* Certificates */}
      <div>
        <h3 className="font-display font-semibold text-white mb-4">Certificados</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {mockCertificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      </div>
    </div>
  )
}
