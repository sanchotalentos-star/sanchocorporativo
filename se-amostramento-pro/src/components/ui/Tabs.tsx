import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface TabItem {
  value: string
  label: string
  content: ReactNode
}

interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  className?: string
}

export function Tabs({ items, defaultValue, className }: TabsProps) {
  return (
    <RadixTabs.Root defaultValue={defaultValue ?? items[0]?.value} className={cn('w-full', className)}>
      <RadixTabs.List className="flex gap-1 bg-[#0F0F1A] rounded-lg p-1 mb-6">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium text-[#7C7C9C] transition-all duration-200',
              'hover:text-white',
              'data-[state=active]:bg-[#7B2FBE] data-[state=active]:text-white data-[state=active]:shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2FBE]'
            )}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content
          key={item.value}
          value={item.value}
          className="focus-visible:outline-none"
        >
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}

export { RadixTabs }
