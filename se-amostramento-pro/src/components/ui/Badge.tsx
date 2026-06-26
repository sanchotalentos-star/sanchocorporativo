import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#2A2A40] text-[#C4B5FD]',
        primary: 'bg-[#7B2FBE]/20 text-[#9D4FE3] border border-[#7B2FBE]/30',
        accent: 'bg-[#2979FF]/20 text-[#5C9DFF] border border-[#2979FF]/30',
        neon: 'bg-[#BF5AF2]/20 text-[#BF5AF2] border border-[#BF5AF2]/30',
        success: 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30',
        warning: 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30',
        danger: 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30',
        outline: 'border border-[#2A2A40] text-[#7C7C9C]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}
