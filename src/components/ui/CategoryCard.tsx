'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';
import { renderIcon } from '@/lib/icons';

interface CategoryCardProps {
  category: Category;
  index?: number;
  variant?: 'default' | 'compact';
}

export function CategoryCard({ category, index = 0, variant = 'default' }: CategoryCardProps) {

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
      >
        <Link
          href={`/category/${category.slug}`}
          className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-all group"
        >
          <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
            {renderIcon(category.icon, 'w-5 h-5')}
          </span>
          <span className="font-medium text-[var(--text-primary)]">{category.name}</span>
          <span className="ml-auto text-xs text-[var(--text-muted)]">
            {category.productCount}
          </span>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        href={`/category/${category.slug}`}
        className="block group relative overflow-hidden rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all duration-300"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-subtle)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="relative p-6">
          {/* Icon */}
          <div className="w-14 h-14 mb-4 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:bg-[var(--accent-subtle)] transition-all duration-300">
            {renderIcon(category.icon, 'w-8 h-8')}
          </div>

          {/* Text */}
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4">
            {category.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-muted)]">
              {category.productCount} products
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              Browse
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Corner Accent */}
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[var(--accent)] rounded-full opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-500" />
      </Link>
    </motion.div>
  );
}
