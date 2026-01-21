'use client';

import { useQuery } from '@tanstack/react-query';
import { mockOrders, getOrdersByUser, getOrderById } from '@/data/orders';
import type { Order } from '@/types';

export function useOrders(userId?: string) {
  return useQuery<Order[]>({
    queryKey: ['orders', userId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (userId) {
        return getOrdersByUser(userId);
      }
      return mockOrders;

      // When API is ready:
      // const response = await api.getOrders();
      // return response.orders;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useOrder(orderId: string) {
  return useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getOrderById(orderId) || null;

      // When API is ready:
      // const response = await api.getOrder(orderId);
      // return response.order;
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 2,
  });
}
