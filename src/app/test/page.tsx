import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import { TypingTest } from '@/components/typing/TypingTest'
import { NavBar } from '@/components/layout/NavBar'

export default async function TestPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/auth/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (!profile) redirect('/auth/onboarding')
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar profile={profile} />
      <main className="flex-1 flex flex-col">
        <TypingTest mode="sixty" userId={user.id} />
      </main>
    </div>
  )
}
