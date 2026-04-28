'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Calendar } from 'lucide-react'

export default function OnboardingPage() {
  const [displayName, setDisplayName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!displayName.trim()) {
      setError('Please enter a display name')
      return
    }
    
    if (!dateOfBirth) {
      setError('Please enter your date of birth')
      return
    }
    
    setLoading(true)
    setError(null)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('Not authenticated. Please sign in again.')
      setLoading(false)
      return
    }
    
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email!,
        display_name: displayName.trim(),
        date_of_birth: dateOfBirth,
        avatar_url: user.user_metadata?.avatar_url || null,
      })
    
    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }
    
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Logo size="lg" className="justify-center mb-6" />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-medium mb-4">
            ✨ One last step
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            Set up your profile
          </h1>
          <p className="text-text-secondary">
            Tell us a bit about yourself to get started
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Display Name"
              placeholder="e.g. SpeedTyper99"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              icon={<User size={16} />}
              maxLength={30}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full bg-bg-elevated border border-white/8 rounded-xl px-4 py-3 pl-10 text-text-primary text-sm focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all [color-scheme:dark]"
                />
              </div>
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
              className="w-full"
            >
              Start Typing →
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
