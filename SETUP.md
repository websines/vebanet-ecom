# Vebanet Setup Guide

Complete guide to set up, configure, and deploy the Vebanet e-commerce platform.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Deployment](#deployment)
7. [Post-Deployment](#post-deployment)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | v20+ | Runtime |
| npm/yarn | Latest | Package manager |
| PostgreSQL | 14+ | Database (for Medusa) |
| Git | Latest | Version control |

### Optional

| Software | Purpose |
|----------|---------|
| Redis | Caching, queues, sessions |
| Docker | Containerized deployment |

---

## Local Development

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd vebanet-ecom

# Install storefront dependencies
npm install

# Install backend dependencies
cd backend
yarn install
cd ..
```

### 2. Set Up Environment Files

```bash
# Storefront (create in root)
cp .env.example .env.local

# Backend
cd backend
cp .env.template .env
```

---

## Environment Variables

### Storefront (`/.env.local`)

```env
# Medusa Backend URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Optional: Analytics, etc.
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Backend (`/backend/.env`)

```env
# ============================================
# DATABASE (Required)
# ============================================
# Choose ONE of these options:

# Option 1: Local PostgreSQL
DATABASE_URL=postgres://postgres:password@localhost:5432/vebanet_medusa

# Option 2: Neon (Serverless - Recommended for hobby)
DATABASE_URL=postgres://user:password@ep-cool-name-123456.us-east-1.aws.neon.tech/vebanet?sslmode=require

# Option 3: Supabase
DATABASE_URL=postgres://postgres:password@db.xxxxxxxxxxxx.supabase.co:5432/postgres

# Option 4: Railway
DATABASE_URL=postgres://postgres:password@containers-us-west-xxx.railway.app:5432/railway

# Option 5: PlanetScale (MySQL - requires adapter)
# Not recommended for Medusa

# ============================================
# REDIS (Optional but recommended for production)
# ============================================
# Leave empty for in-memory (dev only)
REDIS_URL=

# Upstash Redis (Serverless - Recommended)
# REDIS_URL=rediss://default:xxxx@us1-xxx-xxx.upstash.io:6379

# Railway Redis
# REDIS_URL=redis://default:xxx@containers-us-west-xxx.railway.app:6379

# ============================================
# CORS (Adjust for your domains)
# ============================================
# Development
STORE_CORS=http://localhost:3000,http://localhost:8000
ADMIN_CORS=http://localhost:5173,http://localhost:9000
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:3000

# Production (example)
# STORE_CORS=https://vebanet.com,https://www.vebanet.com
# ADMIN_CORS=https://admin.vebanet.com,https://api.vebanet.com
# AUTH_CORS=https://vebanet.com,https://admin.vebanet.com,https://api.vebanet.com

# ============================================
# SECURITY (Change these in production!)
# ============================================
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
COOKIE_SECRET=your-super-secret-cookie-key-min-32-chars

# Generate secure secrets:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ============================================
# ADMIN
# ============================================
MEDUSA_ADMIN_ONBOARDING_TYPE=default

# ============================================
# FILE STORAGE (S3-Compatible)
# ============================================
# AWS S3
# S3_FILE_URL=https://your-bucket.s3.amazonaws.com
# S3_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
# S3_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# S3_REGION=us-east-1
# S3_BUCKET=vebanet-media

# Cloudflare R2 (S3-compatible, no egress fees)
# S3_FILE_URL=https://your-account-id.r2.cloudflarestorage.com
# S3_ACCESS_KEY_ID=xxxx
# S3_SECRET_ACCESS_KEY=xxxx
# S3_REGION=auto
# S3_BUCKET=vebanet-media

# ============================================
# PAYMENTS (Add when ready)
# ============================================
# Stripe
# STRIPE_API_KEY=sk_live_xxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxx

# PayPal
# PAYPAL_CLIENT_ID=xxxx
# PAYPAL_CLIENT_SECRET=xxxx
# PAYPAL_SANDBOX=false

# ============================================
# EMAIL (Add when ready)
# ============================================
# SendGrid
# SENDGRID_API_KEY=SG.xxxx
# SENDGRID_FROM=noreply@vebanet.com

# Resend
# RESEND_API_KEY=re_xxxx
# RESEND_FROM=noreply@vebanet.com
```

---

## Database Setup

### Option A: Neon (Recommended for starting out)

1. Go to [neon.tech](https://neon.tech) and create account
2. Create new project → name it `vebanet`
3. Copy connection string from dashboard
4. Add `?sslmode=require` to the end
5. Paste into `DATABASE_URL` in backend/.env

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com) and create project
2. Go to Settings → Database → Connection string
3. Copy the URI (use "Transaction" mode for serverless)
4. Paste into `DATABASE_URL`

### Option C: Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Add PostgreSQL
3. Click on PostgreSQL → Variables → Copy `DATABASE_URL`
4. Paste into backend/.env

### Option D: Local PostgreSQL

```bash
# macOS
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
createdb vebanet_medusa

# Connection string
DATABASE_URL=postgres://postgres:password@localhost:5432/vebanet_medusa
```

---

## Running the Application

### Step 1: Start Backend (Medusa)

```bash
cd backend

# Run database migrations (first time only)
yarn medusa db:migrate

# Create admin user (first time only)
yarn medusa user -e admin@vebanet.com -p YourSecurePassword123

# Seed demo data (optional)
yarn medusa seed

# Start development server
yarn dev
```

**Backend URLs:**
- API: http://localhost:9000
- Admin Panel: http://localhost:9000/app
- API Docs: http://localhost:9000/api-docs (if enabled)

### Step 2: Start Storefront (Next.js)

```bash
# From project root (new terminal)
npm run dev
```

**Storefront URL:** http://localhost:3000

### Step 3: Access Admin Panel

1. Go to http://localhost:9000/app
2. Login with the admin credentials you created
3. Start adding products, categories, etc.

---

## Deployment

### Storefront → Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.vebanet.com
```

**Or via GitHub:**
1. Push code to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set root directory to `/` (not `/backend`)
4. Add environment variables
5. Deploy

### Backend → Railway (Recommended)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Add PostgreSQL
railway add

# Deploy
railway up

# Set environment variables in Railway dashboard
```

**Manual Railway Setup:**
1. New Project in [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Add new service → Deploy from GitHub repo
4. Set root directory to `/backend`
5. Add environment variables from your .env
6. Railway auto-detects and deploys

### Backend → DigitalOcean App Platform

1. Create App in [DigitalOcean](https://cloud.digitalocean.com/apps)
2. Connect GitHub repo
3. Set source directory to `/backend`
4. Add managed PostgreSQL database
5. Configure environment variables
6. Deploy

### Backend → Docker (Self-hosted)

```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

EXPOSE 9000
CMD ["yarn", "start"]
```

```bash
# Build and run
docker build -t vebanet-backend ./backend
docker run -p 9000:9000 --env-file backend/.env vebanet-backend
```

---

## Post-Deployment

### 1. Update CORS

In production `backend/.env`:
```env
STORE_CORS=https://vebanet.com,https://www.vebanet.com
ADMIN_CORS=https://api.vebanet.com
AUTH_CORS=https://vebanet.com,https://api.vebanet.com
```

### 2. Set Up Custom Domain

**Vercel (Storefront):**
- Settings → Domains → Add `vebanet.com`

**Railway (Backend):**
- Settings → Domains → Add `api.vebanet.com`

### 3. Enable HTTPS

Both Vercel and Railway provide automatic SSL certificates.

### 4. Set Up Stripe (Payments)

```bash
cd backend
yarn add @medusajs/medusa-payment-stripe
```

Add to `medusa-config.ts`:
```typescript
modules: [
  {
    resolve: "@medusajs/medusa-payment-stripe",
    options: {
      api_key: process.env.STRIPE_API_KEY,
    },
  },
]
```

### 5. Set Up File Storage (S3/R2)

```bash
cd backend
yarn add @medusajs/file-s3
```

Add to `medusa-config.ts`:
```typescript
modules: [
  {
    resolve: "@medusajs/file-s3",
    options: {
      file_url: process.env.S3_FILE_URL,
      access_key_id: process.env.S3_ACCESS_KEY_ID,
      secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION,
      bucket: process.env.S3_BUCKET,
    },
  },
]
```

### 6. Connect Storefront to Medusa API

Update storefront to fetch from Medusa instead of mock data:

```typescript
// src/lib/medusa.ts
import Medusa from "@medusajs/medusa-js"

export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  maxRetries: 3,
})
```

---

## Checklist

### Development
- [ ] Clone repository
- [ ] Install dependencies (npm + yarn)
- [ ] Set up PostgreSQL database
- [ ] Configure backend/.env
- [ ] Run migrations
- [ ] Create admin user
- [ ] Start backend (yarn dev)
- [ ] Start storefront (npm run dev)
- [ ] Access admin panel

### Production
- [ ] Generate secure JWT_SECRET and COOKIE_SECRET
- [ ] Set up production database (Neon/Supabase/Railway)
- [ ] Deploy backend to Railway/DigitalOcean
- [ ] Deploy storefront to Vercel
- [ ] Configure custom domains
- [ ] Update CORS settings
- [ ] Set up file storage (S3/R2)
- [ ] Set up payment provider (Stripe)
- [ ] Set up email provider (SendGrid/Resend)
- [ ] Test checkout flow
- [ ] Set up monitoring/analytics

---

## Troubleshooting

### Database connection failed
- Check DATABASE_URL format
- Ensure `?sslmode=require` for cloud databases
- Verify database is running and accessible

### CORS errors
- Ensure your frontend URL is in STORE_CORS
- Include protocol (http:// or https://)
- Restart backend after changing .env

### Admin panel blank
- Clear browser cache
- Check ADMIN_CORS includes admin URL
- Verify backend is running

### Migrations failed
- Ensure DATABASE_URL is set
- Try `yarn medusa db:migrate --force`
- Check PostgreSQL version (14+ required)

---

## Support

- **Medusa Docs:** https://docs.medusajs.com
- **Next.js Docs:** https://nextjs.org/docs
- **Discord:** https://discord.gg/medusajs
