import { Check, X, Building2, Mail, Phone, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'sonner'
import type { AccessRequest } from '@/lib/mocks'

interface RequestCardProps {
  request: AccessRequest
}

const planBadgeVariant: Record<string, 'primary' | 'accent' | 'neon' | 'success'> = {
  Solo: 'accent',
  Team: 'primary',
  Empresa: 'neon',
  Corporativo: 'success',
}

export function RequestCard({ request }: RequestCardProps) {
  const handleApprove = () => {
    toast.success(`Solicitação de ${request.orgName} aprovada!`)
  }
  const handleReject = () => {
    toast.error(`Solicitação de ${request.orgName} rejeitada.`)
  }

  const date = new Date(request.submittedAt)
  const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-[#18182A] border border-[#2A2A40] rounded-xl p-5 hover:border-[#7B2FBE]/40 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#7B2FBE]/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#9D4FE3]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{request.orgName}</h3>
            <p className="text-xs text-[#7C7C9C]">{formattedDate}</p>
          </div>
        </div>
        <Badge variant={planBadgeVariant[request.plan] ?? 'default'}>{request.plan}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-[#C4B5FD]">
          <Mail className="w-4 h-4 text-[#7C7C9C]" />
          <span className="truncate">{request.email}</span>
        </div>
        <div className="flex items-center gap-2 text-[#C4B5FD]">
          <Phone className="w-4 h-4 text-[#7C7C9C]" />
          {request.phone}
        </div>
        <div className="flex items-center gap-2 text-[#C4B5FD]">
          <Users className="w-4 h-4 text-[#7C7C9C]" />
          {request.employees} colaboradores
        </div>
        <div className="text-[#7C7C9C]">{request.industry}</div>
      </div>

      {request.message && (
        <p className="text-sm text-[#7C7C9C] bg-[#0F0F1A] rounded-lg p-3 mb-4 line-clamp-2">
          "{request.message}"
        </p>
      )}

      <div className="flex gap-2">
        <Button variant="primary" size="sm" className="flex-1" onClick={handleApprove}>
          <Check className="w-4 h-4" />
          Aprovar
        </Button>
        <Button variant="danger" size="sm" className="flex-1" onClick={handleReject}>
          <X className="w-4 h-4" />
          Rejeitar
        </Button>
      </div>
    </div>
  )
}
