import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const baseClasses =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-control font-semibold tracking-[0.02em] transition-colors duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-primary bg-primary text-white hover:bg-primary-pressed active:bg-primary-pressed',
  secondary:
    'border border-transparent bg-primary-soft text-primary hover:bg-primary-soft/80 active:bg-primary-soft',
  outline:
    'border border-primary bg-transparent text-primary hover:bg-primary-soft active:bg-primary-soft',
  ghost:
    'border border-transparent bg-transparent text-text hover:bg-primary-soft active:bg-primary-soft',
  link: 'min-h-11 rounded-none border border-transparent bg-transparent px-0 text-link underline underline-offset-4 hover:text-primary active:text-primary-pressed',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  children,
  className,
  disabled,
  fullWidth = false,
  iconLeft,
  iconRight,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled}
      type={type}
      {...props}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  )
}
