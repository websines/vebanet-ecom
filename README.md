# Vebanet - Premium Electronics Store

A full-fledged e-commerce platform for electronics, built with Next.js and Medusa.

## Tech Stack

### Storefront (Customer-facing)
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Zustand** - State management (cart, UI)
- **React Query** - Data fetching and caching
- **Framer Motion** - Animations

### Backend (Admin & API)
- **Medusa v2** - Headless commerce engine
- **PostgreSQL** - Database
- **Redis** (optional) - Caching and queues

## Project Structure

```
vebanet-ecom/
├── src/                    # Next.js storefront
│   ├── app/               # Pages and routes
│   ├── components/        # React components
│   ├── data/              # Mock data (categories, products)
│   ├── lib/               # Utilities and providers
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript types
├── backend/               # Medusa backend
│   ├── src/               # Custom modules and API
│   └── .env               # Environment config
└── package.json
```

## Quick Start

### 1. Storefront (Frontend)

```bash
# From project root
npm install
npm run dev
```

Open http://localhost:3000

### 2. Backend (Medusa)

```bash
# Configure database
cd backend
cp .env.template .env
# Edit .env and set DATABASE_URL

# Run migrations and start
yarn medusa db:migrate
yarn dev
```

- **API**: http://localhost:9000
- **Admin Panel**: http://localhost:9000/app

## Database Setup

Configure `backend/.env` with your PostgreSQL connection:

```env
# Local PostgreSQL
DATABASE_URL=postgres://user:password@localhost:5432/vebanet_medusa

# Neon (serverless)
DATABASE_URL=postgres://user:password@ep-xxx.us-east-1.aws.neon.tech/vebanet

# Supabase
DATABASE_URL=postgres://postgres:password@db.xxx.supabase.co:5432/postgres

# Railway
DATABASE_URL=postgres://postgres:xxx@xxx.railway.app:5432/railway
```

## Categories

The store includes 14 product categories (mirroring PcComponentes):

1. Components (GPUs, CPUs, RAM, etc.)
2. Computers (Laptops, Desktops)
3. Peripherals (Keyboards, Mice, Monitors)
4. Consoles & Gaming
5. Smartphones & Tablets
6. TVs
7. Home Appliances
8. Smart Home
9. Audio
10. Smartwatches & Wearables
11. Photography
12. Networking
13. Urban Mobility
14. Toys & Games

## Features

- [x] Homepage with hero, categories, featured products
- [x] Category pages with filtering
- [x] Product detail pages
- [x] Shopping cart drawer
- [x] Search overlay
- [x] Mobile responsive design
- [x] Dark premium theme
- [ ] User authentication
- [ ] Checkout flow
- [ ] Payment integration (Stripe)
- [ ] Order management
- [ ] Wishlist

## Deployment

### Storefront
Deploy to **Vercel** or any Node.js hosting:
```bash
npm run build
npm start
```

### Backend
Deploy Medusa to **Railway**, **DigitalOcean**, or **AWS**:
```bash
cd backend
yarn build
yarn start
```

## Environment Variables

### Storefront (.env.local)
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### Backend (backend/.env)
```env
DATABASE_URL=your-postgres-url
REDIS_URL=your-redis-url (optional)
JWT_SECRET=your-secret-key
COOKIE_SECRET=your-cookie-secret
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000,http://localhost:3000
```

## License

MIT
