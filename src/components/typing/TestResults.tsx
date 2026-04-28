'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { RotateCcw, Trophy, Zap, Target, Timer, Hash } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatTime } from '@/lib/utils'
import type { TestMode } from '@/types'

interface TestResultsProps {
  mode: TestMode
  wpm: number
  accuracy: number
  wordsTyped: number
  duration: number
  onReset: () => void
}

const grades = [
  { min: 120, label: 'Legendary', emoji: '🔥', color: 'text-orange-400' },
  { min: 100, label: 'Elite', emoji: '⚡', color: 'text-yellow-400' },
  { min: 80, label: 'Advanced', emoji: '🚀', color: 'text-purple-400' },
  { min: 60, label: 'Proficient', emoji: '💪', color: 'text-accent-primary' },
  { min: 40, label: 'Average', emoji: '👍', color: 'text-blue-400' },
  { min: 0, label: 'Beginner', emoji: '🌱', color: 'text-green-400' },
]

function getGrade(wpm: number) {
  return grades.find(g => wpm >= g.min) || grades[grades.length - 1]
}

export function TestResults({ mode, wpm, accuracy, wordsTyped, duration, onReset }: TestResultsProps) {
  const grade = getGrade(wpm)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Grade */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
          className="text-6xl mb-3"
        >
          {grade.emoji}
        </motion.div>
        <h2 className={`text-3xl font-display font-bold mb-1 ${grade.color}`}>
          {grade.label}
        </h2>
        <p className="text-text-secondary text-sm">
          {mode === 'sixty' ? '60-second test complete' : 'Practice session ended'}
        </p>
      </div>

      {/* Main WPM */}
      <div className="glass-card rounded-2xl p-8 text-center mb-4 border border-white/5 shadow-glow-sm">
        <div className="flex items-end justify-center gap-2 mb-1">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-mono font-bold text-7xl text-accent-primary tabular-nums"
          >
            {wpm}
          </motion.span>
          <span className="text-text-muted text-xl mb-3">WPM</span>
        </div>
        <p className="text-text-muted text-sm">words per minute</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard
          icon={<Target size={16} className="text-green-400" />}
          label="Accuracy"
          value={`${accuracy}%`}
          color={accuracy >= 95 ? '#4ade80' : accuracy >= 85 ? '#facc15' : '#f87171'}
        />
        <StatCard
          icon={<Hash size={16} className="text-blue-400" />}
          label="Words Typed"
          value={`${wordsTyped}`}
        />
        <StatCard
          icon={<Timer size={16} className="text-purple-400" />}
          label="Duration"
          value={formatTime(duration)}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={onReset}
          className="flex-1"
        >
          <RotateCcw size={15} />
          Try Again
        </Button>
        <Link href="/leaderboard" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            <Trophy size={15} />
            Leaderboard
          </Button>
        </Link>
      </div>

      <p className="text-center text-text-muted text-xs mt-4">
        Press Tab to restart
      </p>
    </motion.div>
  )
}

function StatCard({
  icon, label, value, color
}: {
  icon: React.ReactNode
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="glass-card rounded-xl p-4 border border-white/4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="font-mono font-bold text-xl" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="text-text-muted text-xs mt-0.5">{label}</div>
    </div>
  )
}
