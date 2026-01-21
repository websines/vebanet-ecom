'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviews as mockReviews, getReviewSummary, getProductReviews } from '@/data/reviews';
import type { Review, ReviewSummary } from '@/types';

export function useProductReviews(productId: string) {
  return useQuery<Review[]>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return getProductReviews(productId);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useReviewSummary(productId: string) {
  return useQuery<ReviewSummary>({
    queryKey: ['review-summary', productId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getReviewSummary(productId);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      rating,
      title,
      content,
      userId,
      userName,
    }: {
      productId: string;
      rating: number;
      title: string;
      content: string;
      userId: string;
      userName: string;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newReview: Review = {
        id: `review-${Date.now()}`,
        productId,
        userId,
        userName,
        rating,
        title,
        content,
        isVerifiedPurchase: true,
        helpfulCount: 0,
        createdAt: new Date().toISOString(),
      };

      // In a real app, this would be an API call
      mockReviews.push(newReview);

      return newReview;
    },
    onSuccess: (_, variables) => {
      // Invalidate reviews cache for the product
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['review-summary', variables.productId] });
    },
  });
}

export function useMarkReviewHelpful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, productId }: { reviewId: string; productId: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const review = mockReviews.find((r) => r.id === reviewId);
      if (review) {
        review.helpfulCount += 1;
      }

      return { reviewId, productId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
    },
  });
}
