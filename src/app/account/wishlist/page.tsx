'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore, useCartStore, useNotificationStore } from '@/store/useStore';
import { products } from '@/data/products';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { addNotification } = useNotificationStore();

  const wishlistProducts = items
    .map((item) => products.find((p) => p.id === item.productId))
    .filter(Boolean);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addItem(product);
      addNotification({
        type: 'success',
        title: 'Added to cart',
        message: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
    addNotification({
      type: 'info',
      title: 'Removed from wishlist',
      message: 'Product removed from your wishlist.',
    });
  };

  const handleClearAll = () => {
    clearWishlist();
    addNotification({
      type: 'info',
      title: 'Wishlist cleared',
      message: 'All items have been removed from your wishlist.',
    });
  };

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach((product) => {
      if (product) {
        addItem(product);
      }
    });
    clearWishlist();
    addNotification({
      type: 'success',
      title: 'Added to cart',
      message: 'All wishlist items have been added to your cart.',
    });
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
        <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-gray-400 mb-6">
          Save items you love to your wishlist and come back to them later.
        </p>
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">My Wishlist</h2>
          <p className="text-gray-400 text-sm">
            {items.length} item{items.length > 1 ? 's' : ''} saved
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClearAll}
            className="px-4 py-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
          >
            Clear All
          </button>
          <button
            onClick={handleMoveAllToCart}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Add All to Cart
          </button>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wishlistProducts.map(
          (product) =>
            product && (
              <div
                key={product.id}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden group"
              >
                <div className="flex">
                  {/* Image */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="w-32 h-32 bg-gray-800 flex-shrink-0"
                  >
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="text-cyan-400 text-xs font-medium mb-1">
                        {product.brand}
                      </p>
                      <Link
                        href={`/product/${product.slug}`}
                        className="text-white font-medium hover:text-cyan-400 transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span
                        className={`text-sm ${
                          product.inStock
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemove(product.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={!product.inStock}
                          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-3 py-1.5 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
