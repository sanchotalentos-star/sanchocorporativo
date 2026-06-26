import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080810] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-[#7B2FBE] text-white hover:bg-[#6B21A8] focus-visible:ring-[#7B2FBE] shadow-lg hover:shadow-[0_0_20px_rgba(123,47,190,0.4)]',
        secondary:
          'border border-[#2979FF] text-[#5C9DFF] hover:bg-[#2979FF]/10 focus-visible:ring-[#2979FF]',
        ghost:
          'text-[#C4B5FD] hover:bg-[#2A2A40] hover:text-white focus-visible:ring-[#7B2FBE]',
        neon:
          'bg-transparent border border-[#BF5AF2] text-[#BF5AF2] hover:bg-[#BF5AF2]/10 hover:shadow-[0_0_16px_rgba(191,90,242,0.4)] focus-visible:ring-[#BF5AF2]',
        danger:
          'bg-[#EF4444] text-white hover:bg-red-700 focus-visible:ring-[#EF4444]',
        outline:
          'border border-[#2A2A40] text-[#C4B5FD] hover:border-[#7B2FBE] hover:text-white focus-visible:ring-[#7B2FBE]',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
