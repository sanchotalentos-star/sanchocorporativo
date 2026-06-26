import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#C4B5FD]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg bg-[#0F0F1A] border border-[#2A2A40] px-4 py-2.5 text-sm text-white placeholder:text-[#7C7C9C]',
            'focus:outline-none focus:border-[#7B2FBE] focus:ring-1 focus:ring-[#7B2FBE]',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[#7C7C9C]">{hint}</p>}
        {error && <p className="text-xs text-[#EF4444]">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
