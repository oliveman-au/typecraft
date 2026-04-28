/**
 * Calculate WPM: standard definition — 5 characters = 1 word
 */
export function calculateWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctChars <= 0) return 0
  const minutes = elapsedSeconds / 60
  const words = correctChars / 5
  return Math.round(words / minutes)
}

/**
 * Calculate accuracy as percentage of correct keystrokes
 */
export function calculateAccuracy(totalTyped: number, totalErrors: number): number {
  if (totalTyped === 0) return 100
  const correct = Math.max(0, totalTyped - totalErrors)
  return Math.round((correct / totalTyped) * 100)
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
