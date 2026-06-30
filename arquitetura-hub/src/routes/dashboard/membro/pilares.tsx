import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { PilarAccordion } from '@/components/membro/PilarAccordion'
import { staggerContainer } from '@/lib/motion'
import { mockPilares } from '@/lib/mocks/pilares'
import type { Pilar } from '@/types'

export const Route = createFileRoute('/dashboard/membro/pilares')({
  component: PilaresPage,
})

function PilaresPage() {
  const [pilares, setPilares] = useState<Pilar[]>(mockPilares)

  function handleToggleAcao(pilarId: string, acaoId: string, concluida: boolean) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      return { ...p, acoes: p.acoes.map(a => a.id === acaoId ? { ...a, concluida } : a) }
    }))
  }

  function handleAddAcao(pilarId: string, texto: string) {
    setPilares(prev => prev.map(p => {
      if (p.id !== pilarId) return p
      const newAcao = {
        id: `a-${Date.now()}`,
        pilar_id: pilarId,
        texto,
        concluida: false,
        ordem: p.acoes.length + 1,
      }
      return { ...p, acoes: [...p.acoes, newAcao] }
    }))
  }

  const totalAcoes = pilares.reduce((s, p) => s + p.acoes.length, 0)
  const doneAcoes = pilares.reduce((s, p) => s + p.acoes.filter(a => a.concluida).length, 0)
  const overallPct = totalAcoes > 0 ? Math.round((doneAcoes / totalAcoes) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Pilares Estratégicos</h1>
          <p className="text-gray-400 mt-1 text-sm">Gerencie as dimensões da sua arquitetura de relevância</p>
        </div>
        <div className="text-right bg-white border border-[#7B2FBE]/20 rounded-2xl px-5 py-3 shadow-sm shadow-[#7B2FBE]/5">
          <p className="text-3xl font-black text-[#7B2FBE]">{overallPct}%</p>
          <p className="text-xs text-gray-400">{doneAcoes}/{totalAcoes} ações</p>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {pilares.map(pilar => (
          <PilarAccordion
            key={pilar.id}
            pilar={pilar}
            onToggleAcao={handleToggleAcao}
            onAddAcao={handleAddAcao}
          />
        ))}
      </motion.div>
    </div>
  )
}
