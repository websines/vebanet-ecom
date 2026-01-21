'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { mockOrders } from '@/data/orders';
import type { OrderStatus } from '@/types';

const statusConfig: Record<
  OrderStatus,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  pending: { icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  confirmed: { icon: CheckCircle, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  processing: { icon: Package, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  shipped: { icon: Truck, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  delivered: { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  cancelled: { icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  refunded: { icon: XCircle, color: 'text-gray-400', bgColor: 'bg-gray-500/10' },
};

export default function OrdersPage() {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const filteredOrders =
    filter === 'all'
      ? mockOrders
      : mockOrders.filter((order) => order.status === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">Order History</h2>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'processing', 'shipped', 'delivered'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === status
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No orders found
          </h3>
          <p className="text-gray-400 mb-6">
            {filter === 'all'
              ? "You haven't placed any orders yet."
              : `You don't have any ${filter} orders.`}
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Start Shopping
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;

            return (
              <div
                key={order.id}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-semibold">
                          Order #{order.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].bgColor} ${statusConfig[order.status].color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {order.items.length} item
                        {order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 space-y-4">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-800 rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {order.items.length > 2 && (
                    <p className="text-gray-500 text-sm">
                      + {order.items.length - 2} more item
                      {order.items.length - 2 > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {order.trackingNumber ? (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                    >
                      <Truck className="w-4 h-4" />
                      Track Package
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Tracking available once shipped
                    </span>
                  )}

                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-2 text-white hover:text-cyan-400 transition-colors text-sm font-medium"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
