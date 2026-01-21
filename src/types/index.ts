// Product & Category Types for Vebanet

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  parentId?: string;
  productCount: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  shortDescription: string;
  images: string[];
  categoryId: string;
  attributes: ProductAttribute[];
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
}

// UI State Types
export interface UIState {
  isMenuOpen: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  activeCategory: string | null;
}

// Filter Types
export interface ProductFilters {
  brands: string[];
  inStock: boolean | null;
  attributes: Record<string, string[]>;
  sortBy: 'name' | 'newest' | 'brand';
}
