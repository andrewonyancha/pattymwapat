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
  ChevronRight,
} from "lucide-react";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoFastFood } from "react-icons/io5";

import { PiPlantFill } from "react-icons/pi";
import Image from "next/image";
import { CiMenuBurger } from "react-icons/ci";
import { FaShopify } from "react-icons/fa6";
import { useCartStore } from "../lib/cartStore";
import CartDrawer from "./shop/CartDrawer";
import {
  GiWaterBottle,
  GiCarrot,
  GiBroccoli,
  GiOrangeSlice,

} from "react-icons/gi";
import { RiDrinksFill } from "react-icons/ri";

import { HiMiniGift } from "react-icons/hi2";
import { IoIosApps } from "react-icons/io";
import { TbBowlSpoon } from "react-icons/tb";
import { TbSaladFilled } from "react-icons/tb";


// Auth store & signOut
import { useAuthStore } from "../lib/authStore";
import { signOut } from "../lib/firebase/auth";

const categories = [
  { name: "Vegetables", slug: "vegetables", icon: GiBroccoli, isSubcategory: false },
  { name: "Fruits", slug: "fruits", icon: GiOrangeSlice, isSubcategory: false },
  { name: "Tubers", slug: "tubers", icon: GiCarrot, isSubcategory: false },
  { name: "Juices", slug: "juices", icon: GiWaterBottle, isSubcategory: false, isParent: true },
  { name: "Fruit Juices", slug: "fruit juices", icon: GiWaterBottle, isSubcategory: true },
  { name: "Vegetable Juices", slug: "vegetable juices", icon: GiWaterBottle, isSubcategory: true },
  { name: "Detox Juices", slug: "detox juices", icon: GiWaterBottle, isSubcategory: true },
  { name: "Smoothies", slug: "smoothies", icon: RiDrinksFill, isSubcategory: false, isParent: true },
  { name: "Fresh Smoothies", slug: "fresh smoothies", icon: RiDrinksFill, isSubcategory: true },
  { name: "Green Smoothies", slug: "green smoothies", icon: RiDrinksFill, isSubcategory: true },
  { name: "Salads", slug: "salads", icon: TbSaladFilled, isSubcategory: false, isParent: true },
  { name: "Vegetable Salads", slug: "vegetable salads", icon: TbSaladFilled, isSubcategory: true },
  { name: "Fruit Salads", slug: "fruit salads", icon: TbSaladFilled, isSubcategory: true },
  { name: "Other", slug: "other", icon: TbBowlSpoon, isSubcategory: false },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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
    { label: "Categories", href: "/shop", hasDropdown: true, icon: IoIosApps },
    { label: "Shop", href: "/shop", icon: FaShopify },
    { label: "More products", href: "/more-products", icon: IoFastFood },
    { label: "Special Offers", href: "/special-offers", icon: HiMiniGift },
    { label: "About Us", href: "/about", icon: PiPlantFill },
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
    const initial = text.charAt(0).toUpperCase();

    return (
      <div
        className={`
          w-[26px] h-[26px] 
          rounded-full 
          bg-green-700 text-white 
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
                 <Image src="/logo.png" alt="PemaFarm Logo" fill sizes="64px" className="object-contain" priority />
               </div>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search fresh vegetables, fruits, juices..."
                className="w-full pl-5 pr-12 py-3 bg-stone-100 rounded-full text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-400 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button type="submit" aria-label="Search" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-700 transition">
                <Search size={22} />
              </button>
            </form>
          </div>

          {/* User + Cart */}
          <div className="flex items-center gap-8">
            {!isLoading && !user ? (
              <Link href="/account/login" className="text-gray-600 hover:text-green-700 transition" title="Sign in">
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
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-base font-medium text-gray-900 truncate">
                        {user.displayName || "Welcome"}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        onClick={() => setShowDesktopProfileDropdown(false)}
                      >
                        <User size={18} />
                        My Account
                      </Link>

                      <Link
                        href="/account/orders"
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        onClick={() => setShowDesktopProfileDropdown(false)}
                      >
                        <Package size={18} />
                        Orders
                      </Link>

                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        onClick={() => setShowDesktopProfileDropdown(false)}
                      >
                        <Settings size={18} />
                        Settings
                      </Link>

                      {user.email && ['mr.onyanchaandrew@gmail.com', 'pemafreshgroceries@gmail.com'].includes(user.email.toLowerCase()) ? (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-green-700 font-medium hover:bg-green-50 transition-colors"
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
              className="text-gray-700 hover:text-green-700 transition relative cursor-pointer"
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
        <nav className="bg-green-700 text-white border-b border-green-600">
          <div className="container mx-auto px-4 lg:px-6">
            <ul className="flex items-center justify-center py-2.5">
              {menuItems.map((item, index) => (
                <li
                  key={item.label}
                  className="relative flex items-center"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold hover:text-black hover:underline transition-colors whitespace-nowrap group"
                  >
                    <item.icon size={18} className="group-hover:animate-bounce" />
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`}
                      />
                    )}
                  </Link>

                  {index < menuItems.length - 1 && (
                    <div className="h-5 w-px bg-white/30 mx-1" aria-hidden="true" />
                  )}

                  {item.hasDropdown && activeDropdown === item.label && (
                    <div
                      className="
                        absolute top-full left-0 -mt-2
                        bg-white text-gray-800 shadow-2xl rounded-xl
                        min-w-[280px] py-0 z-50 border border-gray-200 overflow-hidden
                      "
                    >
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        
                        // Main categories with subcategories (clickable with green)
                        if (cat.isParent) {
                          return (
                            <div
                              key={cat.slug}
                              className="flex items-center gap-3 px-3 py-0 text-sm font-medium  transition-all duration-150 group"
                            >
                              <Icon size={18} className="text-green-600 group-hover:text-green-700 transition-colors" strokeWidth={1.8} />
                              <span>{cat.name}</span>
                            </div>
                          );
                        }
                        
                        // Regular main categories (clickable)
                        if (!cat.isSubcategory) {
                          return (
                            <Link
                              key={cat.slug}
                              href={`/shop?category=${cat.name}`}
                              className="flex items-center gap-3 px-3 py-3 text-sm font-medium hover:bg-green-50 transition-all duration-150 group"
                            >
                              <Icon size={18} className="text-green-600 group-hover:text-green-700 transition-colors" strokeWidth={1.8} />
                              <span>{cat.name}</span>
                            </Link>
                          );
                        }
                        
                        // Subcategories (indented and clickable)
                        return (
                          <Link
                            key={cat.slug}
                            href={`/shop?category=${cat.name}`}
                            className="flex items-center gap-3 pl-12 pr-6 py-2 text-sm text-stone-600 hover:bg-green-50 hover:text-green-700 transition-all duration-150 group"
                          >
                            <ChevronRight size={12} className="text-stone-500 group-hover:text-green-600 transition-colors" strokeWidth={1.5} />
                            <span className="text-xs uppercase tracking-wide">{cat.name}</span>
                          </Link>
                        );
                      })}
                    </div>
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
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
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
            <button onClick={() => setShowMobileSearch(true)} aria-label="Search" className="text-gray-700 hover:text-green-700 p-1">
              <Search size={20} />
            </button>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
               <div className="relative w-16 h-16">
                 <Image src="/logo.png" alt="PemaFarm Logo" fill sizes="64px" className="object-contain" priority />
               </div>
          </Link>

          <div className="flex items-center gap-4">
            {!isLoading && !user ? (
              <Link href="/account/login" className="text-gray-700 hover:text-green-700 p-1" title="Sign in">
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
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.displayName || "Welcome"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        onClick={() => setShowMobileProfileDropdown(false)}
                      >
                        <User size={16} />
                        My Account
                      </Link>

                      <Link
                        href="/account/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        onClick={() => setShowMobileProfileDropdown(false)}
                      >
                        <Package size={16} />
                        Orders
                      </Link>

                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        onClick={() => setShowMobileProfileDropdown(false)}
                      >
                        <Settings size={16} />
                        Settings
                      </Link>

                      {user.email && ['mr.onyanchaandrew@gmail.com', 'pemafreshgroceries@gmail.com'].includes(user.email.toLowerCase()) ? (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-green-700 font-medium hover:bg-green-50 transition-colors"
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
                <PiPlantFill className="text-green-700" size={20} />
                <span className="font-bold text-gray-800">Menu</span>
              </div>
              <button onClick={closeMobileMenu} className="p-2 text-gray-700 hover:text-green-700">
                <X size={24} />
              </button>
            </div>

            {/* Mobile menu search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            <nav className="flex-1 px-2 py-2 overflow-y-auto">
              {menuItems.map((item, index) => (
                <div key={item.label}>
                  {item.label === "Categories" ? (
                    <>
                      <div className="flex items-center gap-4 px-5 py-3 text-base font-medium text-gray-800 bg-gray-50 rounded-xl mx-2 mt-2">
                        <item.icon size={18} className="text-green-700" />
                        {item.label}
                      </div>
                      <div className="pl-6 pr-2 mt-1 mb-4">
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          
                          // Main categories with subcategories (clickable with green)
                          if (cat.isParent) {
                            return (
                              <Link
                                key={cat.slug}
                                href={`/shop?category=${cat.name}`}
                                className="flex items-center gap-3 px-5 py-2.5 text-[15px] text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                onClick={closeMobileMenu}
                              >
                                <Icon size={18} className="text-green-600" />
                                {cat.name}
                              </Link>
                            );
                          }
                          
                          // Regular main categories and subcategories (clickable)
                          return (
                            <Link
                              key={cat.slug}
                              href={`/shop?category=${cat.name}`}
                              className={`flex items-center gap-3 px-5 py-2.5 text-[15px] hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors ${
                                cat.isSubcategory ? 'pl-12 text-stone-600' : 'text-gray-700'
                              }`}
                              onClick={closeMobileMenu}
                            >
                              <Icon size={cat.isSubcategory ? 16 : 18} className={cat.isSubcategory ? 'text-stone-500' : 'text-green-600'} />
                              {cat.name}
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 px-5 py-3 text-base font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <item.icon size={16} className="text-green-700" />
                      {item.label}
                    </Link>
                  )}
                  {index < menuItems.length - 1 && (
                    <div className="mx-5 my-2 h-px bg-gray-200" />
                  )}
                </div>
              ))}
            </nav>

            <div className="p-5 border-t border-gray-200">
              <Link
                href={user ? "/account" : "/account/login"}
                className="flex items-center gap-4 py-4 text-gray-800 hover:text-green-700 font-medium"
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