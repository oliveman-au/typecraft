'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Timer, Infinity, Trophy, Zap, Target, TrendingUp, ArrowRight } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import type { UserProfile, TestResult } from '@/types'

interface DashboardClientProps {
  profile: UserProfile
  bestSixty: { wpm: number; accuracy: number; created_at: string } | null
  bestInfinite: { wpm: number; accuracy: number; created_at: string } | null
  recentResults: TestResult[]
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

export function DashboardClient({ profile, bestSixty, bestInfinite, recentResults }: DashboardClientProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        
        {/* Header */}
        <motion.div variants={item}>
          <p className="text-text-muted text-sm mb-1">{greeting},</p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary">
            {profile.display_name} <span className="text-accent-primary">👋</span>
          </h1>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/practice" className="group">
            <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-accent-primary/20 transition-all duration-300 hover:shadow-glow-sm cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-accent-primary/15 flex items-center justify-center">
                  <Infinity size={22} className="text-accent-primary" />
                </div>
                <ArrowRight size={16} className="text-text-muted group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-lg font-display font-bold text-text-primary mb-1">Infinite Practice</h3>
              <p className="text-text-secondary text-sm">Type endlessly, improve naturally</p>
            </div>
          </Link>
          
          <Link href="/test" className="group">
            <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-accent-primary/20 transition-all duration-300 hover:shadow-glow-sm cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-accent-primary/15 flex items-center justify-center">
                  <Timer size={22} className="text-accent-primary" />
                </div>
                <ArrowRight size={16} className="text-text-muted group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-lg font-display font-bold text-text-primary mb-1">60s Speed Test</h3>
              <p className="text-text-secondary text-sm">Race the clock, top the boards</p>
            </div>
          </Link>
        </motion.div>

        {/* Personal bests */}
        <motion.div variants={item}>
          <h2 className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-4">Personal Bests</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={<Zap size={16} />}
              label="Best WPM (60s)"
              value={bestSixty ? `${bestSixty.wpm}` : '—'}
              unit="wpm"
              sub={bestSixty ? formatDate(bestSixty.created_at) : 'No tests yet'}
            />
            <StatCard
              icon={<Target size={16} />}
              label="Accuracy (60s)"
              value={bestSixty ? `${bestSixty.accuracy}` : '—'}
              unit="%"
              sub="best run"
            />
            <StatCard
              icon={<Infinity size={16} />}
              label="Best WPM (∞)"
              value={bestInfinite ? `${bestInfinite.wpm}` : '—'}
              unit="wpm"
              sub={bestInfinite ? formatDate(bestInfinite.created_at) : 'No sessions yet'}
            />
            <StatCard
              icon={<TrendingUp size={16} />}
              label="Tests taken"
              value={`${recentResults.length}`}
              unit="total"
              sub="keep going"
            />
          </div>
        </motion.div>

        {/* Recent results */}
        {recentResults.length > 0 && (
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-text-secondary text-sm font-medium uppercase tracking-wider">Recent Activity</h2>
              <Link href="/leaderboard" className="text-xs text-accent-primary hover:opacity-80 transition-opacity flex items-center gap-1">
                <Trophy size={12} />
                Leaderboard
              </Link>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-text-muted font-medium text-xs">Mode</th>
                    <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">WPM</th>
                    <th className="text-left px-4 py-3 text-text-muted font-medium text-xs hidden sm:table-cell">Accuracy</th>
                    <th className="text-left px-4 py-3 text-text-muted font-medium text-xs hidden sm:table-cell">Duration</th>
                    <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResults.map((result, i) => (
                    <tr
                      key={result.id}
                      className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                          result.mode === 'sixty'
                            ? 'bg-accent-primary/10 text-accent-primary'
                            : 'bg-green-500/10 text-green-400'
                        }`}>
                          {result.mode === 'sixty' ? <Timer size={10} /> : <Infinity size={10} />}
                          {result.mode === 'sixty' ? '60s' : '∞'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-text-primary">{result.wpm}</span>
                        <span className="text-text-muted text-xs ml-1">wpm</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-text-secondary">
                        {result.accuracy}%
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-text-secondary">
                        {formatTime(result.duration_seconds)}
                      </td>
                      <td className="px-4 py-3 text-text-muted text-xs">
                        {formatDate(result.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {recentResults.length === 0 && (
          <motion.div variants={item} className="glass-card rounded-2xl p-12 text-center border border-white/5">
            <div className="text-4xl mb-4">⌨️</div>
            <h3 className="text-text-primary font-display font-bold text-lg mb-2">No tests yet</h3>
            <p className="text-text-secondary text-sm">Start a practice session or speed test to see your results here</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function StatCard({
  icon, label, value, unit, sub
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  sub: string
}) {
  return (
    <div className="glass-card rounded-xl p-4 stat-card-glow border border-white/4">
      <div className="flex items-center gap-1.5 text-text-muted mb-3 text-xs">
        <span className="text-accent-primary">{icon}</span>
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-display font-bold text-text-primary">{value}</span>
        {value !== '—' && <span className="text-text-muted text-xs">{unit}</span>}
      </div>
      <p className="text-text-muted text-xs mt-1">{sub}</p>
    </div>
  )
}
