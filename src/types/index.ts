export type TestMode = 'infinite' | 'sixty'

export interface UserProfile {
  id: string
  email: string
  display_name: string
  date_of_birth: string
  avatar_url?: string
  created_at: string
}

export interface TestResult {
  id: string
  user_id: string
  mode: TestMode
  wpm: number
  accuracy: number
  words_typed: number
  duration_seconds: number
  created_at: string
  user?: UserProfile
}

export interface LeaderboardEntry {
  id: string
  user_id: string
  display_name: string
  wpm: number
  accuracy: number
  words_typed: number
  created_at: string
}

export interface TypingState {
  words: string[]
  currentWordIndex: number
  currentCharIndex: number
  typedWords: string[]
  currentInput: string
  errors: Set<string> // "wordIndex-charIndex"
  startTime: number | null
  endTime: number | null
  isActive: boolean
  isPaused: boolean
  wpm: number
  accuracy: number
  totalTyped: number
  totalErrors: number
}

export interface CharState {
  char: string
  status: 'pending' | 'correct' | 'incorrect' | 'active'
}
