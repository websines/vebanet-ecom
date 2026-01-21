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
  Heart,
  LogOut,
  Package,
  Settings,
} from 'lucide-react';
import { useCartStore, useUIStore, useAuthStore, useWishlistStore } from '@/store/useStore';
import { categories } from '@/data/categories';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';
import { CartDrawer } from '../cart/CartDrawer';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { isMenuOpen, isSearchOpen, isCartOpen, setMenuOpen, setSearchOpen, setCartOpen, setAuthModalOpen } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

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

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="hidden sm:flex relative p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <div className="relative hidden sm:block">
                {isAuthenticated ? (
                  <div
                    onMouseEnter={() => setShowUserMenu(true)}
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <button
                      className="flex items-center gap-2 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user?.firstName?.charAt(0).toUpperCase()}
                      </div>
                    </button>
                    {showUserMenu && (
                      <div className="absolute top-full right-0 pt-2">
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl p-2 min-w-[200px] shadow-lg">
                          <div className="px-4 py-2 border-b border-[var(--border-subtle)] mb-2">
                            <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[var(--text-muted)] text-sm">{user?.email}</p>
                          </div>
                          <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] rounded-lg transition-colors">
                            <User className="w-4 h-4" />
                            My Account
                          </Link>
                          <Link href="/account/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] rounded-lg transition-colors">
                            <Package className="w-4 h-4" />
                            Orders
                          </Link>
                          <Link href="/account/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] rounded-lg transition-colors">
                            <Heart className="w-4 h-4" />
                            Wishlist
                          </Link>
                          <Link href="/account/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)] rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true, 'login')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </button>
                )}
              </div>

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
