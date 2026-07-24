'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MoreViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'grid';

  const setView = (newView: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    // Routing to your specific "more-products" path
    router.push(`/more-products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center">
      {/* Label for editorial depth */}
      <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">
        Display
      </span>

      <div className="flex items-center relative h-10">
        {/* Grid Button */}
        <button
          onClick={() => setView('grid')}
          className="relative w-10 h-10 flex items-center justify-center group outline-none"
          aria-label="Grid view"
        >
          <LayoutGrid 
            size={18} 
            strokeWidth={currentView === 'grid' ? 1.5 : 1}
            className={`transition-colors duration-500 z-10 ${
              currentView === 'grid' ? 'text-stone-900' : 'text-stone-300 group-hover:text-stone-500'
            }`} 
          />
          {currentView === 'grid' && (
            <motion.div 
              layoutId="moreViewUnderline"
              className=""
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
        </button>

        {/* List Button */}
        <button
          onClick={() => setView('list')}
          className="relative w-10 h-10 flex items-center justify-center group outline-none"
          aria-label="List view"
        >
          <List 
            size={18} 
            strokeWidth={currentView === 'list' ? 1.5 : 1}
            className={`transition-colors duration-500 z-10 ${
              currentView === 'list' ? 'text-stone-900' : 'text-stone-300 group-hover:text-stone-500'
            }`} 
          />
          {currentView === 'list' && (
            <motion.div 
              layoutId="moreViewUnderline"
              className=""
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
        </button>
      </div>
    </div>
  );
}