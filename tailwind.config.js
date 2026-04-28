/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['var(--font-display)', 'Syne', 'sans-serif'],
        body: ['var(--font-body)', 'DM Sans', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#0f0f17',
          card: '#13131e',
          elevated: '#1a1a28',
        },
        accent: {
          primary: '#7c6cfc',
          secondary: '#5b4fd4',
          glow: 'rgba(124, 108, 252, 0.3)',
        },
        text: {
          primary: '#e8e8f0',
          secondary: '#8888a8',
          muted: '#55556a',
        },
        typing: {
          correct: '#4ade80',
          error: '#f87171',
          cursor: '#7c6cfc',
          pending: '#55556a',
          active: '#e8e8f0',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'cursor-blink': 'cursorBlink 1s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 108, 252, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 108, 252, 0.5)' },
        },
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(124, 108, 252, 0.2)',
        'glow-md': '0 0 30px rgba(124, 108, 252, 0.3)',
        'glow-lg': '0 0 60px rgba(124, 108, 252, 0.4)',
      },
    },
  },
  plugins: [],
}
