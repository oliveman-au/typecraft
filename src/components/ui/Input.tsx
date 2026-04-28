import { cn } from '@/lib/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-bg-elevated border border-white/8 rounded-xl px-4 py-3 text-text-primary text-sm',
            'placeholder:text-text-muted',
            'focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20',
            'transition-all duration-200',
            icon ? 'pl-10' : undefined,
            error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}
