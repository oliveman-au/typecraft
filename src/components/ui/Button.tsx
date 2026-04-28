import { cn } from '@/lib/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-accent-primary hover:bg-accent-secondary text-white shadow-glow-sm hover:shadow-glow-md',
    secondary: 'bg-bg-elevated hover:bg-bg-card border border-white/8 text-text-primary hover:border-white/16',
    ghost: 'hover:bg-white/5 text-text-secondary hover:text-text-primary',
    danger: 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-base rounded-xl',
  }

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}
