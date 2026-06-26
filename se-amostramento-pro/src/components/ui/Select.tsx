import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  disabled?: boolean
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Selecione...',
  label,
  className,
  disabled,
}: SelectProps) {
  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-[#C4B5FD]">{label}</label>
      )}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={cn(
            'flex w-full items-center justify-between rounded-lg bg-[#0F0F1A] border border-[#2A2A40] px-4 py-2.5 text-sm text-white',
            'focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]',
            'data-[placeholder]:text-[#7C7C9C]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors duration-200 cursor-pointer'
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="w-4 h-4 text-[#7C7C9C]" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 overflow-hidden rounded-lg bg-[#18182A] border border-[#2A2A40] shadow-xl shadow-black/40"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    'relative flex items-center justify-between px-4 py-2.5 text-sm rounded-md cursor-pointer',
                    'text-[#C4B5FD] hover:bg-[#2A2A40] hover:text-white',
                    'data-[highlighted]:bg-[#7B2FBE]/20 data-[highlighted]:text-white',
                    'focus:outline-none transition-colors duration-150'
                  )}
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check className="w-4 h-4 text-[#7B2FBE]" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  )
}
