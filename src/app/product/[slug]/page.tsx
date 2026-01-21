'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';
import { getProductBySlug, getProductsByCategory } from '@/data/products';
import { getCategoryById } from '@/data/categories';
import { useCartStore } from '@/store/useStore';
import { ProductCard } from '@/components/product/ProductCard';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-[var(--text-muted)] mb-8">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const category = getCategoryById(product.categoryId);
  const relatedProducts = getProductsByCategory(product.categoryId)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            {category && (
              <>
                <Link
                  href={`/category/${category.slug}`}
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  {category.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-[var(--text-primary)] truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-8xl font-bold text-[var(--text-muted)]/10">
                    {product.brand.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-3 py-1.5 bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-semibold rounded-lg">
                    NEW
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-3 py-1.5 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs font-semibold rounded-lg border border-[var(--border-default)]">
                    FEATURED
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Placeholders */}
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-xl bg-[var(--bg-secondary)] border-2 transition-colors ${
                    activeImage === index
                      ? 'border-[var(--accent)]'
                      : 'border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]/30 text-xs">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Brand */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[var(--accent-subtle)] text-[var(--accent)] text-sm font-medium rounded-full">
                {product.brand}
              </span>
              {product.inStock ? (
                <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                  <Check className="w-4 h-4" />
                  In Stock
                </span>
              ) : (
                <span className="text-sm text-red-400">Out of Stock</span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>

            {/* Short Description */}
            <p className="text-lg text-[var(--text-secondary)]">
              {product.shortDescription}
            </p>

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-3">
              {product.attributes.map((attr) => (
                <div
                  key={attr.name}
                  className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl"
                >
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    {attr.name}
                  </p>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {attr.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-2 p-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 btn btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              {/* Wishlist */}
              <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/50 transition-colors">
                <Heart className="w-5 h-5" />
              </button>

              {/* Share */}
              <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border-subtle)]">
              <div className="flex flex-col items-center text-center p-4">
                <Truck className="w-6 h-6 text-[var(--accent)] mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-[var(--text-muted)]">Orders over $100</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Shield className="w-6 h-6 text-[var(--accent)] mb-2" />
                <p className="text-sm font-medium">Warranty</p>
                <p className="text-xs text-[var(--text-muted)]">2 year coverage</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <RotateCcw className="w-6 h-6 text-[var(--accent)] mb-2" />
                <p className="text-sm font-medium">Free Returns</p>
                <p className="text-xs text-[var(--text-muted)]">30 day policy</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 pt-16 border-t border-[var(--border-subtle)]"
        >
          <h2 className="text-2xl font-bold mb-6">Product Description</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 pt-16 border-t border-[var(--border-subtle)]"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Related Products</h2>
              {category && (
                <Link
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-2 text-[var(--accent)] hover:underline"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href={category ? `/category/${category.slug}` : '/'}
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to {category?.name || 'Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
