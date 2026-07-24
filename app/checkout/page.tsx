'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Truck, Lock, User, MapPin, 
  CreditCard, Smartphone, AlertCircle, ChevronLeft,
  Banknote
} from 'lucide-react';
import { useCartStore } from '../lib/cartStore';
import { useAuthStore } from '../lib/authStore';
import { saveOrder } from '../lib/firebase/orders';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPath = '/checkout';
  const { items, getTotalPrice } = useCartStore();
  const { user, isLoading } = useAuthStore();
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication
  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/account/login?redirect=${currentPath}`);
    }
  }, [user, isLoading, router, currentPath]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryNotes: '',
    paymentMethod: 'mobile' as 'card' | 'mobile' | 'cash',
  });

  // Load saved checkout data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('checkoutData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          name: prev.name || parsed.name || '',
          email: prev.email || parsed.email || '',
          phone: parsed.phone || '',
          address: parsed.address || '',
          deliveryNotes: parsed.deliveryNotes || '',
        }));
      } catch (e) {
        console.error('Error parsing saved checkout data:', e);
      }
    }
  }, []);

  // Save checkout data to localStorage when form changes
  useEffect(() => {
    if (formData.phone || formData.address || formData.name || formData.deliveryNotes) {
      localStorage.setItem('checkoutData', JSON.stringify(formData));
    }
  }, [formData]);

  const totalPrice = getTotalPrice();
  const deliveryFee = 150;
  const grandTotal = totalPrice + deliveryFee;

  const displayTotalPrice = mounted ? totalPrice : 0;
  const displayGrandTotal = mounted ? grandTotal : deliveryFee;
  const displayItems = mounted ? items : [];

  useEffect(() => {
    if (items.length === 0 && !loading) router.push('/shop');
  }, [items, router, loading]);

  // Auto-fill user data when logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email';
    
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^(?:\+?254|0)([17]\d{8})$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid Kenyan phone number (e.g. 0712345678)';
    }

    if (!formData.address.trim()) errors.address = 'Delivery address is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let cleanedValue = value;

    // Basic phone cleanup (optional — remove spaces & only allow digits + +)
    if (name === 'phone') {
      cleanedValue = value.replace(/[^0-9+]/g, '');
      if (cleanedValue.startsWith('0')) cleanedValue = '+254' + cleanedValue.slice(1);
    }

    setFormData(prev => ({ ...prev, [name]: cleanedValue }));

    // Clear error when user starts fixing it
    if (fieldErrors[name] && cleanedValue.trim()) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const processPayment = async () => {
    setSubmitAttempted(true);

    if (!validateForm()) {
      setError('Please complete all required fields correctly.');
      return;
    }

    if (loading) return; // prevent double-click

    // Handle cash payment separately
    if (formData.paymentMethod === 'cash') {
      setLoading(true);
      setError(null);

      try {
        if (user) {
          const orderItems = items.map(item => ({
            productId: item.product.id || item.cartItemId,
            name: item.product.name || 'Unknown Product',
            price: item.selectedVariant ? item.selectedVariant.price : (item.product.price ?? 0),
            quantity: item.quantity,
            unit: item.product.unit ?? '',
            variant: item.selectedVariant ? item.selectedVariant.size : '',
          }));

          // Generate a unique reference for cash order - use same reference for saving and redirect
          const cashRef = `CASH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          await saveOrder(user, {
            userName: formData.name.trim() || 'Customer',
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            deliveryNotes: formData.deliveryNotes.trim() || '',
            items: orderItems,
            subtotal: totalPrice || 0,
            deliveryFee: deliveryFee || 0,
            total: grandTotal || 0,
            paymentReference: cashRef,
            paymentMethod: 'cash',
          });
          
          // Redirect to success page with SAME cash reference that was saved
          router.push(`/checkout/success?reference=${cashRef}`);
        }
      } catch (err: any) {
        console.error('Cash order error:', err);
        setError('Failed to place order. Please try again.');
        setLoading(false);
      }
      return;
    }

    // Online payment (card or mobile money)
    setLoading(true);
    setError(null);

    try {
      const PaystackPop = (await import('@paystack/inline-js')).default;
      const paystack = new PaystackPop();

      await paystack.checkout({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email: formData.email.trim(),
        amount: Math.round(grandTotal * 100),
        currency: 'KES',
        channels: formData.paymentMethod === 'mobile' ? ['mobile_money'] : ['card'],
        metadata: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          delivery_notes: formData.deliveryNotes.trim(),
          cart_items_count: items.length,
        },
        onClose: () => {
          setLoading(false);
        },
        callback: async (response: any) => {
          // Save order to Firebase before redirecting
          if (user) {
            const orderItems = items.map(item => ({
              productId: item.product.id || item.cartItemId,
              name: item.product.name || 'Unknown Product',
              price: item.selectedVariant ? item.selectedVariant.price : (item.product.price ?? 0),
              quantity: item.quantity,
              unit: item.product.unit ?? '',
              variant: item.selectedVariant ? item.selectedVariant.size : '',
            }));

            await saveOrder(user, {
              userName: formData.name.trim() || 'Customer',
              phone: formData.phone.trim(),
              address: formData.address.trim(),
              deliveryNotes: formData.deliveryNotes.trim() || '',
              items: orderItems,
              subtotal: totalPrice || 0,
              deliveryFee: deliveryFee || 0,
              total: grandTotal || 0,
              paymentReference: response.reference || '',
              paymentMethod: formData.paymentMethod,
            });
          }
          router.push(`/checkout/success?reference=${response.reference}`);
        },
      });
    } catch (err: any) {
      console.error('Payment init error:', err);
      setError(
        err?.message?.includes('key') 
          ? 'Payment service configuration error. Please contact support.'
          : 'Failed to start payment. Please check your connection and try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-700 transition-colors"
          >
            <ChevronLeft size={18} /> Back to Shop
          </button>
          <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
          <div className="w-20" />
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-sm font-medium hidden sm:inline">Details</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-sm font-medium hidden sm:inline">Payment</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold">3</div>
              <span className="text-sm font-medium text-gray-500 hidden sm:inline">Confirm</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Form */}
          <div className="lg:col-span-7 space-y-8">
             
            {/* Step 1: Contact & Delivery */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs">1</span>
                Contact & Delivery Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${submitAttempted && fieldErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {submitAttempted && fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    readOnly={!!user}
                    disabled={!!user}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${user ? 'bg-gray-50 cursor-not-allowed' : ''} ${submitAttempted && fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {submitAttempted && fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0712 345 678"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${submitAttempted && fieldErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {submitAttempted && fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g., Ngong Road, Greenhouse, 4th Floor"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${submitAttempted && fieldErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {submitAttempted && fieldErrors.address && <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes (optional)</label>
                  <textarea
                    name="deliveryNotes"
                    value={formData.deliveryNotes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for delivery?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentOption
                  active={formData.paymentMethod === 'mobile'}
                  onClick={() => setFormData(p => ({...p, paymentMethod: 'mobile'}))}
                  icon={<Smartphone size={24} />}
                  title="M-Pesa"
                  subtitle="Pay with mobile money"
                />
                <PaymentOption
                  active={formData.paymentMethod === 'cash'}
                  onClick={() => setFormData(p => ({...p, paymentMethod: 'cash'}))}
                  icon={<Banknote size={24} />}
                  title="Cash on Delivery"
                  subtitle="Pay when you receive"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Your Order</h2>
              
              <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto">
                {displayItems.map(item => (
                  <div key={item.cartItemId} className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                        {item.selectedVariant && ` × ${item.selectedVariant.size}`}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      KSh {((item.selectedVariant ? item.selectedVariant.price : (item.product.price ?? 0)) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>KSh {displayTotalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>KSh {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-blue-700">KSh {displayGrandTotal.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 flex gap-2 text-red-600 text-sm items-center bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button
                onClick={processPayment}
                disabled={loading || displayItems.length === 0}
                className="mt-6 w-full bg-blue-700 text-white py-4 text-base font-bold rounded-lg hover:bg-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : `Pay KSh ${displayGrandTotal.toLocaleString()}`}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Lock size={14} /> Secure payment powered by Paystack
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Simple input component
function SimpleInput({ label, error, required, className = '', ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

// Payment option component
function PaymentOption({ active, onClick, icon, title, subtitle }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 border-2 rounded-xl transition-all text-left ${
        active ? 'border-blue-700 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className={`${active ? 'text-blue-700' : 'text-gray-400'}`}>{icon}</div>
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </button>
  );
}