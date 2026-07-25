'use client';

import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  ArrowRight,
  MapPin,
  Phone,
  Car
} from "lucide-react";
import { GiShoppingCart } from "react-icons/gi";
import { RiCustomerService2Fill } from "react-icons/ri";
import { HiMiniGift } from "react-icons/hi2";
import { FaShopify } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-stone-900 text-stone-300 pt-20 overflow-hidden">
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image
          src="/hero.webp"
          alt="Texture"
          fill
          className="object-cover grayscale"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Philosophy */}
          <div className="space-y-8">
            <div className="relative w-40 h-12">
              <Image
                src="/logo.webp"
                alt="Mwapat Autospares"
                fill
                sizes="160px"
                className="object-contain brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed font-light tracking-wide text-stone-400">
              Your trusted auto parts supplier in Nairobi, Kenya.
              Quality genuine parts, expert support, and fast delivery
              for all vehicle makes since 2018.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors"><Instagram size={18} strokeWidth={1.5} /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Facebook size={18} strokeWidth={1.5} /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Twitter size={18} strokeWidth={1.5} /></Link>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="text-white text-[10px]  tracking-[0.4em] font-bold mb-8">Categories</h3>
            <ul className="space-y-4 text-xs  tracking-[0.2em] font-light">
              <li><Link href="/shop?category=Engine%20Parts" className="hover:text-white transition-colors">Engine Parts</Link></li>
              <li><Link href="/shop?category=Brake%20Systems" className="hover:text-white transition-colors">Brake Systems</Link></li>
              <li><Link href="/shop?category=Tires%20%26%20Wheels" className="hover:text-white transition-colors">Tires & Wheels</Link></li>
              <li><Link href="/shop?category=Electrical" className="hover:text-white transition-colors">Electrical</Link></li>
              <li><Link href="/shop?category=Filters" className="hover:text-white transition-colors">Filters</Link></li>
              <li><Link href="/shop?category=Body%20Parts" className="hover:text-white transition-colors">Body Parts</Link></li>
              <li><Link href="/special-offers" className="text-stone-100 font-medium italic flex items-center gap-2"><HiMiniGift size={12} /> Special Offers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-[10px]  tracking-[0.4em] font-bold mb-8">Support</h3>
            <ul className="space-y-4 text-xs  tracking-[0.2em] font-light">
              <li><Link href="/help-center" className="hover:text-white transition-colors flex items-center gap-2"><RiCustomerService2Fill size={12} /> Help Center</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors flex items-center gap-2"><Car size={12} /> About Us</Link></li>
              {/* <li><Link href="/delivery" className="hover:text-white transition-colors">Delivery Info</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li> */}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-8">
            <h3 className="text-white text-[10px]  tracking-[0.4em] font-bold mb-8">Auto Parts Updates</h3>
            <p className="text-xs font-light tracking-wide text-stone-400">Subscribe for new arrivals, special deals, and auto maintenance tips.</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent border-b border-stone-700 py-3 text-xs  tracking-widest outline-none focus:border-stone-100 transition-colors"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-500 group-hover:text-white transition-colors">
                <ArrowRight size={18} strokeWidth={1} />
              </button>
            </div>
            <div className="pt-4 space-y-2 text-[10px]  tracking-widest text-stone-500 font-medium">
              <div className="flex items-center gap-3"><MapPin size={12} /> Nairobi, Kenya</div>
              <div className="flex items-center gap-3"><Phone size={12} /> +254 790 407508</div>
              <div className="flex items-center gap-3"><Mail size={12} /> Mwapat@gmail.com</div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-stone-800/50 py-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px]  tracking-[0.3em] text-stone-600">
            © {currentYear} Mwapat Autospares. Quality parts, trusted service.
          </p>
          
          <div className="flex items-center gap-8 opacity-40 grayscale">
            <span className="text-[10px] font-black tracking-tighter">M-PESA</span>
            <span className="text-[10px] font-black tracking-tighter">VISA</span>
            <span className="text-[10px] font-black tracking-tighter">MASTERCARD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}