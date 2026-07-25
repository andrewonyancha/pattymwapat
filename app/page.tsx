'use client';
import { products } from './shop/products';
import ProductCard from '@/app/components/shop/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { GiCarSeat, GiCog, GiCrackedDisc, GiRingingAlarm, GiShoppingCart, GiTyre } from 'react-icons/gi';
import { Quote, Star, Wrench, Car } from 'lucide-react';
import { useState, useEffect, useRef, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaFilter, FaShopify } from 'react-icons/fa';
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { FaShoppingBasket } from "react-icons/fa";
import { MdElectricCar } from 'react-icons/md';



// Categories & Special Offers
const categories = [
  { id: 1, name: 'Engine Parts', icon: <GiCog className="w-8 h-8" /> },
  { id: 2, name: 'Brake Systems', icon: <GiRingingAlarm className="w-8 h-8" /> },
  { id: 3, name: 'Tires & Wheels', icon: <GiTyre className="w-8 h-8" /> },
  { id: 4, name: 'Electrical', icon: <MdElectricCar className="w-8 h-8" /> },
  { id: 5, name: 'Filters', icon: <FaFilter className="w-8 h-8" /> },
  { id: 6, name: 'Body Parts', icon: <GiCarSeat className="w-8 h-8" /> },
];

const specialOffers = [
  { id: 1, name: 'New Customer', icon: <FaShoppingBasket className="w-8 h-8" />, discount: '10% OFF' },
  { id: 2, name: 'Bulk Orders', icon: <FaShopify className="w-8 h-8" />, discount: 'FREE Delivery' },
  { id: 3, name: 'Express Delivery', icon: <GiFullMotorcycleHelmet className="w-8 h-8" />, discount: '24/7 Service' },
  { id: 4, name: 'Quality Parts', icon: <Wrench className="w-8 h-8" />, discount: 'Genuine Parts' },
];

const testimonials = [
  {
    name: "James Kariuki",
    role: "Car Owner",
    text: "Mwapat Autospares has all the parts I need at fair prices. Fast delivery across Nairobi!",
    image: "/images/Contact-us.svg"
  },
  {
    name: "Sarah Wanjiku",
    role: "Mechanic",
    text: "Reliable parts and excellent service. They never disappoint when I need urgent replacements.",
    image: "/images/Contact-us.svg"
  },
  {
    name: "David Ochieng",
    role: "Fleet Manager",
    text: "Best auto parts supplier in Nairobi. Quality products and professional support every time.",
    image: "/images/Contact-us.svg"
  }
];

export default function AutoPartsLandingPage() {

  // Responsive: show 5 on desktop, 4 on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const mobileSlice = 4;
  const desktopSlice = 5;
  const sliceCount = isMobile ? mobileSlice : desktopSlice;

  // Get products from each category
  const popularEngineParts = products
    .filter(product => product.category === 'Engine Parts')
    .slice(0, sliceCount);

  const popularBrakeSystems = products
    .filter(product => product.category === 'Brake Systems')
    .slice(0, sliceCount);

  const featuredElectrical = products
    .filter(product => product.category === 'Electrical')
    .slice(0, sliceCount);

  const featuredTiresWheels = products
    .filter(product => product.category === 'Tires & Wheels')
    .slice(0, sliceCount);

  const popularFilters = products
    .filter(product => product.category === 'Filters')
    .slice(0, sliceCount);

  const popularBodyParts = products
    .filter(product => product.category === 'Body Parts')
    .slice(0, sliceCount);

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
    { text: "Mwapat", icon: null, color: "text-white", isMain: true },
    { text: "Auto Parts", icon: <Car className="w-12 h-12" />, color: "text-blue-700", isMain: false },
    { text: "Delivery", icon: <GiFullMotorcycleHelmet className="w-10 h-10" />, color: "text-black", isMain: false },
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
    ["Mwapat", "Quality", "Auto Parts"],
    ["Genuine", "Parts", "Nairobi"],
    ["Mwapat", "Trusted", "Delivered Fast"],
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
            src="/hero.webp"
            alt="Auto Parts"
            fill
            className="hidden md:block  object-cover"
            priority
          />
          <Image
            src="/hero.webp"
            alt="Auto Parts"
            fill
            className="block md:hidden  object-cover"
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
                          ? "text-4xl md:text-3xl text-white font-black  leading-none tracking-[0.05em]"
                          : i === 1
                          ? "text-3xl md:text-3xl font-bold text-blue-700  leading-none opacity-90 tracking-[0.05em]"
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
          {/* <div className="flex flex-col items-end">
            <div className="bg-white/90 backdrop-blur-sm px-6 py-4  shadow-xl">
              <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">M-Pesa Till</p>
              <p className="text-3xl md:text-4xl font-black text-blue-700 tracking-tight">213528</p>
            </div>
          </div> */}
          <Link
            href="/shop"
            className="absolute bottom-8 left-4 w-fit px-8 py-3 bg-blue-700 hover:bg-blue-800 text-base text-white font-bold  transition-all transform  shadow-lg flex items-center gap-2"
          >
            Shop Auto Parts <GiShoppingCart size={18} />
          </Link>
        </div>

        {/* Mobile layout */}
        <div className="relative z-10 h-full max-w-5xl mx-auto px-4 flex md:hidden flex-col justify-between text-white">
          {/* Till number floating at top of image */}
          {/* <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-0  shadow-lg">
              <p className="text-sm text-orange-700  tracking-wider font-semibold">Till <span className="text-xl  font-black text-blue-600">213528</span></p>
             
            </div>
          </div> */}

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
              className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-base text-white font-bold  transition-all transform  shadow-2xl flex items-center gap-2"
            >
              Shop Auto Parts <GiShoppingCart size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- Popular Categories --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap newn ">All Categories</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="border border-blue-200 bg-blue-50 hover:border-blue-500 group transition-all  p-6 flex flex-col items-center gap-3 cursor-pointer hover:shadow-lg"
            >
              <div className="text-blue-800 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- Popular Engine Parts --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap">Engine Parts</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5  gap-4 sm:gap-6">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {popularEngineParts.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>
      </section>
      <div className="flex justify-center md:justify-end ">
          <Link
            href="/shop?category=Engine%20Parts"
            className="inline-flex items-center gap-2 px-8 py-2 bg-blue-50 hover:bg-blue-600 text-black tracking-widest  transition-colors text-sm border border-blue-200"
          >
            View All Engine Parts <GiShoppingCart size={16} />
          </Link>
        </div>

      {/* --- Popular Brake Systems --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap">Brake Systems</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5  gap-4 sm:gap-6">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {popularBrakeSystems.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>
      </section>
      <div className="flex justify-center md:justify-end">
          <Link
            href="/shop?category=Brake%20Systems"
            className="inline-flex items-center gap-2 px-8 py-2 bg-blue-50 hover:bg-blue-600 text-black tracking-widest  transition-colors text-sm border border-blue-200"
          >
            View All Brake Systems <GiShoppingCart size={18} />
          </Link>
        </div>

     

      {/* --- Featured Electrical --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap"> Electrical Parts</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 mb-10">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {featuredElectrical.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>

        <div className="flex justify-center md:justify-end">
          <Link
            href="/shop?category=Electrical"
            className="inline-flex items-center gap-2 px-8 py-2 bg-blue-50 hover:bg-blue-600 text-black tracking-widest  transition-colors text-sm border border-blue-200"
          >
            View All Electrical <GiShoppingCart size={18} />
          </Link>
        </div>
      </section>

      {/* --- Featured Tires & Wheels --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap"> Tires & Wheels</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 mb-10">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {featuredTiresWheels.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>

        <div className="flex justify-center md:justify-end">
          <Link
            href="/shop?category=Tires%20%26%20Wheels"
            className="inline-flex items-center gap-2 px-8 py-2 bg-blue-50 hover:bg-blue-600 text-black tracking-widest  transition-colors text-sm border border-blue-200"
          >
            View All Tires & Wheels <GiShoppingCart size={18} />
          </Link>
        </div>
      </section>

      
      {/* --- Popular Filters --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap">Car Filters</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {popularFilters.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>
      </section>
      <div className="flex justify-center md:justify-end ">
          <Link
            href="/shop?category=Filters"
            className="inline-flex items-center gap-2 px-8 py-2 bg-blue-50 hover:bg-blue-600 text-black tracking-widest  transition-colors text-sm border border-blue-200"
          >
            View All Filters <GiShoppingCart size={16} />
          </Link>
        </div>

      {/* --- Popular Body Parts --- */}
      <section className="max-w-7xl mx-auto px-2 py-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="md:text-xl text-base font-bold uppercase tracking-widest whitespace-nowrap"> Body Parts</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          <Suspense fallback={<div className="col-span-full text-center py-8">Loading...</div>}>
            {popularBodyParts.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </Suspense>
        </div>
      </section>
      <div className="flex justify-center md:justify-end">
          <Link
            href="/shop?category=Body%20Parts"
            className="inline-flex items-center gap-2 px-8 py-2 bg-blue-50 hover:bg-blue-600 text-black tracking-widest  transition-colors text-sm border border-blue-200"
          >
            View All Body Parts <GiShoppingCart size={18} />
          </Link>
        </div>


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
                    className={`w-2 h-2  transition-all ${
                      idx === testimonialIndex ? 'bg-[#3a604a] w-6' : 'bg-[#cad4c2]'
                    }`}
                    aria-label={`View testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        
          <div className="md:w-3/5 relative">
            <div className="relative bg-blue-700 p-4 md:p-12  shadow">
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
                    <span className="absolute top-2 left-2 text-blue-200/20">
                      <Quote size={64} strokeWidth={0.8} />
                    </span> "{testimonials[testimonialIndex].text}"
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="relative">
                      <div className="w-16 h-16  border-2 border-white overflow-hidden">
                        <Image
                          src={testimonials[testimonialIndex].image}
                          alt={testimonials[testimonialIndex].name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-blue-700  w-6 h-6 flex items-center justify-center border-2 border-white">
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
                  className={`w-2.5 h-2.5  transition-all ${
                    idx === testimonialIndex ? 'bg-[#3a604a] w-8' : 'bg-[#cad4c2]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

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
              className="border border-blue-200 bg-blue-50 hover:border-blue-500 group transition-all  p-6 flex flex-col items-center gap-3 cursor-pointer hover:shadow-lg"
            >
              <div className="text-blue-800 group-hover:scale-110 transition-transform">
                {offer.icon}
              </div>
              <div className="text-center">
                <span className="text-sm font-medium block">{offer.name}</span>
                <span className="text-xs text-blue-800 font-bold mt-1">{offer.discount}</span>
              </div>
            </div>
          ))}
        </div>
        
      </section>
    </div>
  );
}