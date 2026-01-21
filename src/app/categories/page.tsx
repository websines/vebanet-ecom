'use client';

import { motion } from 'framer-motion';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { categories } from '@/data/categories';

export default function CategoriesPage() {
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
        <div className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              All Categories
            </h1>
            <p className="text-lg text-[var(--text-muted)]">
              Browse our complete collection of {totalProducts}+ products across{' '}
              {categories.length} categories
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
