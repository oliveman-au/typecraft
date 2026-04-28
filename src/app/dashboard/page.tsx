import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { DashboardClient } from '@/components/layout/DashboardClient'

export default async function DashboardPage() {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (!profile) {
    redirect('/auth/onboarding')
  }
  
  // Get user's best results
  const { data: bestSixty } = await supabase
    .from('test_results')
    .select('wpm, accuracy, created_at')
    .eq('user_id', user.id)
    .eq('mode', 'sixty')
    .order('wpm', { ascending: false })
    .limit(1)
    .single()
  
  const { data: bestInfinite } = await supabase
    .from('test_results')
    .select('wpm, accuracy, created_at')
    .eq('user_id', user.id)
    .eq('mode', 'infinite')
    .order('wpm', { ascending: false })
    .limit(1)
    .single()
  
  const { data: recentResults } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)
  
  return (
    <DashboardClient
      profile={profile}
      bestSixty={bestSixty}
      bestInfinite={bestInfinite}
      recentResults={recentResults || []}
    />
  )
}
