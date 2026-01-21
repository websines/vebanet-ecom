'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore, useUIStore } from '@/store/useStore';

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, getItemCount } = useCartStore();
  const { setCartOpen } = useUIStore();
  const itemCount = getItemCount();

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Cart Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            {itemCount > 0 && (
              <span className="px-2 py-0.5 bg-[var(--accent-subtle)] text-[var(--accent)] text-xs font-medium rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 mb-4 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-[var(--text-muted)] mb-6">
                Browse our products and add items to your cart
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="btn btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 p-4 bg-[var(--bg-tertiary)] rounded-xl"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-[var(--bg-elevated)] rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-[var(--text-muted)] text-xs font-mono">
                      {item.product.brand.slice(0, 3).toUpperCase()}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text-muted)] mb-1">
                      {item.product.brand}
                    </p>
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Total Items</span>
              <span className="font-semibold">{itemCount}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={clearCart}
                className="btn btn-secondary text-sm"
              >
                Clear Cart
              </button>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="btn btn-primary text-sm"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
