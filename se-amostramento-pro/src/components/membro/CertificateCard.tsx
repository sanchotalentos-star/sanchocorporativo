import { Award, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Certificate } from '@/lib/mocks'
import { toast } from 'sonner'

interface CertificateCardProps {
  certificate: Certificate
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const handleDownload = () => {
    toast.success('Download do certificado iniciado!')
  }

  const date = new Date(certificate.issuedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-5 hover:border-[#7B2FBE]/50 transition-all duration-200">
      {/* Certificate visual header */}
      <div className="h-24 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #080810 0%, #1A0A2E 50%, #0D1533 100%)' }}>
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #7B2FBE 0, #7B2FBE 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
        <div className="relative text-center">
          <Award className="w-8 h-8 text-[#F59E0B] mx-auto mb-1" />
          <p className="text-xs font-display font-semibold text-[#C4B5FD] tracking-widest uppercase">Certificado</p>
        </div>
      </div>

      <h3 className="font-display font-semibold text-white mb-1">{certificate.trailTitle}</h3>
      <p className="text-xs text-[#7C7C9C] mb-3">Emitido em {date}</p>

      <div className="bg-[#0F0F1A] rounded-lg px-3 py-2 mb-4">
        <p className="text-xs text-[#7C7C9C]">Código de verificação</p>
        <p className="text-sm font-mono text-[#9D4FE3] font-semibold">{certificate.verificationCode}</p>
      </div>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={handleDownload} className="flex-1">
          <Download className="w-4 h-4" />
          Baixar
        </Button>
        <Button variant="ghost" size="icon">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
