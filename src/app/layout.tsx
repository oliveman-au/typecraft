import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TypeCraft — Master Your Typing Speed',
  description: 'A modern, beautiful typing speed test. Track your WPM, compete on leaderboards, and improve your typing skills.',
  keywords: ['typing test', 'wpm', 'typing speed', 'leaderboard', 'typing practice'],
  openGraph: {
    title: 'TypeCraft',
    description: 'Master Your Typing Speed',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="mesh-bg noise-overlay antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
