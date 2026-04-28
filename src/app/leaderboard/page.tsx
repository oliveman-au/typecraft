import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import { LeaderboardClient } from '@/components/layout/LeaderboardClient'
import { NavBar } from '@/components/layout/NavBar'

export default async function LeaderboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/auth/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (!profile) redirect('/auth/onboarding')
  
  // Fetch leaderboards
  const { data: sixtyLeaderboard } = await supabase
    .from('leaderboard_sixty')
    .select('*')
    .limit(50)
  
  const { data: infiniteLeaderboard } = await supabase
    .from('leaderboard_infinite')
    .select('*')
    .limit(50)
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar profile={profile} />
      <main className="flex-1">
        <LeaderboardClient
          sixtyData={sixtyLeaderboard || []}
          infiniteData={infiniteLeaderboard || []}
          currentUserId={user.id}
        />
      </main>
    </div>
  )
}
