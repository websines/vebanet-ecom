'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Eye, Zap } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative"
    >
      <Link
        href={`/product/${product.slug}`}
        className="block bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-[var(--border-hover)] transition-all duration-300 group-hover:shadow-lg"
      >
        {/* Image Area */}
        <div className="relative aspect-square bg-[var(--bg-tertiary)] overflow-hidden">
          {/* Placeholder Pattern */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl font-bold text-[var(--text-muted)]/20">
                {product.brand.slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-2.5 py-1 bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-semibold rounded-lg flex items-center gap-1">
                <Zap className="w-3 h-3" />
                NEW
              </span>
            )}
            {product.isFeatured && !product.isNew && (
              <span className="px-2.5 py-1 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs font-semibold rounded-lg border border-[var(--border-default)]">
                FEATURED
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="w-10 h-10 flex items-center justify-center bg-[var(--accent)] text-[var(--bg-primary)] rounded-xl hover:scale-110 transition-transform shadow-lg"
              aria-label="Add to cart"
            >
              <Plus className="w-5 h-5" />
            </button>
            <span className="w-10 h-10 flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl border border-[var(--border-default)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors shadow-lg">
              <Eye className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs font-medium text-[var(--accent)] uppercase tracking-wider mb-1">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-[var(--text-primary)] line-clamp-2 mb-2 group-hover:text-[var(--accent)] transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-[var(--text-muted)] line-clamp-1 mb-3">
            {product.shortDescription}
          </p>

          {/* Attributes Preview */}
          <div className="flex flex-wrap gap-1.5">
            {product.attributes.slice(0, 2).map((attr) => (
              <span
                key={attr.name}
                className="px-2 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-xs rounded-md"
              >
                {attr.value}
              </span>
            ))}
          </div>

          {/* Stock Status */}
          <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <span
              className={`text-xs font-medium ${
                product.inStock ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
