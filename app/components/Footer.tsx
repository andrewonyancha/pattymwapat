'use client';

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, MessageCircle, Car } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Brand */}
          <div>
            <div className="relative w-40 h-12 mb-4">
              <Image
                src="/logo-footer.png"
                alt="Pattywapat Autospares"
                fill
                sizes="160px"
                className="object-contain brightness-0 invert"
              />
            </div>
            <p className="text-blue-200 text-sm mb-4">
              Your trusted auto parts supplier in Nairobi, Kenya. Quality genuine parts, expert support, and fast delivery.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-blue-200">
              <li><Link href="/shop" className="hover:text-white transition">Shop All Parts</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/help-center" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/account/orders" className="hover:text-white transition">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-blue-200">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-400" />
                <a href="tel:+254712345678" className="hover:text-white transition">+254 712 345 678</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="text-green-400" />
                <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">WhatsApp Us</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-400" />
                <a href="mailto:pattywapat@gmail.com" className="hover:text-white transition">pattywapat@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-blue-400" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-blue-800 rounded-lg">
              <p className="text-xs text-blue-300 uppercase tracking-wider mb-1">M-Pesa Till Number</p>
              <p className="text-2xl font-bold text-white">213528</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-400 text-sm">
            © {currentYear} Pattywapat Autospares. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-blue-400 text-sm">
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/help-center" className="hover:text-white transition">Help</Link>
            <Link href="/account/orders" className="hover:text-white transition">Orders</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
