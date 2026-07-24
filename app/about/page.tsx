'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiPlantRoots, 
  GiShoppingCart, 
  GiFarmer, 
  GiSunflower, 
  GiWaterDrop,
  GiCarrot,
  GiBroccoli,
  GiAppleSeeds,
  GiOrangeSlice,
  GiHerbsBundle,
  
} from 'react-icons/gi';
import { 
  Star,
  Quote,
  ChevronRight,
} from 'lucide-react';
import { TbTruckDelivery } from 'react-icons/tb';

const About = () => {
  // Testimonials specific to the brand story
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
      role: "Regular Customer",
      text: "Everything I need in one place. The quality is always good and delivery is reliable.",
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
    { icon: <GiFarmer className="w-6 h-6 md:w-7 md:h-7" />, title: "Trusted growers", desc: "We partner with Kenya's best farmers—not just one farm, but many." },
    { icon: <TbTruckDelivery className="w-6 h-6 md:w-7 md:h-7" />, title: "Delivery", desc: "Same-day delivery to your doorstep." },
    { icon: <GiSunflower className="w-6 h-6 md:w-7 md:h-7" />, title: "Curated quality", desc: "We select the best harvest from multiple farms, every single day." },
    { icon: <GiWaterDrop className="w-6 h-6 md:w-7 md:h-7" />, title: "Seasonal & fresh", desc: "What's ready is what we stock. No long storage." }
  ];

  // Product categories
  const categories = [
    { name: "Vegetables", icon: <GiBroccoli className="w-4 h-4" /> },
    { name: "Fruits", icon: <GiAppleSeeds className="w-4 h-4" /> },
    { name: "Tubers", icon: <GiCarrot className="w-4 h-4" /> },
    { name: "Juices", icon: <GiOrangeSlice className="w-4 h-4" /> },
    { name: "Herbs", icon: <GiHerbsBundle className="w-4 h-4" /> },
    { name: "Leafy Greens", icon: <GiPlantRoots className="w-4 h-4" /> },
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
                alt="Fresh produce selection at Pemafarm" 
                fill 
                className="object-contain" 
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
              {/* subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/10" />
            </div>
          </div>

          {/* ===== GREEN CONTAINER (text content + categories) ===== */}
          <div className="
            col-span-10 col-start-2 
            md:col-span-4 md:col-start-9 
            -mt-8 md:-ml-12 -md:mt-0 
            relative z-20 
            bg-green-700 text-white 
            p-4 md:p-6 
             md:rounded-3xl
          ">
            {/* Hand-crafted detail – subtle texture line */}
            <div className="w-16 h-0.5 bg-white/80 mb-3 rounded-full" />
            
            <h1 className="md:text-xl font-serif text-lg font-bold uppercase tracking-wider">
              About Pemafarm.
            </h1>
            
            {/* Store description - not a farm, but a store */}
            <p className="hidden md:block text-sm md:text-base font-light leading-relaxed text-white max-w-xs">
              Explore the story behind Pemafarm, your trusted online store for fresh, farm-sourced produce. We connect you to the best of Kenyan agriculture, all in one place.
            </p>
             <p className="hidden md:block text-sm md:text-base font-light leading-relaxed text-white mb-3 max-w-xs">
             Order from us and get the freshest, most delicious produce delivered to your door, straight from the farms we trust.
            </p>
            
            {/* CATEGORIES SECTION - right inside the green container */}
            <div className="md:mt-4 mb-3">
              <h3 className="text-xs uppercase tracking-wider text-[#d6cb9e] font-medium mb-2 flex items-center gap-2">
                <span>Shop by category</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {categories.map((category, idx) => (
                  <Link 
                    href={`/category/${category.name.toLowerCase().replace(' ', '-')}`} 
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
              — many farms, one store
            </div>
          </div>
        </div>

        {/* floating tagline */}
        <div className="mx-auto justify-center text-center mt-2 md:text-right md:pr-8">
          <span className="text-xs uppercase md:tracking-[0.3em] tracking-[0.05em] text-[#7a8f7a]">
            Quality groceries · Delivered to your door
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
              <div className="bg-green-700 w-16 h-16 rounded-full flex items-center justify-center mb-5 mx-auto sm:mx-0 group-hover:bg-green-100 group-hover:text-[#f4efe2] transition-colors duration-300">
                <div className="text-white group-hover:text-green-700  transition-colors">
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
      <section className="bg-green-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 text-center md:text-left md:flex md:items-center md:gap-16">
          <div className="md:w-2/3">
            <h2 className="md:text-xl font-serif text-lg font-bold uppercase tracking-wider whitespace-nowrap pb-4 text-left leading-relaxed">
              Your table, our promise.
            </h2>
            <p className="text-white/80 text-sm md:text-lg font-light max-w-2xl md:max-w-none text-left leading-relaxed">
              We don't grow everything ourselves — and that's the point. By working with dozens of trusted farms, we bring you the best of Kenyan soil, all in one place. No single farm can do that. Pemafarm can.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                href="/shop" 
                className="group bg-[#fefae6] text-[#2a4b38] px-8 py-3 rounded-full font-medium text-sm uppercase tracking-wide hover:bg-white transition-all inline-flex items-center gap-3 shadow-md"
              >
                <GiShoppingCart size={18} />
                Go To shop
              </Link>
              <Link 
                href="/help-center" 
                className="border border-[#bcccb0] text-[#fefae6] px-8 py-3 rounded-full font-medium text-sm uppercase tracking-wide bg-green-800 hover:bg-green-900 transition-all"
              >
                Contact Us <ChevronRight size={16} className='inline ml-2' />
              </Link>
            </div>
          </div>
          <div className="hidden md:block md:w-1/3 text-right opacity-80">
            <div className="border-l border-[#b1c4a4] pl-6">
              <p className="text-sm font-mono text-[#e7ebc9]">#pemafarmkenya</p>
              <div className="flex gap-3 mt-4 justify-end">
                <GiFarmer className="w-8 h-8 text-[#e2eacd]" />
                <GiPlantRoots className="w-8 h-8 text-[#e2eacd]" />
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
          <span>— from many farms to your door. —</span>
        </div>
      </div>

    </div>
  );
};

export default About;