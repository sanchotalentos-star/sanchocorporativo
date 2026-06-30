import { Bell, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface TopbarProps {
  onMenuClick?: () => void
  title?: string
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="h-14 border-b border-[#1A2E4A] bg-[#070E1A] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden text-[#4A7FA5] hover:text-white">
            <Menu size={20} />
          </button>
        )}
        {title && <h1 className="text-base font-semibold text-white">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-[#4A7FA5] hover:text-white rounded-lg hover:bg-[#0A1E30] transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#F59E0B] rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white text-sm font-bold">
          {user?.full_name?.charAt(0) ?? 'U'}
        </div>
      </div>
    </header>
  )
}
