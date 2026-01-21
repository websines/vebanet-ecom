'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Zap, Shield, Truck, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { categories } from '@/data/categories';
import { getFeaturedProducts, getNewProducts } from '@/data/products';

const featuredProducts = getFeaturedProducts();
const newProducts = getNewProducts();

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: '2-3 business days',
  },
  {
    icon: Cpu,
    title: 'Quality Products',
    description: 'Top brands only',
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)] rounded-full blur-[128px] opacity-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent)] rounded-full blur-[128px] opacity-5" />

        <div className="container relative">
          <div className="py-20 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[var(--accent-subtle)] border border-[var(--accent)]/20 rounded-full"
              >
                <Zap className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-sm font-medium text-[var(--accent)]">
                  Premium Electronics Store
                </span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                Technology for the{' '}
                <span className="relative">
                  <span className="text-[var(--accent)]">future</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 8C50 2 150 2 198 8"
                      stroke="var(--accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl lg:text-2xl text-[var(--text-secondary)] mb-10 max-w-2xl">
                Discover the latest in computers, components, gaming, smartphones, and more.
                Quality products from top brands.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/category/components"
                  className="btn btn-primary text-base px-8 py-4"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/categories"
                  className="btn btn-secondary text-base px-8 py-4"
                >
                  Browse Categories
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-16 pt-16 border-t border-[var(--border-subtle)]"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: '14', label: 'Categories' },
                  { value: '500+', label: 'Products' },
                  { value: '50+', label: 'Brands' },
                  { value: '24/7', label: 'Support' },
                ].map((stat, index) => (
                  <div key={stat.label}>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-4xl lg:text-5xl font-bold text-[var(--accent)] mb-2"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-[var(--text-muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] shrink-0">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl lg:text-4xl font-bold mb-2"
              >
                Shop by Category
              </motion.h2>
              <p className="text-[var(--text-muted)]">
                Browse our wide selection of electronics
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-2 text-[var(--accent)] hover:underline font-medium"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>

          <Link
            href="/categories"
            className="sm:hidden flex items-center justify-center gap-2 mt-8 text-[var(--accent)] font-medium"
          >
            View All Categories
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-[var(--accent-subtle)] rounded-full"
              >
                <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[var(--accent)]">Featured</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl lg:text-4xl font-bold mb-2"
              >
                Featured Products
              </motion.h2>
              <p className="text-[var(--text-muted)]">
                Our most popular and highly-rated products
              </p>
            </div>
            <Link
              href="/featured"
              className="hidden sm:flex items-center gap-2 text-[var(--accent)] hover:underline font-medium"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-emerald-500/10 rounded-full"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">New Arrivals</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl lg:text-4xl font-bold mb-2"
              >
                Just Arrived
              </motion.h2>
              <p className="text-[var(--text-muted)]">
                Check out our latest additions to the store
              </p>
            </div>
            <Link
              href="/new"
              className="hidden sm:flex items-center gap-2 text-[var(--accent)] hover:underline font-medium"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--accent)] to-cyan-600 p-8 lg:p-16"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl lg:text-5xl font-bold text-[var(--bg-primary)] mb-4">
                Stay Updated
              </h2>
              <p className="text-lg text-[var(--bg-primary)]/80 mb-8">
                Subscribe to our newsletter for the latest products, exclusive deals, and tech news.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-14 px-6 bg-[var(--bg-primary)]/10 backdrop-blur-sm border border-[var(--bg-primary)]/20 rounded-xl text-[var(--bg-primary)] placeholder:text-[var(--bg-primary)]/50 focus:outline-none focus:border-[var(--bg-primary)]/40"
                />
                <button className="h-14 px-8 bg-[var(--bg-primary)] text-[var(--accent)] font-semibold rounded-xl hover:bg-[var(--bg-primary)]/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
