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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin  h-8 w-8 border-b-2 border-blue-700"></div></div>}>
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
    <div className="min-h-screen bg-[#FDFDFD] text-blue-700">
      {/* Top Navigation – unchanged */}
      <nav className="border-b border-stone-100 bg-white/80 backdrop-blur-md  top-0">
        <div className="max-w-7xl mx-auto px-0 h-20 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs  tracking-[0.2em] text-stone-400 hover:text-blue-700 transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <h1 className="text-xs  tracking-[0.1em] font-light">Secure checkout</h1>
          <div className="w-10" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: Information Flow – only added error display */}
          <div className="lg:col-span-7 space-y-16">
            
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8  bg-blue-700 text-white flex items-center justify-center text-xs">1</span>
                <h2 className="md:text-lg text-sm  tracking-wider font-light">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FloatingInput 
                  label="Full Name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="John Doe"
                  error={submitAttempted ? fieldErrors.name : undefined}
                  required
                />
                <FloatingInput 
                  label="Email Address" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder={user ? undefined : "john@example.com"}
                  error={submitAttempted ? fieldErrors.email : undefined}
                  required
                  readOnly={!!user}
                  disabled={!!user}
                  className={user ? 'cursor-not-allowed bg-stone-50' : ''}
                />
                <div className="md:col-span-2">
                  <FloatingInput 
                    label="Phone Number" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="0712 345 678"
                    error={submitAttempted ? fieldErrors.phone : undefined}
                    required
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8  bg-blue-700 text-white flex items-center justify-center text-xs">2</span>
                <h2 className="md:text-lg text-sm  tracking-wider font-light">Shipping Details</h2>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-stone-50 border border-stone-100 text-xs  tracking-tighter text-stone-500 flex justify-between">
                  <span>Current Region</span>
                  <span className="font-semibold text-blue-700">Nairobi, Kenya</span>
                </div>
                <FloatingInput 
                  label="Street Address / Apartment / Suite" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  placeholder="Ngong Road, Greenhouse, 4th Floor"
                  error={submitAttempted ? fieldErrors.address : undefined}
                  required
                />
                <textarea
                  name="deliveryNotes"
                  value={formData.deliveryNotes}
                  onChange={handleInputChange}
                  placeholder="Notes for our courier (optional)"
                  className="w-full bg-transparent border-b border-stone-200 py-3 focus:border-blue-700 outline-none transition-colors resize-none text-sm min-h-[100px]"
                />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8  bg-blue-700 text-white flex items-center justify-center text-xs">3</span>
                <h2 className="md:text-lg text-sm  tracking-wider font-light">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PaymentOption 
                  active={formData.paymentMethod === 'mobile'} 
                  onClick={() => setFormData(p => ({...p, paymentMethod: 'mobile'}))}
                  icon={<Smartphone size={20} />}
                  title="Mobile Money"
                  subtitle="M-Pesa / Airtel Money"
                />
                <PaymentOption 
                  active={formData.paymentMethod === 'cash'} 
                  onClick={() => setFormData(p => ({...p, paymentMethod: 'cash'}))}
                  icon={<Banknote size={20} />}
                  title="Pay Cash"
                  subtitle="Pay upon delivery"
                />
                <PaymentOption 
                  active={formData.paymentMethod === 'card'} 
                  onClick={() => setFormData(p => ({...p, paymentMethod: 'card'}))}
                  icon={<CreditCard size={20} />}
                  title="Card Payment"
                  subtitle="Visa / Mastercard"
                />
              </div>
            </section>
          </div>

          {/* RIGHT: Summary – unchanged layout */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-white border border-stone-100 p-8 lg:p-12 shadow-sm">
              <h2 className="text-xs  tracking-[0.3em] text-stone-400 mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {displayItems.map(item => (
                  <div key={item.cartItemId} className="flex gap-4 items-center">
                    <div className="w-16 aspect-square bg-stone-50 overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt="" className="w-full h-full object-cover grayscale-[0.2]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs  font-medium tracking-wider">{item.product.name}</h4>
                      <p className="text-xs text-stone-400">
                        {item.selectedVariant 
                          ? `Qty ${item.quantity} × ${item.selectedVariant.size} – KSh ${item.selectedVariant.price.toLocaleString()}` 
                          : `Qty ${item.quantity} × KSh ${item.product.price ?? 0}`}
                      </p>
                    </div>
                    <span className="text-sm font-light">
                      KSh {((item.selectedVariant ? item.selectedVariant.price : (item.product.price ?? 0)) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-stone-100 text-sm">
                <div className="flex justify-between font-light text-stone-500">
                  <span>Subtotal</span>
                  <span>KSh {displayTotalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-light text-stone-500">
                  <span>Delivery</span>
                  <span>KSh {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-4">
                  <span className=" tracking-widest text-xs self-center">Total</span>
                  <span>KSh {displayGrandTotal.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mt-6 flex gap-2 text-red-600 text-xs items-center bg-red-50 p-3">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button
                onClick={processPayment}
                disabled={loading || displayItems.length === 0}
                className="mt-8 w-full bg-blue-700 text-white py-5  tracking-[0.3em] text-sm font-bold hover:bg-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading 
                  ? 'Processing...' 
                  : `Pay — KSh ${displayGrandTotal.toLocaleString()}`
                }
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px]  tracking-widest text-stone-400">
                <Lock size={12} /> Encrypted & Secure Payment
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Updated FloatingInput with error support — style unchanged
function FloatingInput({ label, error, required, className = '', ...props }: any) {
  return (
    <div className="flex flex-col border-b border-stone-200 py-2 focus-within:border-blue-700 transition-colors">
      <label className="text-[10px]  tracking-[0.2em] text-stone-400 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input 
        {...props} 
        className={`bg-transparent outline-none text-sm placeholder:text-stone-200 ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.name}-error` : undefined}
      />
      {error && (
        <p id={`${props.name}-error`} className="text-[10px] text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

// PaymentOption unchanged
function PaymentOption({ active, onClick, icon, title, subtitle }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-4 p-5 border transition-all text-left ${
        active ? 'border-blue-700 bg-stone-50' : 'border-stone-100 hover:border-stone-300'
      }`}
    >
      <div className={`${active ? 'text-blue-700' : 'text-stone-300'}`}>{icon}</div>
      <div>
        <p className="text-xs  tracking-wider font-semibold">{title}</p>
        <p className="text-[10px] text-stone-400 mt-1">{subtitle}</p>
      </div>
    </button>
  );
}