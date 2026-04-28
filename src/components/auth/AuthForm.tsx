'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface AuthFormProps {
  mode: 'login' | 'signup'
  onEmailSubmit: (email: string, password: string) => void
  onGoogleSubmit: () => void
  error?: string | null
  loading?: boolean
}

export function AuthForm({ mode, onEmailSubmit, onGoogleSubmit, error, loading }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEmailSubmit(email, password)
  }

  return (
    <div className="glass-card rounded-2xl p-8 space-y-6">
      {/* Google OAuth */}
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={onGoogleSubmit}
        disabled={loading}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
          <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
          <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
          <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
        </svg>
        Continue with Google
      </Button>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-text-muted text-xs">or</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Email form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          icon={<Mail size={16} />}
          required
          autoComplete="email"
        />
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            icon={<Lock size={16} />}
            required
            minLength={mode === 'signup' ? 8 : undefined}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-text-muted hover:text-text-secondary transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full mt-2"
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </div>
  )
}
