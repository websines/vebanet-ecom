import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL is not set. Please configure it in .env file.')
}

// S3-compatible file storage configuration
// Works with: AWS S3, Cloudflare R2, DigitalOcean Spaces, MinIO, etc.
const fileModuleConfig = process.env.S3_BUCKET
  ? {
      resolve: '@medusajs/file-s3',
      options: {
        file_url: process.env.S3_FILE_URL,
        access_key_id: process.env.S3_ACCESS_KEY_ID,
        secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION || 'auto',
        bucket: process.env.S3_BUCKET,
        // For S3-compatible services (R2, Spaces, MinIO)
        endpoint: process.env.S3_ENDPOINT,
      },
    }
  : undefined // Use local file storage in development

// Stripe Payment Provider Configuration
const stripeModuleConfig = process.env.STRIPE_SECRET_KEY
  ? {
      resolve: '@medusajs/payment-stripe',
      options: {
        apiKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        // Enable automatic payment methods
        capture: true,
        // Enable automatic tax calculation (requires Stripe Tax)
        automaticPaymentMethods: true,
      },
    }
  : undefined

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
  modules: [
    // S3-compatible file storage (only if configured)
    ...(fileModuleConfig
      ? [{ resolve: Modules.FILE, options: fileModuleConfig }]
      : []),
    // Stripe payment provider (only if configured)
    ...(stripeModuleConfig
      ? [{ resolve: Modules.PAYMENT, options: { providers: [stripeModuleConfig] } }]
      : []),
  ],
})
