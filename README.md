# 2048 Game Web App

A responsive 2048 game built with Next.js, Tailwind CSS, and Supabase. Features user authentication, score persistence, and leaderboards.

## Features

- 🎮 Classic 2048 gameplay with smooth animations
- 🔐 Magic link authentication via Supabase
- 📊 Personal best score tracking
- 🏆 Top 10 leaderboard
- 📱 Fully responsive design
- ⚡ Real-time score updates

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth)
- **Deployment**: Vercel

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

4. Configure Auth settings:
   - Go to Authentication > Settings
   - Add your domain to "Site URL" (e.g., `http://localhost:3000` for development)
   - Add redirect URLs: `http://localhost:3000/auth/callback` and `https://your-domain.vercel.app/auth/callback`

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Supabase Configuration for Production

1. Update Site URL in Supabase Auth settings to your Vercel domain
2. Add production redirect URL: `https://your-domain.vercel.app/auth/callback`

## Game Rules

- Use arrow keys to move tiles
- Tiles with the same number merge when they touch
- Try to reach the 2048 tile!
- Scores are automatically saved for signed-in users

## Project Structure

```
src/
├── app/
│   ├── auth/callback/     # Magic link callback handler
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main game page
├── components/
│   ├── AuthForm.tsx      # Sign-in form
│   ├── Dashboard.tsx     # Personal stats & leaderboard
│   └── GameBoard.tsx     # Main game component
└── lib/
    ├── auth.ts           # Authentication utilities
    ├── game2048.ts       # Game logic
    └── supabase.ts       # Supabase client
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or as a starting point for your own games!