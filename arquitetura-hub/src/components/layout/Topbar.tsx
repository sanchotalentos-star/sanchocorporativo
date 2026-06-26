import { Bell, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface TopbarProps {
  onMenuClick?: () => void
  title?: string
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="h-16 border-b border-[#E2E8F0] bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden text-[#475569] hover:text-[#0F172A]">
            <Menu size={20} />
          </button>
        )}
        {title && <h1 className="text-lg font-semibold text-[#0F172A]">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-[#475569] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9]">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D97706] rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#1B3A5C] flex items-center justify-center text-white text-sm font-bold">
          {user?.full_name?.charAt(0) ?? 'U'}
        </div>
      </div>
    </header>
  )
}
