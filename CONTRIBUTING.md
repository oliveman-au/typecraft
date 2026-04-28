# Contributing to TypeCraft

Thanks for your interest in contributing! This project is open to suggestions, bug fixes, and improvements.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/typecraft`
3. Follow the setup instructions in [README.md](./README.md)
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## What to Contribute

### 🐛 Bug Reports
Open a GitHub Issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser/OS info

### ✨ Feature Ideas
Open a GitHub Issue tagged `enhancement` before writing code so we can discuss it first.

### 🔤 More Quotes
The quote dataset lives in `src/lib/words.ts`. Add literary or famous quotes following the existing format — no special characters like curly quotes, keep punctuation minimal.

### 🎨 UI Improvements
All styling is Tailwind CSS (`tailwind.config.js` has the design tokens). Animations use Framer Motion.

### 🏗 Architecture
- App Router (Next.js 14) — pages in `src/app/`
- All auth is Supabase Auth Helpers
- The core typing logic is in `src/hooks/useTypingEngine.ts` — this is the most complex part

## Code Style

- TypeScript strict mode — no `any` types please
- Functional components only
- Keep components small and focused
- Co-locate related logic in hooks

## Pull Request Guidelines

- One feature/fix per PR
- Include a clear description of what changed and why
- Test in both Chrome and Firefox if possible
- Make sure `npm run build` passes before submitting

## Environment Variables

**Never commit `.env.local`** — it's gitignored. The only env vars needed are in `.env.example` and should be set in your Vercel dashboard for production.

## Questions?

Open a GitHub Discussion or Issue — happy to help!
