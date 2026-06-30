import { Bell, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface TopbarProps {
  onMenuClick?: () => void
  title?: string
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-gray-700">
            <Menu size={20} />
          </button>
        )}
        {title && <h1 className="text-base font-black text-gray-900 uppercase tracking-tight">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#7B2FBE] rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#7B2FBE] flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-[#7B2FBE]/20">
          {user?.full_name?.charAt(0) ?? 'U'}
        </div>
      </div>
    </header>
  )
}
