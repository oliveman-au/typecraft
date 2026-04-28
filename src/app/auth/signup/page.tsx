'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { AuthForm } from '@/components/auth/AuthForm'
import { Logo } from '@/components/ui/Logo'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailSignup = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    
    // Redirect to onboarding
    router.push('/auth/onboarding')
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) {
      setError(error.message)
      setLoading(false)
    }
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
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            Join TypeCraft
          </h1>
          <p className="text-text-secondary">
            Create an account to start tracking your speed
          </p>
        </div>

        <AuthForm
          mode="signup"
          onEmailSubmit={handleEmailSignup}
          onGoogleSubmit={handleGoogleSignup}
          error={error}
          loading={loading}
        />

        <p className="text-center mt-6 text-text-secondary text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-accent-primary hover:text-accent-primary/80 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
