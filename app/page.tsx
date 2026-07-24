'use client';
import { products } from './shop/products';
import ProductCard from '@/app/components/shop/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { GiShoppingCart, GiCarWheel, GiCarBattery, GiCog, GiCrackedDisc, GiWrench } from 'react-icons/gi';
import { Quote, Star, Truck, Phone, MessageCircle } from 'lucide-react';
import { useState, useEffect, useRef, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaShopify } from 'react-icons/fa';

// Simplified categories for homepage
const categories = [
  { id: 1, name: 'Engine Parts', icon: GiCog, description: 'Engines, gaskets & timing' },
  { id: 2, name: 'Brake Systems', icon: GiCrackedDisc, description: 'Pads, discs & fluid' },
  { id: 3, name: 'Tires & Wheels', icon: GiCarWheel, description: 'Tires, rims & caps' },
  { id: 4, name: 'Electrical', icon: GiCarBattery, description: 'Batteries, starters & lights' },
  { id: 5, name: 'Filters', icon: GiWrench, description: 'Oil, air & fuel filters' },
  { id: 6, name: 'Body Parts', icon: GiWrench, description: 'Bumpers, mirrors & lights' },
];

const testimonials = [
  {
    name: "James Kariuki",
    role: "Car Owner, Nairobi",
    text: "Found exactly what I needed for my Toyota. Fast delivery and fair prices!",
  },
  {
    name: "Sarah Wanjiku",
    role: "Mechanic, Westlands",
    text: "Reliable parts and excellent service. They deliver right to my workshop.",
  },
  {
    name: "David Ochieng",
    role: "Fleet Manager, Industrial Area",
    text: "Best auto parts supplier in Nairobi. Quality products every time.",
  }
];

export default function AutoPartsLandingPage() {
  // Get first 4 products from each main category
  const popularEngineParts = products.filter(p => p.category === 'Engine Parts').slice(0, 4);
  const popularBrakeSystems = products.filter(p => p.category === 'Brake Systems').slice(0, 4);
  const featuredElectrical = products.filter(p => p.category === 'Electrical').slice(0, 4);
  const featuredTiresWheels = products.filter(p => p.category === 'Tires & Wheels').slice(0, 4);
  const accessoriesProducts = products.filter(p => p.category === 'Accessories').slice(0, 4);

  // Testimonial carousel state
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeTestimonial = testimonials[testimonialIndex];

  // Auto-rotate testimonials
  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    };
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* --- Hero Section --- */}
      <section className="relative w-full bg-blue-700 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Pattywapat Autospares
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-2 font-medium">
            Quality Auto Parts Delivered Across Nairobi
          </p>
          <p className="text-sm text-blue-200 mb-8">
            M-Pesa Till: <span className="font-bold text-white text-lg">213528</span>
          </p>

          {/* Big Search Bar */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-700 font-bold text-lg rounded-full shadow-xl hover:bg-blue-50 transition-all mb-8"
          >
            <GiShoppingCart size={24} />
            Start Shopping
          </Link>

          {/* Quick Contact */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a href="tel:+254712345678" className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-500 transition">
              <Phone size={16} /> Call Us
            </a>
            <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-full hover:bg-green-500 transition">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">How to Order</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
            <h3 className="font-bold text-lg mb-2">Browse or Search</h3>
            <p className="text-gray-600 text-sm">Find the parts you need using categories or the search bar</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
            <h3 className="font-bold text-lg mb-2">Add to Cart</h3>
            <p className="text-gray-600 text-sm">Select your parts and add them to your shopping cart</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
            <h3 className="font-bold text-lg mb-2">Checkout & Deliver</h3>
            <p className="text-gray-600 text-sm">Pay via M-Pesa and get your parts delivered anywhere in Nairobi</p>
          </div>
        </div>
      </section>

      {/* --- Popular Categories --- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link href="/shop" className="text-blue-700 font-medium hover:underline text-sm">View All Categories →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.name}`}
              className="border-2 border-blue-100 bg-white hover:border-blue-500 hover:shadow-lg rounded-xl p-4 flex flex-col items-center gap-2 transition-all text-center"
            >
              <div className="text-blue-700">
                <cat.icon size={32} />
              </div>
              <span className="font-bold text-sm">{cat.name}</span>
              <span className="text-xs text-gray-500">{cat.description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- Popular Engine Parts --- */}
      <section className="max-w-6xl mx-auto px-4 py-12 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Engine Parts</h2>
          <Link href="/shop?category=Engine Parts" className="text-blue-700 font-medium hover:underline text-sm">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {popularEngineParts.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>
      </section>

      {/* --- Popular Brake Systems --- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Brake Systems</h2>
          <Link href="/shop?category=Brake Systems" className="text-blue-700 font-medium hover:underline text-sm">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {popularBrakeSystems.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>
      </section>

      {/* --- Featured Electrical --- */}
      <section className="max-w-6xl mx-auto px-4 py-12 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Electrical Parts</h2>
          <Link href="/shop?category=Electrical" className="text-blue-700 font-medium hover:underline text-sm">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {featuredElectrical.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>
      </section>

      {/* --- Featured Tires & Wheels --- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tires & Wheels</h2>
          <Link href="/shop?category=Tires & Wheels" className="text-blue-700 font-medium hover:underline text-sm">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {featuredTiresWheels.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>
      </section>

      {/* --- Accessories --- */}
      <section className="max-w-6xl mx-auto px-4 py-12 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Accessories</h2>
          <Link href="/shop?category=Accessories" className="text-blue-700 font-medium hover:underline text-sm">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {accessoriesProducts.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>
      </section>

      {/* --- Customer Reviews --- */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">What Our Customers Say</h2>
        <div className="bg-blue-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Quote size={48} className="mx-auto mb-4 text-blue-300" strokeWidth={1} />
              <p className="text-lg md:text-xl font-light leading-relaxed mb-6 max-w-2xl mx-auto">
                "{activeTestimonial.text}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {activeTestimonial.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-bold">{activeTestimonial.name}</p>
                  <p className="text-sm text-blue-200">{activeTestimonial.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === testimonialIndex ? 'bg-white w-8' : 'bg-blue-400 w-2'
                }`}
                aria-label={`View testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="bg-blue-700 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8">Browse our full catalog of quality auto parts or get in touch with us directly.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/shop" className="px-8 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition shadow-lg">
              Browse All Parts
            </Link>
            <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-500 transition shadow-lg flex items-center gap-2">
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
