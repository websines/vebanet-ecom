'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { getCategoryBySlug, categories } from '@/data/categories';
import { getProductsByCategory, getBrands } from '@/data/products';
import { renderIcon } from '@/lib/icons';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = getCategoryBySlug(slug);
  const products = category ? getProductsByCategory(category.id) : [];
  const brands = category ? getBrands(category.id) : [];

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = selectedBrands.length > 0
    ? products.filter(p => selectedBrands.includes(p.brand))
    : products;

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-[var(--text-muted)] mb-8">
          The category you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/categories" className="btn btn-primary">
          Browse All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/categories" className="hover:text-[var(--accent)] transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--text-primary)]">{category.name}</span>
          </nav>

          {/* Category Info */}
          <div className="flex items-start gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 rounded-2xl bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] shrink-0"
            >
              {renderIcon(category.icon, 'w-6 h-6')}
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl lg:text-4xl font-bold mb-2"
              >
                {category.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[var(--text-muted)] max-w-2xl"
              >
                {category.description}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Filters</h3>

                {/* Brands */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Brand</h4>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <label
                        key={brand}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0"
                        />
                        <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stock Status */}
                <div>
                  <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Availability</h4>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0"
                    />
                    <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                      In Stock
                    </span>
                  </label>
                </div>

                {/* Clear Filters */}
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => setSelectedBrands([])}
                    className="mt-6 w-full btn btn-secondary text-sm"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Other Categories */}
              <div className="mt-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Other Categories</h3>
                <nav className="space-y-1">
                  {categories
                    .filter(c => c.id !== category.id)
                    .slice(0, 6)
                    .map(cat => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] rounded-lg transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--border-subtle)]">
              <p className="text-[var(--text-muted)]">
                <span className="text-[var(--text-primary)] font-medium">{filteredProducts.length}</span>{' '}
                products
              </p>

              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                {/* View Mode */}
                <div className="flex items-center gap-1 p-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-6 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl"
              >
                <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Brand</h4>
                <div className="flex flex-wrap gap-2">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        selectedBrands.includes(brand)
                          ? 'bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)]'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-[var(--text-muted)] mb-4">
                  No products match your filters.
                </p>
                <button
                  onClick={() => setSelectedBrands([])}
                  className="btn btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
