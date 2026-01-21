# Vebanet Setup Guide

Complete guide to set up, configure, and deploy the Vebanet e-commerce platform.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Feature Configuration](#feature-configuration)
7. [Deployment](#deployment)
8. [Post-Deployment](#post-deployment)

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

# Stripe (for client-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx

# Optional: Analytics
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

# ============================================
# REDIS (Optional but recommended for production)
# ============================================
# Leave empty for in-memory (dev only)
REDIS_URL=

# Upstash Redis (Serverless - Recommended)
# REDIS_URL=rediss://default:xxxx@us1-xxx-xxx.upstash.io:6379

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
# FILE STORAGE (S3-Compatible) - Optional
# ============================================
# AWS S3
# S3_FILE_URL=https://your-bucket.s3.amazonaws.com
# S3_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
# S3_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# S3_REGION=us-east-1
# S3_BUCKET=vebanet-media

# Cloudflare R2 (S3-compatible, no egress fees)
# S3_FILE_URL=https://pub-xxxxx.r2.dev
# S3_ACCESS_KEY_ID=xxxx
# S3_SECRET_ACCESS_KEY=xxxx
# S3_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
# S3_REGION=auto
# S3_BUCKET=vebanet-media

# DigitalOcean Spaces
# S3_FILE_URL=https://vebanet.nyc3.digitaloceanspaces.com
# S3_ACCESS_KEY_ID=xxxx
# S3_SECRET_ACCESS_KEY=xxxx
# S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
# S3_REGION=nyc3
# S3_BUCKET=vebanet

# ============================================
# STRIPE PAYMENTS (Required for checkout)
# ============================================
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Get your keys at: https://dashboard.stripe.com/apikeys
# Set up webhook at: https://dashboard.stripe.com/webhooks
# Webhook endpoint: https://api.yourdomain.com/store/payment/webhook

# ============================================
# RESEND EMAIL (Required for notifications)
# ============================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=Vebanet <noreply@vebanet.com>
FRONTEND_URL=http://localhost:3000

# Get your API key at: https://resend.com/api-keys
# Verify your domain at: https://resend.com/domains
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

## Feature Configuration

### Stripe Payments

Stripe is **already configured** in the backend. You just need to add your API keys.

1. **Get API Keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy `Publishable key` and `Secret key`

2. **Set Up Webhook:**
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://api.yourdomain.com/store/payment/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Copy the webhook signing secret

3. **Add to backend/.env:**
   ```env
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

4. **Test with Stripe CLI (development):**
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe

   # Login
   stripe login

   # Forward webhooks to local
   stripe listen --forward-to localhost:9000/store/payment/webhook
   ```

**Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Resend Email Notifications

Resend is **already configured** with email templates for:
- Order confirmation
- Shipping notification
- Welcome email (new customer)

1. **Get API Key:**
   - Go to [Resend](https://resend.com)
   - Create account → API Keys → Create API Key

2. **Verify Domain (for production):**
   - Go to Resend → Domains → Add Domain
   - Add DNS records to your domain
   - Wait for verification

3. **Add to backend/.env:**
   ```env
   RESEND_API_KEY=re_xxxxx
   FROM_EMAIL=Vebanet <noreply@vebanet.com>
   FRONTEND_URL=https://vebanet.com
   ```

**Email Events Triggered:**
| Event | Email Sent |
|-------|------------|
| `customer.created` | Welcome email |
| `order.placed` | Order confirmation |
| `order.fulfillment_created` | Shipping notification |

### S3 File Storage

For production, configure S3-compatible storage:

```env
# Cloudflare R2 (recommended - no egress fees)
S3_FILE_URL=https://pub-xxxxx.r2.dev
S3_ACCESS_KEY_ID=xxxxx
S3_SECRET_ACCESS_KEY=xxxxx
S3_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=vebanet-media
```

### User Authentication

Authentication is handled via:
- **Frontend:** Zustand store with persistence (`useAuthStore`)
- **Backend:** Medusa customer API

The auth flow:
1. User clicks "Sign In" → Opens AuthModal
2. User submits email/password
3. Frontend calls Medusa auth API
4. Token stored in Zustand (persisted to localStorage)
5. User redirected to account pages

**Demo Mode:** Currently accepts any email/password for testing.

### Checkout Flow

Multi-step checkout at `/checkout`:

1. **Shipping** - Select address + shipping method
2. **Payment** - Enter card details (Stripe)
3. **Review** - Confirm order details
4. **Confirmation** - Order success page

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
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
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

### 3. Update Frontend URL

In backend/.env for emails:
```env
FRONTEND_URL=https://vebanet.com
```

### 4. Set Up Stripe Webhook (Production)

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://api.vebanet.com/store/payment/webhook`
3. Copy new webhook secret
4. Update `STRIPE_WEBHOOK_SECRET` in backend

### 5. Connect Storefront to Medusa API

To switch from mock data to live Medusa API, update the hooks:

```typescript
// src/lib/hooks/useProducts.ts
// Change from mock data to API calls

import api from '@/lib/api';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.getProducts();
      return response.products;
    },
  });
}
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
- [ ] Test login/register flow
- [ ] Test checkout flow

### Production
- [ ] Generate secure JWT_SECRET and COOKIE_SECRET
- [ ] Set up production database (Neon/Supabase/Railway)
- [ ] Configure Stripe (live keys)
- [ ] Configure Resend (verified domain)
- [ ] Set up file storage (S3/R2)
- [ ] Deploy backend to Railway/DigitalOcean
- [ ] Deploy storefront to Vercel
- [ ] Configure custom domains
- [ ] Update CORS settings
- [ ] Set up Stripe webhook (production URL)
- [ ] Test full checkout flow
- [ ] Set up monitoring/analytics

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         STOREFRONT                               │
│                    (Next.js 16 + React)                          │
├─────────────────────────────────────────────────────────────────┤
│  Components          │  State (Zustand)    │  API Layer          │
│  ─────────────────   │  ────────────────   │  ──────────────     │
│  • Header            │  • useCartStore     │  • api.ts           │
│  • AuthModal         │  • useAuthStore     │  • useProducts.ts   │
│  • CartDrawer        │  • useWishlistStore │  • useReviews.ts    │
│  • ProductCard       │  • useCheckoutStore │  • useOrders.ts     │
│  • ReviewCard        │  • useUIStore       │                     │
│  • NotificationToast │  • useOrderStore    │                     │
├─────────────────────────────────────────────────────────────────┤
│  Pages                                                           │
│  ─────                                                           │
│  /                   Homepage                                    │
│  /category/[slug]    Category products                           │
│  /product/[slug]     Product detail + reviews                    │
│  /checkout           Multi-step checkout                         │
│  /account            Profile management                          │
│  /account/orders     Order history                               │
│  /account/wishlist   Saved products                              │
│  /account/addresses  Address management                          │
│  /account/settings   Preferences                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                      (Medusa v2)                                 │
├─────────────────────────────────────────────────────────────────┤
│  Modules             │  Custom APIs        │  Subscribers        │
│  ───────             │  ───────────        │  ───────────        │
│  • Payment (Stripe)  │  /store/payment     │  order.placed       │
│  • File (S3)         │  /store/email       │  order.fulfilled    │
│                      │  /store/payment/    │  customer.created   │
│                      │    webhook          │                     │
├─────────────────────────────────────────────────────────────────┤
│  Integrations                                                    │
│  ────────────                                                    │
│  • Stripe - Payments & webhooks                                  │
│  • Resend - Transactional emails                                 │
│  • S3/R2  - File storage                                         │
│  • PostgreSQL - Database                                         │
│  • Redis - Caching (optional)                                    │
└─────────────────────────────────────────────────────────────────┘
```

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

### Stripe webhook not working
- Verify webhook URL is accessible
- Check STRIPE_WEBHOOK_SECRET is correct
- Use Stripe CLI for local testing

### Emails not sending
- Verify RESEND_API_KEY is correct
- Check domain is verified in Resend dashboard
- Check FROM_EMAIL matches verified domain

### Auth not persisting
- Check browser localStorage is enabled
- Clear localStorage and try again
- Verify Zustand persist middleware is working

---

## Support

- **Medusa Docs:** https://docs.medusajs.com
- **Next.js Docs:** https://nextjs.org/docs
- **Stripe Docs:** https://stripe.com/docs
- **Resend Docs:** https://resend.com/docs
- **Discord:** https://discord.gg/medusajs
