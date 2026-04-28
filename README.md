# TypeCraft ⌨️

A modern, production-ready typing speed test web app built with Next.js 14, Supabase, and Framer Motion.

## Features

- 🔐 **Authentication** — Email/password + Google OAuth
- ⌨️ **Infinite Practice Mode** — Endless typing with real-time WPM & accuracy
- ⏱ **60-Second Test** — Timed speed test saved to leaderboard
- 🏆 **Leaderboards** — Separate boards for both modes, real-time from database
- 🎨 **Beautiful UI** — Dark mode, smooth animations, responsive design
- ⏸ **Smart Pause** — Auto-pauses when you switch tabs
- 📊 **Progress Tracking** — Personal bests, test history, stat dashboard

---

## Quick Start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works great)

---

### 1. Clone & Install

```bash
git clone <your-repo>
cd typecraft
npm install
```

---

### 2. Set Up Supabase

#### 2a. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose a name, database password, and region
4. Wait for provisioning (~2 minutes)

#### 2b. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run**

This creates:
- `profiles` table (user data)
- `test_results` table (typing test scores)
- `leaderboard_sixty` view (best WPM in 60s tests)
- `leaderboard_infinite` view (best WPM in infinite mode, min 50 words)
- Row Level Security policies

#### 2c. Enable Google OAuth (optional)

1. In Supabase dashboard → **Authentication** → **Providers**
2. Enable **Google**
3. Go to [Google Cloud Console](https://console.cloud.google.com)
4. Create a project → Enable Google+ API
5. Create OAuth 2.0 credentials
6. Set authorized redirect URI to:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
7. Copy Client ID and Client Secret back to Supabase

---

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find these in Supabase: **Settings** → **API**

---

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B: Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL)
5. Click **Deploy**

### After Deploying

Update the OAuth redirect URLs in Supabase:

**Authentication → URL Configuration:**
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/auth/callback`

---

## Project Structure

```
typecraft/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/
│   │   │   ├── login/          # Login page
│   │   │   ├── signup/         # Signup page
│   │   │   ├── onboarding/     # New user profile setup
│   │   │   └── callback/       # OAuth callback handler
│   │   ├── dashboard/          # User dashboard
│   │   ├── practice/           # Infinite mode
│   │   ├── test/               # 60-second test
│   │   └── leaderboard/        # Leaderboards
│   │
│   ├── components/
│   │   ├── auth/               # AuthForm component
│   │   ├── layout/             # NavBar, DashboardClient, LeaderboardClient
│   │   ├── typing/             # TypingTest, WordDisplay, StatsBar, TestResults
│   │   └── ui/                 # Button, Input, Logo
│   │
│   ├── hooks/
│   │   └── useTypingEngine.ts  # Core typing logic
│   │
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── words.ts            # 100+ sentences dataset
│   │   ├── utils.ts            # WPM/accuracy calculations
│   │   └── cn.ts               # className utility
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   │
│   └── middleware.ts           # Auth route protection
│
├── supabase/
│   └── schema.sql              # Full database schema
│
├── public/
├── .env.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## How the Typing Engine Works

The core typing logic lives in `src/hooks/useTypingEngine.ts`:

1. **Word list** is built from shuffled sentences (infinite) or a fixed pool (60s)
2. **Input handling** captures keystrokes via a hidden `<input>` element
3. **WPM** is calculated as: `(correctChars / 5) / minutes`
4. **Accuracy** is calculated as: `(totalTyped - errors) / totalTyped * 100`
5. **Tab visibility** is monitored to auto-pause/resume
6. **Results** are saved to Supabase after each test

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Restart current test |
| `Esc` | End test (shows results) |
| `Space` | Advance to next word |
| `Backspace` | Fix errors or go back to previous word |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Auth & DB | Supabase |
| Fonts | Syne (display), DM Sans (body), JetBrains Mono |
| Deployment | Vercel |

---

## Customization

### Adding More Text Content

Edit `src/lib/words.ts` — add sentences to the `sentences` array. The engine will automatically include them in rotation.

### Changing Test Duration

The 60-second mode is hardcoded to 60s. To change it, update `useTypingEngine.ts`:
```ts
const remaining = 60 - totalElapsed  // Change 60 to desired seconds
setTimeLeft(60)  // Update initial value too
```

### Leaderboard Minimum Words

The infinite mode leaderboard requires ≥50 words. Update in `supabase/schema.sql`:
```sql
AND tr.words_typed >= 50  -- Change this threshold
```

---

## Troubleshooting

**"relation does not exist" errors**
→ Make sure you've run the full `supabase/schema.sql` in the SQL editor

**Google login not working**
→ Check that your redirect URL in Google Console matches exactly what's in Supabase

**Leaderboard empty**
→ The views require the `GRANT SELECT` statements — re-run the schema

**WPM shows 0**
→ You need to complete at least a few words before the calculation kicks in

---

## License

MIT
