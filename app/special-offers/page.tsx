'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { GiShoppingCart } from "react-icons/gi";


const Offers = () => {
  return (
    <section className="bg-white py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center  gap-12 md:gap-16">
          
          {/* Illustration */}
          <div className="relative  md:bg-white md: md:shadow w-64 h-64 md:w-80 md:h-80">
            <Image
              src="/Feeling sorry-rafiki.svg"
              alt="No offers"
              fill
              className="object-contain"
            />
          </div>

          {/* Content */}
          <div className="text-left md:text-left max-w-md">
            <div className="flex items-center gap-4 mb-4">
          <h2 className="md:text-xl text-lg font-bold  tracking-wider whitespace-nowrap">Special Offers </h2>
          <div className="h-px w-full bg-stone-200" />
        </div>
            
            <p className="text-black mb-4">
              Check back soon for new deals and promotions on auto parts. In the meantime, browse our shop or contact us.
            </p>

            {/* Buttons */}
             <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/shop"
                className="group bg-[#fefae6] text-[#2a4b38] px-8 py-3  font-medium text-sm  tracking-wide hover:bg-white transition-all inline-flex items-center gap-3 bg-blue-50 border border-blue-200"
              >
                <GiShoppingCart size={18} />
                Shop Auto Parts
              </Link>
              <Link
                href="/help-center"
                className="border border-[#bcccb0] text-[#fefae6] px-8 py-3  font-medium text-sm  tracking-wide bg-blue-700 hover:bg-[#3c6341] transition-all"
              >
                Contact Us <ChevronRight size={16} className='inline ml-2' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers;