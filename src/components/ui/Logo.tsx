import { Keyboard } from 'lucide-react'
import { cn } from '@/lib/cn'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className }: LogoProps) {
  const sizes = {
    sm: { icon: 16, text: 'text-lg' },
    md: { icon: 20, text: 'text-xl' },
    lg: { icon: 28, text: 'text-2xl' },
  }

  const { icon, text } = sizes[size]

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative">
        <div className="w-8 h-8 rounded-lg bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center">
          <Keyboard size={icon - 4} className="text-accent-primary" />
        </div>
        <div className="absolute inset-0 rounded-lg bg-accent-primary/10 blur-md" />
      </div>
      <span className={cn('font-display font-bold text-text-primary tracking-tight', text)}>
        Type<span className="text-accent-primary">Craft</span>
      </span>
    </div>
  )
}
