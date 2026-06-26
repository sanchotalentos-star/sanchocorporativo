import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAuth } from './AuthGuard'
import { cn } from '@/lib/utils'

interface TopbarProps {
  title: string
}

export function Topbar({ title }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="h-16 bg-[#0F0F1A] border-b border-[#2A2A40] flex items-center justify-between px-6">
      <h1 className="text-lg font-display font-semibold text-white tracking-wide">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#7C7C9C] hover:bg-[#2A2A40] hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7B2FBE] rounded-full" />
        </button>

        {/* User Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-1.5',
              'text-[#C4B5FD] hover:bg-[#2A2A40] hover:text-white transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#7B2FBE]'
            )}>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full border border-[#7B2FBE]/50"
              />
              <span className="text-sm font-medium hidden sm:block">{user.name.split(' ')[0]}</span>
              <ChevronDown className="w-4 h-4 text-[#7C7C9C]" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-52 bg-[#18182A] border border-[#2A2A40] rounded-xl shadow-xl p-1.5"
              align="end"
              sideOffset={6}
            >
              <div className="px-3 py-2 mb-1 border-b border-[#2A2A40]">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-[#7C7C9C]">{user.email}</p>
              </div>

              {[
                { icon: User, label: 'Meu Perfil' },
                { icon: Settings, label: 'Configurações' },
              ].map(({ icon: Icon, label }) => (
                <DropdownMenu.Item
                  key={label}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#C4B5FD] rounded-lg hover:bg-[#2A2A40] hover:text-white cursor-pointer focus:outline-none focus:bg-[#2A2A40]"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </DropdownMenu.Item>
              ))}

              <DropdownMenu.Separator className="my-1 border-t border-[#2A2A40]" />

              <DropdownMenu.Item className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#EF4444] rounded-lg hover:bg-[#EF4444]/10 cursor-pointer focus:outline-none focus:bg-[#EF4444]/10">
                <LogOut className="w-4 h-4" />
                Sair
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
