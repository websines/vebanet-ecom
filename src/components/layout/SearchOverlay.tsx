'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { useUIStore } from '@/store/useStore';
import { searchProducts } from '@/data/products';
import { Product } from '@/types';

export function SearchOverlay() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setSearchOpen } = useUIStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchProducts(query);
      setResults(searchResults.slice(0, 6));
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [setSearchOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => setSearchOpen(false)}
      />

      {/* Search Container */}
      <div className="relative z-10 flex flex-col items-center pt-[15vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-2xl"
        >
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--text-muted)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-16 pl-14 pr-14 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl text-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] transition-all"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl overflow-hidden"
            >
              {results.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--bg-tertiary)] transition-colors group"
                  style={{
                    borderTop: index > 0 ? '1px solid var(--border-subtle)' : undefined,
                  }}
                >
                  {/* Product Image Placeholder */}
                  <div className="w-14 h-14 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-[var(--text-muted)] text-xs font-mono">
                      {product.brand.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-muted)]">{product.brand}</p>
                    <p className="font-medium text-[var(--text-primary)] truncate">
                      {product.name}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </motion.div>
          )}

          {/* No Results */}
          {query.length >= 2 && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-8 text-center"
            >
              <p className="text-[var(--text-muted)]">No products found for &quot;{query}&quot;</p>
            </motion.div>
          )}

          {/* Hint */}
          {query.length < 2 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-center text-sm text-[var(--text-muted)]"
            >
              Type at least 2 characters to search
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
