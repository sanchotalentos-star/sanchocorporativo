import { useState } from 'react'
import { Check, Upload, BookOpen, Settings, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { mockTrails } from '@/lib/mocks'

const steps = [
  { id: 1, label: 'Selecionar Trilha', icon: BookOpen },
  { id: 2, label: 'Upload', icon: Upload },
  { id: 3, label: 'Configurar Acesso', icon: Settings },
  { id: 4, label: 'Revisar & Publicar', icon: Eye },
]

interface UploadConfig {
  trailId: string
  moduleId: string
  title: string
  description: string
  fileType: string
  duration: string
  accessLevel: string
}

const defaultConfig: UploadConfig = {
  trailId: '',
  moduleId: '',
  title: '',
  description: '',
  fileType: 'video',
  duration: '',
  accessLevel: 'all',
}

export function UploadWizard() {
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState<UploadConfig>(defaultConfig)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const selectedTrail = mockTrails.find((t) => t.id === config.trailId)

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
    else {
      toast.success('Conteúdo publicado com sucesso!')
      setStep(1)
      setConfig(defaultConfig)
      setFileName(null)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center mb-10">
        {steps.map((s, i) => {
          const Icon = s.icon
          const active = s.id === step
          const done = s.id < step
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                  done && 'bg-[#7B2FBE] border-[#7B2FBE]',
                  active && 'border-[#7B2FBE] bg-[#7B2FBE]/20',
                  !done && !active && 'border-[#2A2A40] bg-[#0F0F1A]'
                )}>
                  {done ? <Check className="w-5 h-5 text-white" /> : <Icon className={cn('w-5 h-5', active ? 'text-[#9D4FE3]' : 'text-[#7C7C9C]')} />}
                </div>
                <span className={cn('text-xs font-medium whitespace-nowrap', active ? 'text-white' : done ? 'text-[#9D4FE3]' : 'text-[#7C7C9C]')}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('flex-1 h-0.5 mx-2 mb-5', done ? 'bg-[#7B2FBE]' : 'bg-[#2A2A40]')} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="bg-[#18182A] border border-[#2A2A40] rounded-2xl p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-white mb-4">Selecione Trilha e Módulo</h3>
            <Select
              label="Trilha"
              options={mockTrails.map((t) => ({ value: t.id, label: t.title }))}
              value={config.trailId}
              onValueChange={(v) => setConfig({ ...config, trailId: v, moduleId: '' })}
              placeholder="Selecione uma trilha..."
            />
            {selectedTrail && (
              <Select
                label="Módulo"
                options={selectedTrail.modules.map((m) => ({ value: m.id, label: m.title }))}
                value={config.moduleId}
                onValueChange={(v) => setConfig({ ...config, moduleId: v })}
                placeholder="Selecione um módulo..."
              />
            )}
            <Input
              label="Título do Conteúdo"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              placeholder="Ex: Aula 1 - Introdução"
            />
            <Input
              label="Descrição"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              placeholder="Breve descrição do conteúdo..."
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-white mb-4">Upload do Arquivo</h3>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                const file = e.dataTransfer.files[0]
                if (file) setFileName(file.name)
              }}
              className={cn(
                'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200',
                dragging ? 'border-[#7B2FBE] bg-[#7B2FBE]/10' : 'border-[#2A2A40] hover:border-[#7B2FBE]/50'
              )}
            >
              <Upload className="w-12 h-12 text-[#7C7C9C] mx-auto mb-3" />
              {fileName ? (
                <p className="text-white font-medium">{fileName}</p>
              ) : (
                <>
                  <p className="text-white font-medium mb-1">Arraste e solte o arquivo aqui</p>
                  <p className="text-sm text-[#7C7C9C]">ou clique para selecionar</p>
                  <p className="text-xs text-[#7C7C9C] mt-2">MP4, PDF, PPTX até 2GB</p>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Tipo de Arquivo"
                options={[
                  { value: 'video', label: 'Vídeo' },
                  { value: 'pdf', label: 'PDF' },
                  { value: 'slides', label: 'Slides' },
                  { value: 'audio', label: 'Áudio' },
                ]}
                value={config.fileType}
                onValueChange={(v) => setConfig({ ...config, fileType: v })}
              />
              <Input
                label="Duração (min)"
                type="number"
                value={config.duration}
                onChange={(e) => setConfig({ ...config, duration: e.target.value })}
                placeholder="Ex: 45"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-white mb-4">Configurar Acesso</h3>
            <Select
              label="Nível de Acesso"
              options={[
                { value: 'all', label: 'Todos os membros' },
                { value: 'premium', label: 'Planos Empresa e Corporativo' },
                { value: 'corporate', label: 'Somente Corporativo' },
                { value: 'specific', label: 'Organizações específicas' },
              ]}
              value={config.accessLevel}
              onValueChange={(v) => setConfig({ ...config, accessLevel: v })}
            />
            <div className="bg-[#0F0F1A] rounded-lg p-4">
              <p className="text-sm text-[#7C7C9C]">
                O conteúdo estará disponível para <strong className="text-[#9D4FE3]">todos os membros ativos</strong> nas organizações selecionadas imediatamente após a publicação.
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-white mb-4">Revisar & Publicar</h3>
            <div className="space-y-3">
              {[
                { label: 'Trilha', value: selectedTrail?.title ?? '—' },
                { label: 'Título', value: config.title || '—' },
                { label: 'Tipo', value: config.fileType || '—' },
                { label: 'Duração', value: config.duration ? `${config.duration} min` : '—' },
                { label: 'Acesso', value: config.accessLevel || '—' },
                { label: 'Arquivo', value: fileName ?? 'Nenhum arquivo selecionado' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-[#2A2A40] last:border-0">
                  <span className="text-sm text-[#7C7C9C]">{label}</span>
                  <span className="text-sm font-medium text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
            Voltar
          </Button>
          <Button variant="primary" onClick={handleNext}>
            {step === 4 ? 'Publicar' : 'Próximo'}
          </Button>
        </div>
      </div>
    </div>
  )
}
