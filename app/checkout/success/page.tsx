'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/app/lib/cartStore';
import { useAuthStore } from '@/app/lib/authStore';
import { getOrderByReference, Order } from '@/app/lib/firebase/orders';
import { Check, Download, ArrowRight, Printer, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPath = '/checkout/success';
  
  // Get necessary store functions
  const clearCart = useCartStore((state) => state.clearCart);
  const { user, isLoading } = useAuthStore();
  
  const reference = searchParams.get('reference');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  const orderDate = new Date().toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Check authentication and fetch order
  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/account/login?redirect=${currentPath}`);
      return;
    }

    const fetchOrder = async () => {
      if (!reference || !user) {
        setLoading(false);
        return;
      }

      const orderData = await getOrderByReference(reference, user.uid);
      setOrder(orderData);
      setLoading(false);
    };

    fetchOrder();
  }, [reference, user, isLoading, router]);

  useEffect(() => {
    // Clear the cart when success page loads
    clearCart();
  }, [clearCart]);

  const handleSaveReceipt = () => {
    window.print();
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-100 rounded-full mb-8 animate-pulse">
            <div className="w-8 h-8 bg-stone-200 rounded-full" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 animate-pulse">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!reference) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4">No Reference Found</p>
          <Link href="/shop" className="text-sm underline underline-offset-8 uppercase tracking-widest text-stone-900">
            Return to Gallery
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4">Order Not Found</p>
          <Link href="/account" className="text-sm underline underline-offset-8 uppercase tracking-widest text-stone-900">
            Go to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-6 lg:px-12 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        
        {/* Success Header */}
        <div className="text-center mb-16 print:hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-700 rounded-full mb-8 shadow-xl">
            <Check className="text-white" size={32} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.6em] text-stone-400 mb-3 font-medium">Order Confirmed</p>
          <h1 className="text-4xl font-light tracking-tight text-stone-900 mb-6">Thank you.</h1>
          
        </div>

        {/* The Digital Invoice */}
        <div className="bg-white border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden print:border-stone-200 print:shadow-none">
          <div className="p-8 lg:p-14">
            
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-16 border-b border-stone-50 pb-10">
              <div>
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-stone-900 mb-2">Your Receipt</h2>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">Transaction Ref: {reference}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1">Date of Issue</p>
                <p className="text-xs font-medium text-stone-900 uppercase tracking-tighter">{orderDate}</p>
              </div>
            </div>

            {/* Product Table */}
            <div className="space-y-8 mb-16">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-stone-300 font-bold">Your Selection</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center group">
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-stone-900 uppercase tracking-widest mb-1">{item.name}</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-tighter">
                        {item.variant ? `${item.variant} – ` : ''}Qty: {item.quantity} × KSh {item.price.toLocaleString()} {item.unit ? `/ ${item.unit}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-light text-stone-900">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-4 pt-10 border-t border-stone-100">
              <div className="flex justify-between text-[10px] text-stone-400 uppercase tracking-[0.2em]">
                <span>Subtotal</span>
                <span>KSh {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 uppercase tracking-[0.2em]">
                <span>Delivery</span>
                <span>KSh {order.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline pt-6">
                <span className="text-xs uppercase tracking-[0.4em] font-black text-stone-900">Amount Paid</span>
                <span className="text-3xl font-light text-stone-900 tracking-tighter">
                  KSh {order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer of Receipt */}
          <div className="bg-stone-50/50 px-8 py-6 flex justify-between items-center print:hidden border-t border-stone-50">
            <div className="flex items-center gap-2 text-[9px] text-stone-400 uppercase tracking-widest font-medium">
              <ShoppingBag size={12} /> Verification Successful
            </div>
            <button 
              onClick={handleSaveReceipt}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-900 hover:text-stone-500 transition-colors"
            >
              <Download size={14} /> Download
            </button>
          </div>
        </div>

        {/* Desktop/Mobile Action Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center print:hidden">
          <Link 
            href="/shop" 
            className="w-full sm:w-auto px-12 py-5 bg-green-700 text-white text-[10px] uppercase tracking-[0.4em] font-bold text-center hover:bg-green-800 transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            Continue Browsing <ArrowRight size={14} />
          </Link>
          <button 
            onClick={() => window.print()} 
            className="w-full sm:w-auto px-12 py-5 border border-stone-200 text-stone-500 text-[10px] uppercase tracking-[0.4em] font-bold text-center hover:bg-stone-50 hover:text-stone-900 transition-all flex items-center justify-center gap-3"
          >
            <Printer size={14} /> Print Offline
          </button>
        </div>

        {/* Print Only Disclaimer */}
        <div className="hidden print:block mt-32 text-center border-t border-stone-100 pt-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Thank you for choosing artisanal quality.</p>
          <p className="text-[8px] text-stone-300 mt-4 tracking-widest uppercase">Your Brand Name • Nairobi, Kenya</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          /* Hide everything except the receipt area */
          nav, footer, .print-hidden, button, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .min-h-screen {
            min-height: auto !important;
            padding: 0 !important;
          }
          /* Ensure the receipt takes full width in PDF */
          .max-w-3xl {
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-100 rounded-full mb-8 animate-pulse">
          <div className="w-8 h-8 bg-stone-200 rounded-full" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 animate-pulse">Loading order details...</p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SuccessContent />
    </Suspense>
  );
}