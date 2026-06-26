import type { Variants } from 'framer-motion'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.08 } },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: prefersReducedMotion ? 0 : 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const slideDown: Variants = {
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export const pageTransition = {
  initial: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: prefersReducedMotion ? 0 : -8 },
  transition: { duration: 0.25, ease: 'easeInOut' },
}

export const cardHover = {
  whileHover: prefersReducedMotion ? {} : { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: prefersReducedMotion ? {} : { scale: 0.98 },
}
