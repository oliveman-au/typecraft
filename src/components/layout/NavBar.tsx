'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Keyboard, Trophy, LayoutDashboard, Timer, LogOut, Infinity } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/cn'
import type { UserProfile } from '@/types'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/practice', label: 'Practice', icon: Infinity },
  { href: '/test', label: '60s Test', icon: Timer },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

export function NavBar({ profile }: { profile: UserProfile }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Logo size="sm" />
        
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  active
                    ? 'text-accent-primary bg-accent-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                )}
              >
                <Icon size={14} />
                {label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg border border-accent-primary/20 bg-accent-primary/5"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center text-xs font-bold text-accent-primary">
              {profile.display_name[0].toUpperCase()}
            </div>
            <span className="text-sm text-text-secondary font-medium">
              {profile.display_name}
            </span>
          </div>
          
          <button
            onClick={handleSignOut}
            className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
      
      {/* Mobile nav */}
      <div className="sm:hidden border-t border-white/5 flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors',
                active ? 'text-accent-primary' : 'text-text-muted'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}
