'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Square, Play, Pause } from 'lucide-react'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { createClient } from '@/lib/supabase'
import { StatsBar } from './StatsBar'
import { WordDisplay } from './WordDisplay'
import { TestResults } from './TestResults'
import { Button } from '@/components/ui/Button'
import type { TestMode } from '@/types'

interface TypingTestProps {
  mode: TestMode
  userId: string
}

export function TypingTest({ mode, userId }: TypingTestProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [savedResult, setSavedResult] = useState<{
    wpm: number
    accuracy: number
    wordsTyped: number
    duration: number
  } | null>(null)
  const supabase = createClient()

  const handleComplete = useCallback(async (result: {
    wpm: number
    accuracy: number
    wordsTyped: number
    duration: number
  }) => {
    setSavedResult(result)
    setSaving(true)

    try {
      // Only save if meaningful (>5 words typed)
      if (result.wordsTyped < 5) return

      await supabase.from('test_results').insert({
        user_id: userId,
        mode,
        wpm: result.wpm,
        accuracy: result.accuracy,
        words_typed: result.wordsTyped,
        duration_seconds: result.duration,
      })
    } catch (err) {
      console.error('Failed to save result:', err)
    } finally {
      setSaving(false)
    }
  }, [mode, userId, supabase])

  const engine = useTypingEngine({ mode, onComplete: handleComplete })

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    focusInput()
  }, [focusInput])

  const handleReset = () => {
    setSavedResult(null)
    engine.reset()
    setTimeout(focusInput, 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    engine.handleInput(value, engine.currentInput)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-5xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {engine.isFinished && savedResult ? (
          <TestResults
            key="results"
            mode={mode}
            wpm={savedResult.wpm}
            accuracy={savedResult.accuracy}
            wordsTyped={savedResult.wordsTyped}
            duration={savedResult.duration}
            onReset={handleReset}
          />
        ) : (
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full space-y-6"
          >
            {/* Mode badge & timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-medium">
                  {mode === 'infinite' ? '∞ Infinite Practice' : '⏱ 60-Second Test'}
                </span>
                {engine.isPaused && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Pause size={10} />
                    Paused (tab inactive)
                  </motion.span>
                )}
              </div>
              
              {mode === 'sixty' && (
                <div className={`font-mono text-2xl font-bold tabular-nums transition-colors ${
                  engine.timeLeft <= 10 ? 'text-red-400' : 'text-text-primary'
                }`}>
                  {engine.timeLeft}s
                </div>
              )}
            </div>

            {/* Stats */}
            <StatsBar
              wpm={engine.wpm}
              accuracy={engine.accuracy}
              elapsedTime={engine.elapsedTime}
              mode={mode}
            />

            {/* Word display - clickable to focus */}
            <div
              onClick={focusInput}
              className="cursor-text"
            >
              <WordDisplay
                words={engine.words}
                currentWordIndex={engine.currentWordIndex}
                currentCharIndex={engine.currentCharIndex}
                typedWords={engine.typedWords}
                wordErrors={engine.wordErrors}
                charStatuses={engine.charStatuses}
                isActive={engine.isActive}
                isPaused={engine.isPaused}
              />
            </div>

            {/* Hidden input */}
            <input
              ref={inputRef}
              value={engine.currentInput}
              onChange={handleInputChange}
              onKeyDown={engine.handleKeyDown as (e: React.KeyboardEvent<HTMLInputElement>) => void}
              className="typing-input-hidden"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Typing input"
            />

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-text-muted"
                >
                  <RotateCcw size={13} />
                  Restart
                </Button>
                
                {engine.isActive && mode === 'infinite' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={engine.endTest}
                  >
                    <Square size={12} />
                    End Test
                  </Button>
                )}
              </div>
              
              <p className="text-text-muted text-xs">
                {!engine.isActive ? 'Start typing to begin' : ''}
                {engine.isPaused ? 'Switch back to resume' : ''}
              </p>
              
              <p className="text-text-muted text-xs hidden sm:block">
                Tab to restart · Esc to end
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
