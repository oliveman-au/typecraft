'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { calculateWPM, calculateAccuracy } from '@/lib/utils'
import { buildInfiniteWordList, buildWordList } from '@/lib/words'
import type { TestMode } from '@/types'

interface UseTypingEngineOptions {
  mode: TestMode
  onComplete?: (result: {
    wpm: number
    accuracy: number
    wordsTyped: number
    duration: number
  }) => void
}

export function useTypingEngine({ mode, onComplete }: UseTypingEngineOptions) {
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [typedWords, setTypedWords] = useState<string[]>([''])
  const [currentInput, setCurrentInput] = useState('')
  const [wordErrors, setWordErrors] = useState<Set<number>>(new Set())
  const [charStatuses, setCharStatuses] = useState<Map<string, 'correct' | 'incorrect'>>(new Map())

  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const [elapsedTime, setElapsedTime] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)

  // Refs for values we need in callbacks without stale closures
  const wordsRef = useRef<string[]>([])
  const typedWordsRef = useRef<string[]>([''])
  const currentWordIndexRef = useRef(0)
  const totalTypedRef = useRef(0)
  const totalErrorsRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const sessionStartRef = useRef<number | null>(null)
  const accumulatedTimeRef = useRef(0) // ms paused before current session
  const isFinishedRef = useRef(false)
  const isPausedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const getTotalElapsedMs = useCallback(() => {
    const sessionMs = sessionStartRef.current ? Date.now() - sessionStartRef.current : 0
    return accumulatedTimeRef.current + sessionMs
  }, [])

  const initWords = useCallback(() => {
    const wordList = mode === 'infinite' ? buildInfiniteWordList() : buildWordList(250)
    wordsRef.current = wordList
    typedWordsRef.current = ['']
    currentWordIndexRef.current = 0
    totalTypedRef.current = 0
    totalErrorsRef.current = 0
    sessionStartRef.current = null
    accumulatedTimeRef.current = 0
    isFinishedRef.current = false
    isPausedRef.current = false

    setWords(wordList)
    setCurrentWordIndex(0)
    setCurrentCharIndex(0)
    setTypedWords([''])
    setCurrentInput('')
    setWordErrors(new Set())
    setCharStatuses(new Map())
    setIsActive(false)
    setIsPaused(false)
    setIsFinished(false)
    setElapsedTime(0)
    setTimeLeft(60)
    setWpm(0)
    setAccuracy(100)

    if (timerRef.current) clearInterval(timerRef.current)
  }, [mode])

  useEffect(() => {
    initWords()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [initWords])

  // Tab visibility — auto pause/resume
  useEffect(() => {
    const handleVisibility = () => {
      if (isFinishedRef.current) return

      if (document.hidden && !isPausedRef.current && sessionStartRef.current !== null) {
        // Pause
        isPausedRef.current = true
        setIsPaused(true)
        accumulatedTimeRef.current += Date.now() - (sessionStartRef.current ?? Date.now())
        sessionStartRef.current = null
        if (timerRef.current) clearInterval(timerRef.current)
      } else if (!document.hidden && isPausedRef.current && sessionStartRef.current === null) {
        // Resume
        isPausedRef.current = false
        setIsPaused(false)
        sessionStartRef.current = Date.now()
        startInterval()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const computeResults = useCallback(() => {
    const totalMs = getTotalElapsedMs()
    const duration = Math.max(1, Math.round(totalMs / 1000))
    const typed = typedWordsRef.current
    const expected = wordsRef.current

    let correctChars = 0
    let completedWords = 0
    typed.forEach((tw, i) => {
      if (i >= expected.length) return
      const ew = expected[i]
      if (tw === ew) {
        completedWords++
        correctChars += tw.length + 1 // +1 for space
      } else {
        for (let j = 0; j < Math.min(tw.length, ew.length); j++) {
          if (tw[j] === ew[j]) correctChars++
        }
      }
    })

    const finalWpm = calculateWPM(correctChars, duration)
    const finalAcc = calculateAccuracy(totalTypedRef.current, totalErrorsRef.current)
    return { wpm: finalWpm, accuracy: finalAcc, wordsTyped: completedWords, duration }
  }, [getTotalElapsedMs])

  const finishTest = useCallback(() => {
    if (isFinishedRef.current) return
    isFinishedRef.current = true

    if (timerRef.current) clearInterval(timerRef.current)
    // Capture remaining session time
    if (sessionStartRef.current) {
      accumulatedTimeRef.current += Date.now() - sessionStartRef.current
      sessionStartRef.current = null
    }

    const result = computeResults()
    setIsActive(false)
    setIsFinished(true)
    setWpm(result.wpm)
    setAccuracy(result.accuracy)

    onCompleteRef.current?.(result)
  }, [computeResults])

  const startInterval = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      if (isFinishedRef.current || isPausedRef.current) return

      const totalMs = getTotalElapsedMs()
      const totalSec = Math.floor(totalMs / 1000)
      setElapsedTime(totalSec)

      if (mode === 'sixty') {
        const remaining = 60 - totalSec
        setTimeLeft(Math.max(0, remaining))
        if (remaining <= 0) {
          finishTest()
          return
        }
      }

      // Update live WPM/accuracy
      const result = computeResults()
      if (result.wpm > 0) setWpm(result.wpm)
      setAccuracy(calculateAccuracy(totalTypedRef.current, totalErrorsRef.current))
    }, 200)
  }, [mode, getTotalElapsedMs, computeResults, finishTest])

  const startTest = useCallback(() => {
    sessionStartRef.current = Date.now()
    setIsActive(true)
    startInterval()
  }, [startInterval])

  const handleInput = useCallback((value: string, prevValue: string) => {
    if (isFinishedRef.current || isPausedRef.current) return

    // Start timer on first character
    if (sessionStartRef.current === null && value.length > 0) {
      startTest()
    }

    const wordIdx = currentWordIndexRef.current
    const expectedWord = wordsRef.current[wordIdx] ?? ''

    // Space = advance to next word
    if (value.endsWith(' ')) {
      const typed = value.trimEnd()
      if (typed.length === 0) return

      totalTypedRef.current += typed.length + 1

      // Count errors for this word
      const maxLen = Math.max(typed.length, expectedWord.length)
      let errs = 0
      for (let i = 0; i < maxLen; i++) {
        if (typed[i] !== expectedWord[i]) errs++
      }
      totalErrorsRef.current += errs

      if (typed !== expectedWord) {
        setWordErrors(prev => new Set([...prev, wordIdx]))
      }

      const nextIdx = wordIdx + 1
      currentWordIndexRef.current = nextIdx
      typedWordsRef.current = [...typedWordsRef.current]
      typedWordsRef.current[wordIdx] = typed
      typedWordsRef.current[nextIdx] = ''

      setCurrentWordIndex(nextIdx)
      setCurrentCharIndex(0)
      setCurrentInput('')
      setTypedWords([...typedWordsRef.current])

      // Extend word pool for infinite mode
      if (mode === 'infinite' && nextIdx > wordsRef.current.length - 80) {
        const extra = buildInfiniteWordList().slice(0, 150)
        wordsRef.current = [...wordsRef.current, ...extra]
        setWords([...wordsRef.current])
      }
      return
    }

    // Backspace past start of current word — go back to previous word
    if (value.length === 0 && prevValue.length === 0 && wordIdx > 0) {
      const prevIdx = wordIdx - 1
      const prevTyped = typedWordsRef.current[prevIdx] ?? ''
      currentWordIndexRef.current = prevIdx
      typedWordsRef.current[wordIdx] = ''
      setCurrentWordIndex(prevIdx)
      setCurrentCharIndex(prevTyped.length)
      setCurrentInput(prevTyped)
      setTypedWords([...typedWordsRef.current])
      return
    }

    // Regular character input
    setCurrentInput(value)
    setCurrentCharIndex(value.length)
    typedWordsRef.current[wordIdx] = value
    setTypedWords([...typedWordsRef.current])

    // Track individual char status and errors
    if (value.length > prevValue.length) {
      const charIdx = value.length - 1
      const isCorrect = value[charIdx] === expectedWord[charIdx]
      const key = `${wordIdx}-${charIdx}`
      totalTypedRef.current += 1
      if (!isCorrect) totalErrorsRef.current += 1
      setCharStatuses(prev => new Map(prev).set(key, isCorrect ? 'correct' : 'incorrect'))
    } else if (value.length < prevValue.length) {
      // Backspace — remove char status
      const key = `${wordIdx}-${value.length}`
      setCharStatuses(prev => {
        const next = new Map(prev)
        next.delete(key)
        return next
      })
    }
  }, [startTest, mode])

  const handleKeyDown = useCallback((e: KeyboardEvent | React.KeyboardEvent) => {
    if (isFinishedRef.current) return
    if (e.key === 'Tab') {
      e.preventDefault()
      initWords()
      return
    }
    if (e.key === 'Escape' && sessionStartRef.current !== null) {
      finishTest()
    }
  }, [initWords, finishTest])

  const endTest = useCallback(() => {
    if (sessionStartRef.current !== null || accumulatedTimeRef.current > 0) {
      finishTest()
    }
  }, [finishTest])

  const reset = useCallback(() => {
    initWords()
  }, [initWords])

  return {
    words,
    currentWordIndex,
    currentCharIndex,
    typedWords,
    currentInput,
    wordErrors,
    charStatuses,
    isActive,
    isPaused,
    isFinished,
    elapsedTime,
    timeLeft,
    wpm,
    accuracy,
    handleInput,
    handleKeyDown,
    endTest,
    reset,
    setIsPaused,
  }
}
