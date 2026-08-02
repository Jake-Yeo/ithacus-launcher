import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

const buttonVariants = cva('inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 disabled:cursor-wait disabled:opacity-50 motion-reduce:transition-none', {
  variants: {
    variant: {
      danger: 'rounded-full border border-danger-border bg-surface px-4 text-danger shadow-sm hover:bg-danger-soft active:scale-95 focus-visible:ring-danger/25',
      tile: 'group min-w-0 rounded-3xl p-1 text-center focus-visible:ring-turquoise/35',
    },
    fullWidth: { true: 'w-full' },
  },
  defaultVariants: { variant: 'danger' },
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, fullWidth, type = 'button', ...buttonAttributes }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, fullWidth }), className)} {...buttonAttributes} />
}
