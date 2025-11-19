# CRITICAL: Setup Instructions

## 🚨 BEFORE FIRST RUN

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Wait for project to be ready

### 2. Run Database Migrations
In your Supabase project dashboard:
1. Go to SQL Editor
2. Copy and paste `supabase/migrations/20231119000001_initial_schema.sql`
3. Click "Run"
4. Copy and paste `supabase/migrations/20231119000002_seed_data.sql`
5. Click "Run"

### 3. Get API Credentials
1. In Supabase dashboard, go to Settings → API
2. Copy "Project URL"
3. Copy "anon public" key

### 4. Configure Environment
```bash
cd frontend
cp .env.example .env
```

Edit `.env` and add:
```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Start Application
```bash
npm run dev
```

## 📧 Test Login

After creating an account through the register page, use those credentials to login.

## ⚠️ Important Notes

- **DO NOT** commit `.env` file (already in .gitignore)
- **DO** run both migration files in order
- **DO** verify Supabase project is active before starting dev server
- **DO** use strong passwords (minimum 6 characters)

## 🔍 Verify Setup

After setup, you should see:
1. Login page at http://localhost:5173/login
2. Register page at http://localhost:5173/register
3. No console errors
4. Proper authentication flow

## 🐛 Troubleshooting

**Error: "Missing Supabase environment variables"**
- Check `.env` file exists in `frontend/` directory
- Verify both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- Restart dev server after changing `.env`

**Error: Database connection issues**
- Verify migrations were run successfully in Supabase
- Check Supabase project is active
- Verify API credentials are correct

**Error: Authentication not working**
- Ensure RLS policies are enabled (done by migration)
- Check Supabase Auth is enabled in project settings
- Verify anon key is correct
