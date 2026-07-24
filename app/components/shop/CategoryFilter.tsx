'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ChevronRight } from 'lucide-react';

// Category hierarchy with subcategories
const categoryHierarchy: Record<string, string[]> = {
  'Engine Parts': ['Engine Components', 'Engine Gaskets', 'Timing Parts'],
  'Brake Systems': ['Brake Pads', 'Brake Discs', 'Brake Fluid'],
  'Tires & Wheels': ['Tires', 'Rims', 'Valve Caps'],
  'Electrical': ['Batteries', 'Alternators', 'Starters', 'Lighting'],
  'Filters': ['Oil Filters', 'Air Filters', 'Fuel Filters'],
  'Body Parts': ['Bumpers', 'Fenders', 'Mirrors', 'Lights'],
};

const mainCategories = ['All', 'Engine Parts', 'Brake Systems', 'Tires & Wheels', 'Electrical', 'Filters', 'Body Parts'] as const;
const allCategories = ['All', 'Engine Parts', 'Engine Components', 'Engine Gaskets', 'Timing Parts', 'Brake Systems', 'Brake Pads', 'Brake Discs', 'Brake Fluid', 'Tires & Wheels', 'Tires', 'Rims', 'Valve Caps', 'Electrical', 'Batteries', 'Alternators', 'Starters', 'Lighting', 'Filters', 'Oil Filters', 'Air Filters', 'Fuel Filters', 'Body Parts', 'Bumpers', 'Fenders', 'Mirrors', 'Lights'] as const;

export default function CategoryFilter({ mobileMode = false }: { mobileMode?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCurrent = searchParams.get('category') || 'All';
  const current = allCategories.includes(rawCurrent as typeof allCategories[number]) ? rawCurrent : 'All';
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Check if current category has subcategories
  const currentMainCategory = mainCategories.includes(rawCurrent as typeof mainCategories[number]) ? rawCurrent : null;
  const hasSubcategories = currentMainCategory && categoryHierarchy[currentMainCategory] !== undefined;
  const subcategories = hasSubcategories ? categoryHierarchy[currentMainCategory] : [];

  const handleFilter = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
    setIsOpen(false);
    setExpandedCategory(null);
  };

  const toggleExpand = (cat: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategory(expandedCategory === cat ? null : cat);
  };

  if (mobileMode) {
    return (
      <div className="w-full border-b border-stone-100 bg-white">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2 px-0 flex justify-between items-center group"
        >
          <span className="text-[10px] uppercase tracking-[0.1em] text-stone-400 group-hover:text-stone-900 transition-colors">
            Filter by Category
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] pl-2 uppercase tracking-widest text-stone-900 font-medium italic">
              {current}
            </span>
            {isOpen ? <Minus size={14} strokeWidth={1} /> : <Plus size={14} strokeWidth={1} />}
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
              className="overflow-hidden bg-stone-50/50"
            >
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 p-6 border-t border-stone-100">
                {mainCategories.map((cat) => {
                  const hasChildren = categoryHierarchy[cat] !== undefined;
                  const isExpanded = expandedCategory === cat;
                  
                  return (
                    <div key={cat} className="flex flex-col">
                      <button
                        onClick={(e) => hasChildren ? toggleExpand(cat, e) : handleFilter(cat)}
                        className={`text-left text-[11px] uppercase tracking-[0.3em] transition-colors flex items-center justify-between ${
                          current === cat ? 'text-stone-900 font-bold' : 'text-stone-400'
                        }`}
                      >
                        {cat}
                        {hasChildren && (
                          <ChevronRight 
                            size={14} 
                            className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        )}
                      </button>
                      
                      {/* Subcategory dropdown */}
                      <AnimatePresence>
                        {hasChildren && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden ml-2 mt-2 space-y-2"
                          >
                            {categoryHierarchy[cat].map((subcat) => (
                              <button
                                key={subcat}
                                onClick={() => handleFilter(subcat)}
                                className={`block text-left text-[10px] uppercase tracking-[0.2em] transition-colors ${
                                  current === subcat ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-600'
                                }`}
                              >
                                {subcat}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop remains an elegant spaced-out nav with expandable subcategories
  return (
    <nav className="flex flex-col items-center py-4 border-b border-stone-100">
      <div className="flex items-center justify-center space-x-6 flex-wrap">
        {mainCategories.map((cat) => {
          const hasChildren = categoryHierarchy[cat] !== undefined;
          const isExpanded = expandedCategory === cat;
          
          return (
            <div key={cat} className="relative group">
              <button
                onClick={(e) => hasChildren ? toggleExpand(cat, e) : handleFilter(cat)}
                className={`group relative text-[11px] uppercase tracking-[0.3em] transition-colors duration-500 flex items-center gap-1 ${
                  current === cat ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {cat}
                {hasChildren && (
                  <ChevronRight 
                    size={12} 
                    className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'group-hover:rotate-90'}`}
                  />
                )}
                <span className={`absolute -bottom-2 left-1/2 w-0 h-[0.5px] bg-stone-900 transition-all duration-500 ease-out -translate-x-1/2 
                  ${current === cat ? 'w-full' : 'group-hover:w-1/2'}`} 
                />
              </button>
              
              {/* Desktop subcategory dropdown */}
              <AnimatePresence>
                {hasChildren && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -10 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 py-3 px-4 bg-white border border-stone-100 shadow-lg z-50 whitespace-nowrap"
                  >
                    <div className="flex flex-col items-start space-y-2">
                      {categoryHierarchy[cat].map((subcat) => (
                        <button
                          key={subcat}
                          onClick={() => handleFilter(subcat)}
                          className={`text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-stone-900 ${
                            current === subcat ? 'text-stone-900 font-bold' : 'text-stone-400'
                          }`}
                        >
                          {subcat}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
