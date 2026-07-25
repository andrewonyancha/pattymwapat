'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  X,
  Settings,
  Package,
  LogOut,
  User,
  Shield,
  Car,
} from "lucide-react";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdOutlineShoppingCart } from "react-icons/md";
import { PiCarBatteryFill } from "react-icons/pi";
import Image from "next/image";
import { CiMenuBurger } from "react-icons/ci";
import { useCartStore } from "../lib/cartStore";
import CartDrawer from "./shop/CartDrawer";
import {
  GiCog,
  GiCarSeat,
  GiTyre,
  GiRingingAlarm,
} from "react-icons/gi";


// Auth store & signOut
import { useAuthStore } from "../lib/authStore";
import { signOut } from "../lib/firebase/auth";
import { FaCar, FaFilter } from "react-icons/fa";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showDesktopProfileDropdown, setShowDesktopProfileDropdown] = useState(false);
  const [showMobileProfileDropdown, setShowMobileProfileDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const cartItemCount = useCartStore((state) => state.getTotalItems());
  const [displayCount, setDisplayCount] = useState(0);

  // Auth
  const { user, isLoading, logout } = useAuthStore();

  useEffect(() => {
    setDisplayCount(cartItemCount);
    setMounted(true);
  }, [cartItemCount]);

  // Focus search input
  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  // Close mobile search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMobileSearch &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowMobileSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileSearch]);

  // Close desktop profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopProfileRef.current && !desktopProfileRef.current.contains(event.target as Node)) {
        setShowDesktopProfileDropdown(false);
      }
    };
    if (showDesktopProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDesktopProfileDropdown]);

  // Close mobile profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target as Node)) {
        setShowMobileProfileDropdown(false);
      }
    };
    if (showMobileProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileProfileDropdown]);

  const menuItems = [
    { label: "Shop", href: "/shop", icon: FaCar },
    { label: "Engine Parts", href: "/shop?category=Engine%20Parts", icon: GiCog },
    { label: "Brake Systems", href: "/shop?category=Brake%20Systems", icon: GiRingingAlarm },
    { label: "Tires & Wheels", href: "/shop?category=Tires%20%26%20Wheels", icon: GiTyre },
    { label: "Electrical", href: "/shop?category=Electrical", icon: PiCarBatteryFill },
    { label: "Filters", href: "/shop?category=Filters", icon: FaFilter },
    { label: "Body Parts", href: "/shop?category=Body%20Parts", icon: GiCarSeat },
    { label: "Help Center", href: "/help-center", icon: RiCustomerService2Fill },
  ];

  useEffect(() => {
    if (isMobileMenuOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen, isCartOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const closeCart = () => setIsCartOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowMobileSearch(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch(e);
  };

  const handleSignOut = async () => {
    await signOut();
    logout();
    setShowDesktopProfileDropdown(false);
    setShowMobileProfileDropdown(false);
    router.push("/account/login");
  };

  // Avatar component (same as before)
  const UserAvatar = ({ size = 36 }: { size?: number }) => {
    if (isLoading) {
      return (
        <div 
          className={`w-[26px] h-[26px] rounded-full bg-gray-300 animate-pulse`}
        />
      );
    }

    if (!user) {
      return (
        <User 
          size={Math.round(size * 0.7)} 
          strokeWidth={1.8} 
          className="text-gray-600" 
        />
      );
    }

    const text = user.displayName || user.email || "U";
    const initial = text.charAt(0).to();

    return (
      <div
        className={`
          w-[26px] h-[26px] 
          rounded-full
          bg-blue-700 text-white
          flex items-center justify-center
          text-base font-bold  
        `}
      >
        {initial}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* ─── DESKTOP ──────────────────────────────────────────────── */}
      <div className="hidden md:block">
        <div className="container mx-auto px-2 lg:px-12 py-0 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
               <div className="relative w-16 h-16">
                 <Image src="/logo.webp" alt="Mwapat Autospares Logo" fill sizes="64px" className="object-contain" priority />
               </div>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search auto parts, brakes, filters..."
                className="w-full pl-5 pr-12 py-3 bg-stone-100 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button type="submit" aria-label="Search" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-700 transition">
                <Search size={22} />
              </button>
            </form>
          </div>

          {/* User + Cart */}
          <div className="flex items-center gap-8">
            {!isLoading && !user ? (
              <Link href="/#account/login" className="text-gray-600 hover:text-blue-700 transition" title="Sign in">
                <User size={24} strokeWidth={1.8} />
              </Link>
            ) : (
              <div className="relative" ref={desktopProfileRef}>
                <button
                  onClick={() => setShowDesktopProfileDropdown(!showDesktopProfileDropdown)}
                  className="flex items-center gap-1.5 focus:outline-none"
                  aria-expanded={showDesktopProfileDropdown}
                  aria-haspopup="true"
                >
                  <UserAvatar size={30} />
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${showDesktopProfileDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showDesktopProfileDropdown && user && (
                  <div className="absolute right-0 mt-3 w-64 bg-white  shadow-xl border border-gray-200 py-2 z-50 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-base font-medium text-gray-900 truncate">
                        {user.displayName || "Welcome"}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setShowDesktopProfileDropdown(false)}
                      >
                        <User size={18} />
                        My Account
                      </Link>

                      <Link
                        href="/account/orders"
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setShowDesktopProfileDropdown(false)}
                      >
                        <Package size={18} />
                        Orders
                      </Link>

                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setShowDesktopProfileDropdown(false)}
                      >
                        <Settings size={18} />
                        Settings
                      </Link>

                      {user.email && ['mr.onyanchaandrew@gmail.com', 'Mwapat@gmail.com'].includes(user.email.toLowerCase()) ? (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-blue-700 font-medium hover:bg-blue-50 transition-colors"
                          onClick={() => setShowDesktopProfileDropdown(false)}
                        >
                          <Shield size={18} />
                          Admin Panel
                        </Link>
                      ) : null}
                    </div>

                    <div className="border-t border-gray-100 mt-1 py-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="text-gray-700 hover:text-blue-700 transition relative cursor-pointer"
              aria-label="Open shopping cart"
            >
              <MdOutlineShoppingCart size={26} />
              {mounted && displayCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-5 flex items-center justify-center px-1.5 shadow-sm">
                  {displayCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="bg-blue-700 text-white">
          <div className="container mx-auto px-4 lg:px-6">
            <ul className="flex items-center justify-center py-0">
              {menuItems.map((item, index) => (
                <li key={item.label} className="relative gap-6 flex items-center">
                  <Link
                    href={item.href}
                    className="flex items-center gap-2.5 px-3  text-sm font-semibold hover:text-black  transition-colors whitespace-nowrap group"
                  >
                    <item.icon size={16} className="group-hover:animate-bounce" />
                    {item.label}
                  </Link>

                  {index < menuItems.length - 1 && (
                    <div className="h-12 w-px bg-white mx-1" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* ─── MOBILE ───────────────────────────────────────────────── */}
      <div className="md:hidden bg-white border-b border-gray-100 py-1">
        {showMobileSearch && (
          <div ref={mobileSearchRef} className="p-3 bg-white border-b border-gray-200">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search auto parts..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </form>
          </div>
        )}

        <div className={`container mx-auto pr-1 py-2 flex items-center justify-between ${showMobileSearch ? 'hidden' : 'block'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu" className="text-gray-800 p-1">
              <CiMenuBurger size={20} />
            </button>
            <button onClick={() => setShowMobileSearch(true)} aria-label="Search" className="text-gray-700 hover:text-blue-700 p-1">
              <Search size={20} />
            </button>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
               <div className="relative w-16 h-16">
                 <Image src="/logo.webp" alt="Mwapat Autospares Logo" fill sizes="64px" className="object-contain" priority />
               </div>
          </Link>

          <div className="flex items-center gap-4">
            {!isLoading && !user ? (
              <Link href="/#account/login" className="text-gray-700 hover:text-blue-700 p-1" title="Sign in">
                <User size={22} strokeWidth={1.8} />
              </Link>
            ) : (
              <div className="relative" ref={mobileProfileRef}>
                <button
                  onClick={() => setShowMobileProfileDropdown(!showMobileProfileDropdown)}
                  className="flex items-center gap-1 focus:outline-none"
                  aria-expanded={showMobileProfileDropdown}
                  aria-haspopup="true"
                >
                  <UserAvatar size={32} />
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${showMobileProfileDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showMobileProfileDropdown && user && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white  shadow-xl border border-gray-200 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.displayName || "Welcome"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setShowMobileProfileDropdown(false)}
                      >
                        <User size={16} />
                        My Account
                      </Link>

                      <Link
                        href="/account/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setShowMobileProfileDropdown(false)}
                      >
                        <Package size={16} />
                        Orders
                      </Link>

                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setShowMobileProfileDropdown(false)}
                      >
                        <Settings size={16} />
                        Settings
                      </Link>

                      {user.email && ['mr.onyanchaandrew@gmail.com', 'Mwapat@gmail.com'].includes(user.email.toLowerCase()) ? (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-700 font-medium hover:bg-blue-50 transition-colors"
                          onClick={() => setShowMobileProfileDropdown(false)}
                        >
                          <Shield size={16} />
                          Admin
                        </Link>
                      ) : null}
                    </div>

                    <div className="border-t border-gray-100 mt-1 py-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setIsCartOpen(true)} className="text-gray-800 relative p-1" aria-label="Cart">
              <MdOutlineShoppingCart size={24} />
              {mounted && displayCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-5 flex items-center justify-center px-1.5 shadow-sm">
                  {displayCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-in menu */}
      <div
        className={`fixed inset-0 z-[9999] transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu} />

        <div
          className={`absolute top-0 bottom-0 left-0 w-[85%] max-w-[340px] bg-white shadow-2xl transform transition-transform duration-400 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Car className="text-blue-700" size={20} />
                <span className="font-bold text-gray-800">Menu</span>
              </div>
              <button onClick={closeMobileMenu} className="p-2 text-gray-700 hover:text-blue-700">
                <X size={24} />
              </button>
            </div>

            {/* Mobile menu search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search auto parts..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300  text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            <nav className="flex-1 px-2 py-2 overflow-y-auto">
              {menuItems.map((item, index) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-4 px-5 py-3 text-base font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-700  transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <item.icon size={18} className="text-blue-700" />
                    {item.label}
                  </Link>
                  {index < menuItems.length - 1 && (
                    <div className="mx-5 my-2 h-px bg-gray-200" />
                  )}
                </div>
              ))}
            </nav>

            <div className="p-5 border-t border-gray-200">
              <Link
                href={user ? "/#account" : "/#account/login"}
                className="flex items-center gap-4 py-4 text-gray-800 hover:text-blue-700 font-medium"
                onClick={closeMobileMenu}
              >
                <UserAvatar size={36} />
                {user ? "My Account" : "Sign in"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </header>
  );
}