'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Infinity, Medal, Zap, Target, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/cn'

interface LeaderboardEntry {
  user_id: string
  display_name: string
  wpm: number
  accuracy: number
  words_typed?: number
  created_at: string
}

interface LeaderboardClientProps {
  sixtyData: LeaderboardEntry[]
  infiniteData: LeaderboardEntry[]
  currentUserId: string
}

export function LeaderboardClient({ sixtyData, infiniteData, currentUserId }: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<'sixty' | 'infinite'>('sixty')
  
  const data = activeTab === 'sixty' ? sixtyData : infiniteData

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-2">
            Leaderboard
          </h1>
          <p className="text-text-secondary">The fastest typists in the world</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-bg-card rounded-xl p-1.5 max-w-xs mx-auto">
          {[
            { key: 'sixty', label: '60s Test', icon: Timer },
            { key: 'infinite', label: 'Infinite', icon: Infinity },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'sixty' | 'infinite')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === key
                  ? 'bg-accent-primary text-white shadow-glow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Top 3 podium */}
            {data.length >= 3 && (
              <div className="flex items-end justify-center gap-3 mb-8">
                {[data[1], data[0], data[2]].map((entry, i) => {
                  const rank = i === 0 ? 2 : i === 1 ? 1 : 3
                  const heights = ['h-24', 'h-32', 'h-20']
                  const medals = ['🥈', '🥇', '🥉']
                  const isMe = entry.user_id === currentUserId
                  
                  return (
                    <motion.div
                      key={entry.user_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex flex-col items-center gap-2 flex-1 max-w-36"
                    >
                      <div className="text-xl">{medals[i]}</div>
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                        isMe ? 'bg-accent-primary text-white' : 'bg-bg-elevated text-text-secondary'
                      )}>
                        {entry.display_name[0].toUpperCase()}
                      </div>
                      <span className="text-xs text-text-secondary truncate max-w-full">
                        {isMe ? 'You' : entry.display_name}
                      </span>
                      <div className={cn(
                        'w-full rounded-t-lg flex items-center justify-center',
                        heights[i],
                        rank === 1
                          ? 'bg-gradient-to-b from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20'
                          : rank === 2
                          ? 'bg-gradient-to-b from-zinc-400/20 to-zinc-400/5 border border-zinc-400/20'
                          : 'bg-gradient-to-b from-amber-700/20 to-amber-700/5 border border-amber-700/20'
                      )}>
                        <span className="font-mono font-bold text-text-primary">{entry.wpm}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Full table */}
            {data.length > 0 ? (
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
                  <Zap size={14} className="text-accent-primary" />
                  <span className="text-text-secondary text-sm font-medium">
                    {data.length} typists ranked
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-5 py-3 text-text-muted font-medium text-xs w-12">#</th>
                        <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Player</th>
                        <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">
                          <div className="flex items-center gap-1"><Zap size={11} /> WPM</div>
                        </th>
                        <th className="text-left px-4 py-3 text-text-muted font-medium text-xs hidden sm:table-cell">
                          <div className="flex items-center gap-1"><Target size={11} /> Accuracy</div>
                        </th>
                        <th className="text-left px-4 py-3 text-text-muted font-medium text-xs hidden md:table-cell">
                          <div className="flex items-center gap-1"><Calendar size={11} /> Date</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((entry, idx) => {
                        const isMe = entry.user_id === currentUserId
                        const rank = idx + 1
                        
                        return (
                          <motion.tr
                            key={`${entry.user_id}-${idx}`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className={cn(
                              'border-b border-white/4 last:border-0 transition-colors',
                              isMe
                                ? 'bg-accent-primary/5 border-accent-primary/10'
                                : 'hover:bg-white/2'
                            )}
                          >
                            <td className="px-5 py-3.5">
                              <RankBadge rank={rank} />
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                                  isMe ? 'bg-accent-primary text-white' : 'bg-bg-elevated text-text-secondary'
                                )}>
                                  {entry.display_name[0].toUpperCase()}
                                </div>
                                <span className={cn(
                                  'font-medium truncate max-w-28',
                                  isMe ? 'text-accent-primary' : 'text-text-primary'
                                )}>
                                  {isMe ? `${entry.display_name} (you)` : entry.display_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-mono font-bold text-text-primary">{entry.wpm}</span>
                              <span className="text-text-muted text-xs ml-1">wpm</span>
                            </td>
                            <td className="px-4 py-3.5 hidden sm:table-cell text-text-secondary">
                              {entry.accuracy}%
                            </td>
                            <td className="px-4 py-3.5 hidden md:table-cell text-text-muted text-xs">
                              {formatDate(entry.created_at)}
                            </td>
                          </motion.tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-16 text-center border border-white/5">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-text-primary font-display font-bold text-lg mb-2">
                  No entries yet
                </h3>
                <p className="text-text-secondary text-sm">Be the first to appear on this leaderboard!</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg">🥇</span>
  if (rank === 2) return <span className="text-lg">🥈</span>
  if (rank === 3) return <span className="text-lg">🥉</span>
  return <span className="text-text-muted font-mono text-sm">{rank}</span>
}
