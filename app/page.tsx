'use client';
import { products } from './shop/products';
import ProductCard from '@/app/components/shop/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { GiShoppingCart } from 'react-icons/gi';
import { Apple, Leaf, Quote, Star, Truck } from 'lucide-react';
import { useState, useEffect, useRef, Suspense } from 'react';
import { GiPlantRoots } from "react-icons/gi";
import { PiPlantFill } from "react-icons/pi";
import { GiWaterBottle } from "react-icons/gi";
import { AnimatePresence, motion } from 'framer-motion';
import { FaShopify } from 'react-icons/fa';
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { FaShoppingBasket } from "react-icons/fa";



// Categories & Special Offers
const categories = [
  { id: 1, name: 'Fruits', icon: <Apple className="w-8 h-8" /> },
  { id: 2, name: 'Vegetables', icon: <PiPlantFill className="w-8 h-8" /> },
  { id: 3, name: 'Tubers', icon: <GiPlantRoots className="w-8 h-8" /> },
  { id: 4, name: 'Juices', icon: <GiWaterBottle className="w-8 h-8" /> },
];

const specialOffers = [
  { id: 1, name: 'First Time Customer', icon: <FaShoppingBasket className="w-8 h-8" />, discount: '10% OFF' },
  { id: 2, name: 'Fresh Herbs', icon: <Leaf className="w-8 h-8" />, discount: '15% OFF' },
  { id: 3, name: 'Bulk Orders', icon: <FaShopify className="w-8 h-8" />, discount: 'FREE Delivery' },
  { id: 4, name: 'Express Delivery', icon: <GiFullMotorcycleHelmet className="w-8 h-8" />, discount: '24/7 Service' },
];

const testimonials = [
  {
    name: "Nyambura Kamau",
    role: "Home Cook",
    text: "Their vegetables taste like they were picked an hour ago. My family notices the difference.",
    image: "/images/Contact-us.svg"
  },
  {
    name: "Daniel Omondi",
    role: "Restaurant Owner",
    text: "Consistency is everything in our kitchen. Pemafarm delivers it, week after week.",
    image: "/images/Contact-us.svg"
  },
  {
    name: "Wanjiku Mwangi",
    role: "CSA Member",
    text: "Knowing exactly where my food comes from brings me peace of mind. The flavor is a bonus.",
    image: "/images/Contact-us.svg"
  }
];

export default function GroceryLandingPage() {

  // Get first 4 products from Fruits category
  const popularFruits = products
    .filter(product => product.category === 'Fruits')
    .slice(0, 4);

  // Get first 4 products from Vegetables category
  const popularVegetables = products
    .filter(product => product.category === 'Vegetables')
    .slice(0, 4);

  // Get first 4 products from Fruit Juices category
  const featuredJuices = products
    .filter(product => product.category === 'Fruit Juices')
    .slice(0, 4);

  // Get first 4 products from Tubers category
  const featuredTubers = products
    .filter(product => product.category === 'Tubers')
    .slice(0, 4);

  // Get first 4 products from "Other" category
  const otherProducts = products
    .filter(product => product.category === 'Other')
    .slice(0, 4);

  // Get first 4 products from Fresh Smoothies or Green Smoothies
  const smoothiesProducts = products
    .filter(product => product.category === 'Fresh Smoothies' || product.category === 'Green Smoothies')
    .slice(0, 4);

  const [activeIndex] = useState(0);
  
  // Testimonial carousel state
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTestimonial = testimonials[testimonialIndex];

  // Auto-rotate logic for testimonials
  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
      }, 6000);
    };

    startInterval();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testimonials.length]);

  // Pause on hover over avatar area
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handleMouseLeave = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
      }, 6000);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testimonials.length]);

  const handleTestimonialClick = (index: number) => {
    setTestimonialIndex(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
  };

  // Mobile rotating phrases
  const mobilePhrases = [
    { text: "Pemafarm", icon: null, color: "text-orange-700", isMain: true },
    { text: "Delivery", icon: <GiFullMotorcycleHelmet className="w-12 h-12" />, color: "text-green-700", isMain: false },
    { text: "Discounts", icon: <FaShopify className="w-10 h-10 fill-current" />, color: "text-black", isMain: false },
  ];

  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % mobilePhrases.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Desktop rotating message sets
  const desktopSets = [
    ["Pemafarm", "Freshness", "To Your Doorstep"],
    ["Farm Fresh", "Direct", "To Your Door"],
    ["PemaFarm", "Quality", "Delivered Fast"],
  ];

  const [setIndex, setSetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSetIndex((prev) => (prev + 1) % desktopSets.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const currentWords = desktopSets[setIndex];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* --- Hero Section --- */}
      <section className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero2.jpg"
            alt="Fresh Vegetables"
            fill
            className="hidden md:block object-center object-contain"
            priority
          />
          <Image
            src="/hero.png"
            alt="Fresh Vegetables"
            fill
            className="block md:hidden object-center object-contain"
            priority
          />
          <div className="absolute inset-0 bg-gray-800/30" />
        </div>

        {/* Desktop layout */}
        <div className="relative z-10 h-full max-w-5xl mx-auto px-4 hidden md:flex flex-row justify-between items-center text-white">
          <div className="flex flex-col gap-1 mb-4">
            <AnimatePresence mode="wait">
              <div key={setIndex} className="flex flex-col gap-1">
                {currentWords.map((word, i) => (
                  <motion.div
                    key={`${setIndex}-${i}`}
                    initial={{ opacity: 0, x: -120 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -80 }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <h1
                      className={
                        i === 0
                          ? "text-4xl md:text-3xl text-orange-700 font-black uppercase leading-none tracking-[0.05em]"
                          : i === 1
                          ? "text-3xl md:text-3xl font-bold text-green-700 uppercase leading-none opacity-90 tracking-[0.05em]"
                          : "text-4xl new font-bold text-black leading-none opacity-80"
                      }
                    >
                      {word}
                    </h1>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-white/90 backdrop-blur-sm px-6 py-4  shadow-xl">
              <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Till</p>
              <p className="text-3xl md:text-4xl font-black text-green-700 tracking-tight">213528</p>
            </div>
          </div>
          <Link
            href="/shop"
            className="absolute bottom-8 left-4 w-fit px-8 py-3 bg-green-700 hover:bg-green-800 text-base text-white font-bold rounded-full transition-all transform  shadow-lg flex items-center gap-2"
          >
            Visit Our Store Now <GiShoppingCart size={18} />
          </Link>
        </div>

        {/* Mobile layout */}
        <div className="relative z-10 h-full max-w-5xl mx-auto px-4 flex md:hidden flex-col justify-between text-white">
          {/* Till number floating at top of image */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-0  shadow-lg">
              <p className="text-sm text-orange-700  tracking-wider font-semibold">Till <span className="text-xl  font-black text-green-600">213528</span></p>
             
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-0 pt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileIndex}
                initial={{ opacity: 0, x: 120 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -120 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-center justify-center gap-3 ${mobilePhrases[mobileIndex].color}`}
              >
                {/* Icon appears first */}
                {mobilePhrases[mobileIndex].icon && (
                  <motion.div
                    initial={{ opacity: 0, x: 35 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                  className='pb-3 '
                  >
                    {mobilePhrases[mobileIndex].icon}
                  </motion.div>
                )}

                {/* Text appears slightly later */}
                <motion.h1
                  initial={{ opacity: 0, x: 45 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                  className={`font-black  leading-none tracking-[0.1em] new ${
                    mobilePhrases[mobileIndex].isMain ? "text-5xl" : "text-4xl"
                  }`}
                >
                  {mobilePhrases[mobileIndex].text}
                </motion.h1>
              </motion.div>
            </AnimatePresence>
          </div>

          <div></div>

          <div className="flex justify-center pb-4">
            <Link
              href="/shop"
              className="px-8 py-3 bg-green-700 hover:bg-green-800 text-base text-white font-bold rounded-full transition-all transform  shadow-2xl flex items-center gap-2"
            >
              Visit Our Store Now <GiShoppingCart size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- Popular Categories --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap newn ">Popular Categories</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.name}`}
              className="border border-green-200 bg-green-50 hover:border-green-500 group transition-all rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:shadow-lg"
            >
              <div className="text-green-800/50 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- Popular Fruits --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap">Popular Fruits</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4 sm:gap-6">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {popularFruits.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>
      </section>
      <div className="flex justify-center md:justify-end ">
          <Link
            href="/shop?category=Fruits"
            className="inline-flex items-center gap-2 px-8 py-2 bg-green-50 hover:bg-green-600 text-black tracking-widest rounded-full transition-colors text-sm border border-green-200"
          >
            View All Fruits <GiShoppingCart size={16} />
          </Link>
        </div>

      {/* --- Popular Vegetables --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap">Popular Vegetables</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4 sm:gap-6">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {popularVegetables.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>
      </section>
      <div className="flex justify-center md:justify-end">
          <Link
            href="/shop?category=Vegetables"
            className="inline-flex items-center gap-2 px-8 py-2 bg-green-50 hover:bg-green-600 text-black tracking-widest rounded-full transition-colors text-sm border border-green-200"
          >
            View All Vegetables <GiShoppingCart size={18} />
          </Link>
        </div>

      {/* --- Special Offers --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap">Special Offers</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {specialOffers.map((offer) => (
            <div
              key={offer.id}
              className="border border-green-200 bg-green-50 hover:border-green-500 group transition-all rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:shadow-lg"
            >
              <div className="text-green-800/50 group-hover:scale-110 transition-transform">
                {offer.icon}
              </div>
              <div className="text-center">
                <span className="text-sm font-medium block">{offer.name}</span>
                <span className="text-xs text-green-800 font-bold mt-1">{offer.discount}</span>
              </div>
            </div>
          ))}
        </div>
        
      </section>

      {/* --- Featured Juices --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap">Featured Juices</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {featuredJuices.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>

        <div className="flex justify-center md:justify-end">
          <Link
            href="/shop?category=Juices"
            className="inline-flex items-center gap-2 px-8 py-2 bg-green-50 hover:bg-green-600 text-black tracking-widest rounded-full transition-colors text-sm border border-green-200"
          >
            View All Juices <GiShoppingCart size={18} />
          </Link>
        </div>
      </section>

      {/* --- Featured Tubers --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap">Featured Tubers</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {featuredTubers.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>

        <div className="flex justify-center md:justify-end">
          <Link
            href="/shop?category=Tubers"
            className="inline-flex items-center gap-2 px-8 py-2 bg-green-50 hover:bg-green-600 text-black tracking-widest rounded-full transition-colors text-sm border border-green-200"
          >
            View All Tubers <GiShoppingCart size={18} />
          </Link>
        </div>
      </section>

      {/* ===== TESTIMONIAL ===== */}
      <section className="max-w-7xl mx-2 py-0">
        <div className="flex items-center gap-4 md:mb-8">
         
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap">Customer Feedback</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        
        <div className="flex flex-col md:px-4 md:flex-row gap-12 md:gap-20 items-center md:py-2">
          <div className="md:w-2/5">
            <h2 className="hidden md:block font-serif text-lg mt-3 mb-6 text-[#364735]">
              Not reviews. 
              <span className="italic block font-light">Conversations.</span>
            </h2>
            <p className="hidden md:block text-[#5c6b58] text-lg font-light mb-6">
              We know most of our customers by name. For the ones we haven't met yet, here's what they tell us.
            </p>
            <div className="hidden md:block">
              <div className="flex gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setTestimonialIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === testimonialIndex ? 'bg-[#3a604a] w-6' : 'bg-[#cad4c2]'
                    }`}
                    aria-label={`View testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        
          <div className="md:w-3/5 relative">
            <div className="relative bg-green-700 p-4 md:p-12 rounded-3xl shadow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <p className="text-sm md:text-lg font-light text-white leading-relaxed">
                    <span className="absolute top-2 left-2 text-green-200/20">
                      <Quote size={64} strokeWidth={0.8} />
                    </span> "{testimonials[testimonialIndex].text}"
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
                        <Image 
                          src={testimonials[testimonialIndex].image} 
                          alt={testimonials[testimonialIndex].name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-green-700 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif new text-xl text-black">{testimonials[testimonialIndex].name}</h4>
                      <p className="text-xs pl-2 uppercase tracking-widest text-white">{testimonials[testimonialIndex].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex md:hidden justify-center gap-3 mt-8">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setTestimonialIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === testimonialIndex ? 'bg-[#3a604a] w-8' : 'bg-[#cad4c2]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Other Products --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap">Other Products</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        
        {otherProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
              <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
                {otherProducts.map((product) => (
                  <ProductCard key={product.id} product={product} view="grid" />
                ))}
              </Suspense>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <Link
                href="/shop?category=Other"
                className="inline-flex items-center gap-2 px-8 py-2 bg-green-50 hover:bg-green-600 text-black tracking-widest rounded-full transition-colors text-sm border border-green-200"
              >
                View Other Products <GiShoppingCart size={18} />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No other products available at the moment.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-2 bg-green-50 hover:bg-green-600 text-black tracking-widest rounded-full transition-colors text-sm border border-green-200"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </section>

      {/* --- Smoothies --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap">Smoothies</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        
        {smoothiesProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
              <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
                {smoothiesProducts.map((product) => (
                  <ProductCard key={product.id} product={product} view="grid" />
                ))}
              </Suspense>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <Link
                href="/shop?category=Smoothies"
                className="inline-flex items-center gap-2 px-8 py-2 bg-green-50 hover:bg-green-600 text-black tracking-widest rounded-full transition-colors text-sm border border-green-200"
              >
                View All Smoothies <GiShoppingCart size={18} />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No smoothies available at the moment.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-2 bg-green-50 hover:bg-green-600 text-black tracking-widest rounded-full transition-colors text-sm border border-green-200"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}