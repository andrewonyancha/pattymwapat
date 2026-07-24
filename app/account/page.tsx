// app/account/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, User, Package, Settings, Mail } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '../lib/authStore';
import { signOut } from '../lib/firebase/auth';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/account/login');
    }
  }, [user, router]);


  const handleLogout = async () => {
    await signOut();
    logout();
    router.push('/account/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-8 border-b border-stone-200">
          <h1 className="text-3xl font-light text-stone-900">My Account</h1>
          <div className="text-stone-600 mt-2 space-y-1">
            <p className="flex items-center gap-2">
              <User size={16} />
              <span>Welcome , {user.displayName || user.email}</span>
            </p>
            {user.email && (
              <p className="flex items-center gap-2 text-sm">
                <Mail size={14} />
                <span>{user.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          {/* <div className="bg-stone-50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <User className="h-8 w-8 text-green-700 mb-4" />
            <h2 className="text-xl font-medium text-stone-900 mb-2">Profile</h2>
            <p className="text-stone-600 text-sm mb-4">Manage your personal information</p>
            <Link href="/account/profile" className="text-green-700 hover:text-green-800 text-sm font-medium">
              View profile →
            </Link>
          </div> */}

          {/* Orders Card */}
          <div className="bg-stone-50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <Package className="h-8 w-8 text-green-700 mb-4" />
            <h2 className="text-xl font-medium text-stone-900 mb-2">Orders</h2>
            <p className="text-stone-600 text-sm mb-4">Track and manage your orders</p>
            <Link href="/account/orders" className="text-green-700 hover:text-green-800 text-sm font-medium">
              View orders →
            </Link>
          </div>

          {/* Settings Card */}
          <div className="bg-stone-50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <Settings className="h-8 w-8 text-green-700 mb-4" />
            <h2 className="text-xl font-medium text-stone-900 mb-2">Settings</h2>
            <p className="text-stone-600 text-sm mb-4">Update your preferences</p>
            <Link href="/account" className="text-green-700 hover:text-green-800 text-sm font-medium">
              Manage settings →
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-6 py-4 border-t border-stone-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}