'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GiShoppingCart,
  GiWrench,
  GiTruck,
  GiCarBattery,
} from 'react-icons/gi';
import {
  Star,
  Quote,
  ChevronRight,
  Car,
} from 'lucide-react';
import { TbEngine, TbTruckDelivery } from 'react-icons/tb';

const About = () => {
  // Testimonials specific to the brand story
  const testimonials = [
    {
      name: "James Kariuki",
      role: "Car Owner",
      text: "Pattywapat Autospares has all the parts I need at fair prices. Fast delivery across Nairobi!",
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

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate testimonials
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testimonials.length]);

  const values = [
    { icon: <GiWrench className="w-6 h-6 md:w-7 md:h-7" />, title: "Quality Parts", desc: "We source genuine auto parts from trusted manufacturers worldwide." },
    { icon: <TbTruckDelivery className="w-6 h-6 md:w-7 md:h-7" />, title: "Fast Delivery", desc: "Same-day delivery across Nairobi and nationwide shipping available." },
    { icon: <Car className="w-6 h-6 md:w-7 md:h-7" />, title: "Expert Support", desc: "Our team of auto experts helps you find the right parts for your vehicle." },
    { icon: <TbEngine className="w-6 h-6 md:w-7 md:h-7" />, title: "All Makes", desc: "We stock parts for all vehicle makes and models, domestic and imported." }
  ];

  // Product categories
  const categories = [
    { name: "Engine Parts", icon: <TbEngine className="w-4 h-4" /> },
    { name: "Brake Systems", icon: <GiWrench className="w-4 h-4" /> },
    { name: "Tires & Wheels", icon: <GiTruck className="w-4 h-4" /> },
    { name: "Electrical", icon: <GiCarBattery className="w-4 h-4" /> },
    { name: "Filters", icon: <GiWrench className="w-4 h-4" /> },
    { name: "Body Parts", icon: <Car className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white text-[#2a2f2a] py-6 min-h-screen font-sans overflow-x-hidden">
       
      {/* ===== HERO SECTION – asymmetrical, handcrafted feel ===== */}
      <section className="md:pt-4 pt-0 md:pt-8 pb-12 md:pb-8 px-0 md:px-6 max-w-7xl mx-auto">
        {/* Outer grid – controls overall asymmetry */}
        <div className="grid grid-cols-12 gap-y-4 md:gap-0 relative">
          
          {/* IMAGE – spans full width on mobile, 8 cols on desktop */}
          <div className="col-span-12 md:col-span-8 relative">
            <div className="relative md:aspect-[4/2] aspect-3/2 w-full overflow-hidden rounded-none md:rounded-3xl bg-white bord">
              <Image
                src="/images/hero2.jpg"
                alt="Auto parts at Pattywapat Autospares"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
              {/* subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/10" />
            </div>
          </div>

          {/* ===== BLUE CONTAINER (text content + categories) ===== */}
          <div className="
            col-span-10 col-start-2
            md:col-span-4 md:col-start-9
            -mt-8 md:-ml-12 -md:mt-0
            relative z-20
            bg-blue-700 text-white
            p-4 md:p-6
             md:rounded-3xl
          ">
            {/* Hand-crafted detail – subtle texture line */}
            <div className="w-16 h-0.5 bg-white/80 mb-3 rounded-full" />
            
            <h1 className="md:text-xl font-serif text-lg font-bold uppercase tracking-wider">
              About Pattywapat.
            </h1>
            
            {/* Store description */}
            <p className="hidden md:block text-sm md:text-base font-light leading-relaxed text-white max-w-xs">
              Explore the story behind Pattywapat Autospares, your trusted auto parts supplier in Nairobi. We connect you to genuine car parts and expert support, all in one place.
            </p>
             <p className="hidden md:block text-sm md:text-base font-light leading-relaxed text-white mb-3 max-w-xs">
             Order from us and get quality auto parts delivered to your door, with reliable service you can trust.
            </p>
            
            {/* CATEGORIES SECTION - right inside the blue container */}
            <div className="md:mt-4 mb-3">
              <h3 className="text-xs uppercase tracking-wider text-[#d6cb9e] font-medium mb-2 flex items-center gap-2">
                <span>Shop by category</span>
              </h3>
               
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {categories.map((category, idx) => (
                  <Link
                    href={`/shop?category=${category.name}`}
                    key={idx}
                    className="flex items-center gap-2 text-white hover:text-white text-xs transition-colors group"
                  >
                    <span className="text-[#c7d1a8] group-hover:text-white transition-colors">
                      {category.icon}
                    </span>
                    <span className="font-light truncate">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* subtle signature line — hand-crafted feel */}
            <div className="mt-3 pt-3 border-t border-[#b5aa7e]/30 font-serif italic text-right text-[#d6cb9e] text-xs">
              — quality parts, trusted service
            </div>
          </div>
        </div>

        {/* floating tagline */}
        <div className="mx-auto justify-center text-center mt-2 md:text-right md:pr-8">
          <span className="text-xs uppercase md:tracking-[0.3em] tracking-[0.05em] text-[#7a8f7a]">
            Quality Auto Parts · Delivered to Your Door
          </span>
        </div>
      </section>

      {/* ===== VALUES – quiet, hand-crafted icons ===== */}
      <section className="max-w-7xl mx-auto px-4 pb-12 md:pb-16 pt-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="md:block hidden h-px w-full bg-stone-200" />
          <h2 className="md:text-xl font-serif text-lg font-bold uppercase tracking-wider whitespace-nowrap">How we're different</h2>
          <div className="md:block hidden h-px w-full bg-stone-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-24 gap-y-8 md:py-12">
          {values.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group text-center sm:text-left"
            >
              <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mb-5 mx-auto sm:mx-0 group-hover:bg-blue-100 group-hover:text-[#f4efe2] transition-colors duration-300">
                <div className="text-white group-hover:text-blue-700  transition-colors">
                  {item.icon}
                </div>
              </div>
              <h3 className="font-serif text-xl mb-2 text-[#364735]">{item.title}</h3>
              <p className="text-sm text-[#6a7a6a] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== COMMITMENT / CLOSING ===== */}
      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 text-center md:text-left md:flex md:items-center md:gap-16">
          <div className="md:w-2/3">
            <h2 className="md:text-xl font-serif text-lg font-bold uppercase tracking-wider whitespace-nowrap pb-4 text-left leading-relaxed">
              Your car, our promise.
            </h2>
            <p className="text-white/80 text-sm md:text-lg font-light max-w-2xl md:max-w-none text-left leading-relaxed">
              We source the best auto parts from trusted suppliers worldwide, bringing you genuine components for all vehicle makes. No matter what you drive, Pattywapat has you covered.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/shop"
                className="group bg-[#fefae6] text-[#2a4b38] px-8 py-3 rounded-full font-medium text-sm uppercase tracking-wide hover:bg-white transition-all inline-flex items-center gap-3 shadow-md"
              >
                <GiShoppingCart size={18} />
                Shop Parts
              </Link>
              <Link
                href="/help-center"
                className="border border-[#bcccb0] text-[#fefae6] px-8 py-3 rounded-full font-medium text-sm uppercase tracking-wide bg-blue-800 hover:bg-blue-900 transition-all"
              >
                Contact Us <ChevronRight size={16} className='inline ml-2' />
              </Link>
            </div>
          </div>
          <div className="hidden md:block md:w-1/3 text-right opacity-80">
            <div className="border-l border-[#b1c4a4] pl-6">
              <p className="text-sm font-mono text-[#e7ebc9]">#pattywapatkenya</p>
              <div className="flex gap-3 mt-4 justify-end">
                <Car className="w-8 h-8 text-[#e2eacd]" />
                <GiWrench className="w-8 h-8 text-[#e2eacd]" />
                <TbTruckDelivery className="w-8 h-8 text-[#e2eacd]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIAL – feels personal, handwritten quality ===== */}
      <section className="max-w-7xl mx-2  py-12">
        <div className="flex items-center gap-4 md:mb-8">
          <div className="md:block hidden h-px w-full bg-stone-200" />
          <h2 className="md:text-xl text-lg font-bold uppercase tracking-wider whitespace-nowrap">Customer Feedback</h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
        
        <div className="flex flex-col md:px-4 lg:flex-row gap-12 lg:gap-20 items-center md:py-12">
          
          <div className="lg:w-2/5">
            <h2 className="hidden md:block font-serif text-lg mt-3 mb-6 text-[#364735]">
              Not reviews.
              <span className="italic block font-light">Conversations.</span>
            </h2>
            <p className="hidden md:block text-[#5c6b58] text-lg font-light mb-6">
              We know most of our customers by name. For the ones we haven't met yet, here's what they tell us.
            </p>
            <div className="hidden lg:block">
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
        
          <div className="lg:w-3/5 relative">
            <div className="relative bg-blue-700 p-4 md:p-12 rounded-3xl shadow">
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
                      <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
                        <Image
                          src={testimonials[testimonialIndex].image}
                          alt={testimonials[testimonialIndex].name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-blue-700 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif text-2xl text-black new">{testimonials[testimonialIndex].name}</h4>
                      <p className="text-xs uppercase pl-2 tracking-wider text-white">{testimonials[testimonialIndex].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* mobile pagination dots */}
            <div className="flex lg:hidden justify-center gap-3 mt-8">
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

      {/* ===== SIGN-OFF ===== */}
      <div className="bg-[#f4f1ea] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-[#6f8266] font-serif text-sm tracking-wide">
          <span>— quality parts, trusted service. —</span>
        </div>
      </div>

    </div>
  );
};

export default About;