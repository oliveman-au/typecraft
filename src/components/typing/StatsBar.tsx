'use client'

import { motion } from 'framer-motion'
import { Zap, Target, Clock } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import type { TestMode } from '@/types'

interface StatsBarProps {
  wpm: number
  accuracy: number
  elapsedTime: number
  mode: TestMode
}

export function StatsBar({ wpm, accuracy, elapsedTime, mode }: StatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatItem
        icon={<Zap size={14} className="text-accent-primary" />}
        label="WPM"
        value={wpm.toString()}
        highlight
      />
      <StatItem
        icon={<Target size={14} className="text-green-400" />}
        label="Accuracy"
        value={`${accuracy}%`}
        color={accuracy >= 95 ? 'green' : accuracy >= 85 ? 'yellow' : 'red'}
      />
      <StatItem
        icon={<Clock size={14} className="text-blue-400" />}
        label={mode === 'infinite' ? 'Elapsed' : 'Time'}
        value={formatTime(elapsedTime)}
      />
    </div>
  )
}

function StatItem({
  icon,
  label,
  value,
  highlight,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
  color?: 'green' | 'yellow' | 'red'
}) {
  const textColor = color === 'green' ? 'text-green-400' : color === 'yellow' ? 'text-yellow-400' : color === 'red' ? 'text-red-400' : undefined

  return (
    <div className="glass-card rounded-xl px-4 py-3 border border-white/4">
      <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1">
        {icon}
        {label}
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0.6, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className={`font-mono font-bold text-xl tabular-nums ${
          textColor || (highlight ? 'text-accent-primary' : 'text-text-primary')
        }`}
      >
        {value}
      </motion.div>
    </div>
  )
}
