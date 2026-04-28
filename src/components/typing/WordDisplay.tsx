'use client'

import { useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface WordDisplayProps {
  words: string[]
  currentWordIndex: number
  currentCharIndex: number
  typedWords: string[]
  wordErrors: Set<number>
  charStatuses: Map<string, 'correct' | 'incorrect'>
  isActive: boolean
  isPaused: boolean
}

const VISIBLE_WORDS = 80 // Show this many words at a time

export function WordDisplay({
  words,
  currentWordIndex,
  currentCharIndex,
  typedWords,
  wordErrors,
  charStatuses,
  isActive,
  isPaused,
}: WordDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentWordRef = useRef<HTMLSpanElement>(null)

  // Scroll to keep current word visible
  useEffect(() => {
    if (currentWordRef.current && containerRef.current) {
      const container = containerRef.current
      const word = currentWordRef.current
      const wordTop = word.offsetTop
      const wordBottom = wordTop + word.offsetHeight
      const containerHeight = container.clientHeight
      const scrollTop = container.scrollTop

      if (wordTop < scrollTop + 40) {
        container.scrollTo({ top: wordTop - 40, behavior: 'smooth' })
      } else if (wordBottom > scrollTop + containerHeight - 40) {
        container.scrollTo({ top: wordBottom - containerHeight + 40, behavior: 'smooth' })
      }
    }
  }, [currentWordIndex])

  const displayWords = useMemo(() => {
    return words.slice(0, Math.max(VISIBLE_WORDS, currentWordIndex + 30))
  }, [words, currentWordIndex])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={cn(
          'glass-card rounded-2xl p-6 sm:p-8 transition-all duration-300',
          'max-h-44 overflow-hidden relative',
          isPaused && 'opacity-30 blur-sm'
        )}
        style={{ userSelect: 'none' }}
      >
        <div
          className="font-mono text-lg sm:text-xl leading-relaxed flex flex-wrap gap-x-3 gap-y-2"
          style={{ lineHeight: '2.4rem' }}
        >
          {displayWords.map((word, wordIdx) => {
            const isCurrent = wordIdx === currentWordIndex
            const isPast = wordIdx < currentWordIndex
            const typedWord = typedWords[wordIdx] || ''
            const hasError = wordErrors.has(wordIdx)

            return (
              <span
                key={wordIdx}
                ref={isCurrent ? currentWordRef : undefined}
                className={cn(
                  'relative inline-flex items-center',
                  isPast && hasError && 'underline decoration-red-500/60 decoration-wavy'
                )}
              >
                {word.split('').map((char, charIdx) => {
                  const key = `${wordIdx}-${charIdx}`
                  const status = charStatuses.get(key)
                  const isCursor = isCurrent && charIdx === currentCharIndex

                  let charClass = 'typing-char'
                  if (isCurrent) {
                    if (status === 'correct') charClass += ' correct'
                    else if (status === 'incorrect') charClass += ' incorrect'
                    else if (charIdx < currentCharIndex) charClass += ' incorrect'
                    else charClass += ' pending'
                  } else if (isPast) {
                    const pastStatus = charStatuses.get(key)
                    if (pastStatus === 'correct') charClass += ' correct'
                    else charClass += ' incorrect'
                  } else {
                    charClass += ' pending'
                  }

                  return (
                    <span key={charIdx} className="relative">
                      {isCursor && <span className="typing-cursor absolute -left-0.5" />}
                      <span className={charClass}>{char}</span>
                    </span>
                  )
                })}
                
                {/* Cursor at end of word */}
                {isCurrent && currentCharIndex >= word.length && (
                  <span className="typing-cursor" />
                )}

                {/* Extra typed chars beyond word length */}
                {isCurrent && typedWord.length > word.length && (
                  <span className="typing-char incorrect">
                    {typedWord.slice(word.length)}
                  </span>
                )}
              </span>
            )
          })}
        </div>

        {/* Fade gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg-card to-transparent pointer-events-none rounded-b-2xl" />
      </div>

      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-3xl mb-2">⏸</div>
            <p className="text-text-primary font-medium">Test paused</p>
            <p className="text-text-secondary text-sm">Switch back to this tab to resume</p>
          </motion.div>
        </div>
      )}

      {!isActive && !isPaused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-text-muted text-sm animate-pulse">Click here and start typing...</p>
        </div>
      )}
    </div>
  )
}
