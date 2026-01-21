'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  User,
} from 'lucide-react';
import { useCartStore, useUIStore } from '@/store/useStore';
import { categories } from '@/data/categories';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';
import { CartDrawer } from '../cart/CartDrawer';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const { isMenuOpen, isSearchOpen, isCartOpen, setMenuOpen, setSearchOpen, setCartOpen } = useUIStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]'
            : 'bg-transparent'
        }`}
      >
        {/* Top Bar */}
        <div className="hidden lg:block border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          <div className="container">
            <div className="flex items-center justify-between h-8 text-xs text-[var(--text-muted)]">
              <span>Premium Electronics Store</span>
              <div className="flex items-center gap-6">
                <Link href="/support" className="hover:text-[var(--accent)] transition-colors">
                  Support
                </Link>
                <Link href="/track-order" className="hover:text-[var(--accent)] transition-colors">
                  Track Order
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <span className="text-[var(--bg-primary)] font-bold text-xl">V</span>
                </div>
                <div className="absolute inset-0 bg-[var(--accent)] rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              </div>
              <span className="text-2xl font-semibold tracking-tight">
                Veba<span className="text-[var(--accent)]">net</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {categories.slice(0, 7).map((category) => (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      hoveredCategory === category.id
                        ? 'text-[var(--accent)] bg-[var(--accent-subtle)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {category.name}
                  </Link>
                </div>
              ))}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors">
                  More
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl p-2 min-w-[200px] shadow-lg">
                    {categories.slice(7).map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] rounded-lg transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && <MobileMenu />}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && <SearchOverlay />}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && <CartDrawer />}
      </AnimatePresence>
    </>
  );
}
