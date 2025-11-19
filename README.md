# Ezary - Smart Financial Management System

A professional, production-grade web application for managing financial transactions in money transfer shops.

## 🚀 Features

- **Multi-Currency Support**: Handle KES and USD transactions
- **Transaction Management**: MPESA, Taaj Money Transfers, Forex Exchange, and Cash
- **Customer Tracking**: Manage customer profiles with running balances
- **Unclaimed Transactions**: Track and assign unclaimed deposits
- **Forex Rates**: Manage daily USD/KES exchange rates
- **Real-time Balances**: Automatic balance calculations with every transaction
- **Secure Authentication**: Supabase Auth with role-based access
- **Beautiful UI**: Banking-style interface with dark mode support

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Shadcn/UI + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**:
  - Frontend → Vercel
  - Backend/Database → Supabase

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

## 🏗️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yussuf3468/Ezary.git
cd "Ezary Project"
```

### 2. Setup Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to Project Settings → API
3. Copy your Project URL and anon/public key

### 3. Run database migrations

In your Supabase project dashboard:

1. Go to SQL Editor
2. Run the migrations in order:
   - `supabase/migrations/20231119000001_initial_schema.sql`
   - `supabase/migrations/20231119000002_seed_data.sql`

### 4. Configure environment variables

```bash
cd frontend
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Install dependencies and run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
Ezary Project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Layout components
│   │   │   └── ui/           # Reusable UI components (Shadcn)
│   │   ├── contexts/         # React contexts (Auth, etc.)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities (Supabase client, helpers)
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── public/               # Static assets
│   └── package.json
└── supabase/
    ├── migrations/           # SQL migrations
    └── functions/            # Edge functions (future)
```

## 🗄️ Database Schema

### Tables

- **customers**: Customer/agent information
- **transactions**: All financial transactions with auto-calculated balances
- **forex_rates**: Daily USD/KES exchange rates
- **shop_balances**: Current shop balances by currency

### Key Features

- Automatic balance updates via PostgreSQL triggers
- Row Level Security (RLS) enabled
- Foreign key constraints for data integrity
- Indexes for optimized queries

## 🎨 Pages

- **Dashboard**: Overview with balance cards and recent transactions
- **Transactions**: Full transaction history with filters
- **Customers**: Customer management with individual sheets
- **Unclaimed**: Track and assign unclaimed transactions
- **Forex**: Manage exchange rates and currency conversion
- **Reports**: Generate and export financial reports

## 🔐 Authentication

The app uses Supabase Auth for secure user management:

- Email/password authentication
- Protected routes
- Session management
- Role-based access (Admin/Cashier)

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy to Vercel
vercel --prod
```

### Backend (Supabase)

Backend is automatically hosted on Supabase. Just ensure your migrations are applied.

## 👥 Default Test Data

The seed migration includes sample customers:

- Ali Muse Fatah
- Bahjo
- Ibrahim Alshifa
- Sarif (Agent)
- Abdibasid

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for your money transfer shop!

## 🐛 Issues & Support

For bugs and feature requests, please create an issue on GitHub:
https://github.com/yussuf3468/Ezary/issues

## 👨‍💻 Author

**Yussuf**

- GitHub: [@yussuf3468](https://github.com/yussuf3468)

---

Built with ❤️ for small money transfer businesses
