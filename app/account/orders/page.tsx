// app/account/orders/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/lib/authStore';
import { getUserOrders, Order } from '@/app/lib/firebase/orders';
import { Package, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPath = '/account/orders';
  const { user, isLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/account/login?redirect=${currentPath}`);
    }
  }, [user, isLoading, router, currentPath]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light text-stone-900">My Orders</h1>
        <Link
          href="/account"
          className="text-sm text-blue-700 hover:text-blue-800 font-medium"
        >
          Back to Account
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white  shadow-sm p-12 text-center">
          <Package className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-stone-900 mb-2">No orders yet</h2>
          <p className="text-stone-600 mb-6">When you place orders, they will appear here.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-blue-700 text-white px-6 py-3  hover:bg-blue-800 transition-colors"
          >
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white  shadow-sm border border-stone-100 overflow-hidden">
              <div className="bg-stone-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-wider text-stone-500">Order</span>
                  <span className="text-sm font-medium text-stone-900">{order.id?.slice(0, 8).toUpperCase()}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">Date</p>
                    <p className="text-sm font-medium text-stone-900">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">Payment Ref</p>
                    <p className="text-sm font-medium text-stone-900">{order.paymentReference}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">Total</p>
                    <p className="text-sm font-medium text-stone-900">KSh {order.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4">
                  <p className="text-xs uppercase tracking-wider text-stone-400 mb-3">Items</p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-stone-700">
                          {item.variant ? `${item.variant} – ` : ''}{item.quantity} × {item.name}
                        </span>
                        <span className="text-stone-500">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>}>
      <OrdersContent />
    </Suspense>
  );
}
