import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        'flex h-10 w-full appearance-none rounded-lg border border-[#E2E8F0] bg-white px-3 pr-8 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-[#94A3B8] pointer-events-none" />
  </div>
))
Select.displayName = 'Select'

export { Select }
