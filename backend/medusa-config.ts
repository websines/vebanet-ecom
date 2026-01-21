import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL is not set. Please configure it in .env file.')
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:3000',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:9000',
      authCors: process.env.AUTH_CORS || 'http://localhost:9000,http://localhost:3000',
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  admin: {
    // Admin panel runs at /app by default
    backendUrl: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
  },
})
