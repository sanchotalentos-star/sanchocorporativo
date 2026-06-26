import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'
import { motion } from 'framer-motion'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean
}

export function Card({ className, glow, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#18182A] border border-[#2A2A40] rounded-xl transition-all duration-200',
        glow && 'hover:border-[#7B2FBE] hover:shadow-[0_0_20px_rgba(123,47,190,0.3)]',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-semibold text-white font-display tracking-wide', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-[#7C7C9C] mt-1', className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-6 pt-0 flex items-center', className)}
      {...props}
    />
  )
}

export function GlowCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-[#18182A] border border-[#2A2A40] rounded-xl transition-all duration-300',
        'hover:border-[#7B2FBE] hover:shadow-[0_0_30px_rgba(123,47,190,0.35)]',
        className
      )}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
    >
      {children}
    </motion.div>
  )
}

// Need to import React for motion.div props typing
import type React from 'react'
