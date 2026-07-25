'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show after scrolling down 1.5 screen heights
      setIsVisible(window.scrollY > window.innerHeight * 1.5);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ y: -5 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-6 md:right-12 z-[99] flex flex-col items-center group gap-3"
          aria-label="Scroll to top"
        >
          {/* Label that appears on hover */}
          <span className="text-[10px]  tracking-[0.3em] text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -rotate-90 origin-bottom mb-1 -mr-3">
            Top
          </span>

          <div className="relative flex flex-col items-center">
            {/* The Icon */}
            <ChevronUp 
              size={20} 
              strokeWidth={1} 
              className="text-black group-hover:text-black transition-colors duration-300 mb-0" 
            />
            
            {/* The Vertical Line (Classy Editorial Look) */}
            <div className="relative w-[0.5px] h-8 bg-black overflow-hidden ml-[0.4px]">
              {/* Animated fill line on hover */}
              <motion.div
                className="absolute inset-0 bg-blue-500 origin-top"
                initial={{ scaleY: 0 }}
                whileHover={{ scaleY: 1 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              />
            </div>
          </div>

          {/* Decorative Ring (Optional subtle pulse) */}
          <div className="absolute -inset-4 border border-black rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}