'use client';

import { useQuery } from '@tanstack/react-query';
import { products as mockProducts } from '@/data/products';
import { categories as mockCategories } from '@/data/categories';
import type { Product, Category } from '@/types';

// For demo, we use mock data. Replace with API calls when backend is ready.
// import api from '@/lib/api';

export function useProducts(params?: {
  categoryId?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery<Product[]>({
    queryKey: ['products', params],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      let filtered = [...mockProducts];

      if (params?.categoryId) {
        filtered = filtered.filter((p) => p.categoryId === params.categoryId);
      }

      if (params?.offset) {
        filtered = filtered.slice(params.offset);
      }

      if (params?.limit) {
        filtered = filtered.slice(0, params.limit);
      }

      return filtered;

      // When API is ready:
      // const response = await api.getProducts(params);
      // return response.products;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(slug: string) {
  return useQuery<Product | null>({
    queryKey: ['product', slug],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockProducts.find((p) => p.slug === slug) || null;

      // When API is ready:
      // const response = await api.getProduct(id);
      // return response.product;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockProducts.filter((p) => p.isFeatured);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useNewArrivals() {
  return useQuery<Product[]>({
    queryKey: ['products', 'new'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockProducts.filter((p) => p.isNew);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockCategories;

      // When API is ready:
      // const response = await api.getCategories();
      // return response.product_categories;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCategory(slug: string) {
  return useQuery<Category | null>({
    queryKey: ['category', slug],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return mockCategories.find((c) => c.slug === slug) || null;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useProductsByCategory(categorySlug: string) {
  return useQuery<Product[]>({
    queryKey: ['products', 'category', categorySlug],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const category = mockCategories.find((c) => c.slug === categorySlug);
      if (!category) return [];
      return mockProducts.filter((p) => p.categoryId === category.id);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useRelatedProducts(productId: string, categoryId: string) {
  return useQuery<Product[]>({
    queryKey: ['products', 'related', productId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockProducts
        .filter((p) => p.categoryId === categoryId && p.id !== productId)
        .slice(0, 4);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchProducts(query: string) {
  return useQuery<Product[]>({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (!query) return [];

      const lowercaseQuery = query.toLowerCase();
      return mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(lowercaseQuery) ||
          p.brand.toLowerCase().includes(lowercaseQuery) ||
          p.description.toLowerCase().includes(lowercaseQuery) ||
          p.tags.some((t) => t.toLowerCase().includes(lowercaseQuery))
      );
    },
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 2,
  });
}
