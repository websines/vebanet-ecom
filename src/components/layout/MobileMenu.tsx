'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, HelpCircle } from 'lucide-react';
import { useUIStore } from '@/store/useStore';
import { categories } from '@/data/categories';
import { renderIcon } from '@/lib/icons';

export function MobileMenu() {
  const { setMenuOpen } = useUIStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 lg:hidden"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setMenuOpen(false)}
      />

      {/* Menu Panel */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] p-4">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
              <span className="text-[var(--bg-primary)] font-bold">V</span>
            </div>
            <span className="text-xl font-semibold">
              Veba<span className="text-[var(--accent)]">net</span>
            </span>
          </Link>
        </div>

        {/* Categories */}
        <div className="p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Categories
          </h3>
          <nav className="space-y-1">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={`/category/${category.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors group"
                >
                  <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                    {renderIcon(category.icon, 'w-5 h-5')}
                  </span>
                  <span className="font-medium">{category.name}</span>
                  <span className="ml-auto text-xs text-[var(--text-muted)]">
                    {category.productCount}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Footer Links */}
        <div className="p-4 border-t border-[var(--border-subtle)]">
          <nav className="space-y-1">
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Account</span>
            </Link>
            <Link
              href="/support"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">Support</span>
            </Link>
          </nav>
        </div>
      </motion.div>
    </motion.div>
  );
}
