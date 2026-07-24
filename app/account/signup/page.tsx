// app/account/signup/page.tsx
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { updateProfile } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle, signUpWithEmail } from '@/app/lib/firebase/auth';
import { useAuthStore } from '@/app/lib/authStore';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  // Determine redirect URL - if user is logged in and there's a redirect, go there
  const getRedirectUrl = () => {
    if (redirect) return redirect;
    return '/account';
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace(getRedirectUrl());
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError('Full name is required');
      setIsLoading(false);
      return;
    }

    const { user, error } = await signUpWithEmail(formData.email, formData.password);

    if (error) {
      setError(error);
      setIsLoading(false);
    } else if (user) {
      // Update display name
      try {
        await updateProfile(user, {
          displayName: formData.name.trim(),
        });
      } catch (profileError) {
        console.error('Error updating profile:', profileError);
        // non-blocking – still proceed
      }

      router.push(getRedirectUrl());
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    const { user, error } = await signInWithGoogle();

    if (error) {
      setError(error);
      setIsLoading(false);
    } else if (user) {
      router.push(getRedirectUrl());
    }
  };

  return (
    <div className="w-full max-w-md space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-stone-900">
          Create your account
        </h1>
        <p className="text-sm text-stone-500">
          Join PemaFarm
        </p>
        <p className="text-sm text-stone-500">
          Already have an account?{' '}
          <Link
            href="/account/login"
            className="text-blue-700 hover:text-blue-800 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3  text-sm flex items-center gap-2">
            <span>•</span>
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              disabled={isLoading}
              className="peer w-full px-0 pt-6 pb-2 bg-transparent border-b border-stone-200 text-stone-900 placeholder-transparent focus:border-blue-700 outline-none transition-colors"
            />
            <label
              htmlFor="name"
              className="absolute left-0 top-2 text-xs uppercase tracking-[0.15em] text-stone-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
            >
              Full name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              disabled={isLoading}
              className="peer w-full px-0 pt-6 pb-2 bg-transparent border-b border-stone-200 text-stone-900 placeholder-transparent focus:border-blue-700 outline-none transition-colors"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-2 text-xs uppercase tracking-[0.15em] text-stone-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
            >
              Email address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              disabled={isLoading}
              className="peer w-full px-0 pt-6 pb-2 bg-transparent border-b border-stone-200 text-stone-900 placeholder-transparent focus:border-blue-700 outline-none transition-colors pr-10"
            />
            <label
              htmlFor="password"
              className="absolute left-0 top-2 text-xs uppercase tracking-[0.15em] text-stone-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
            >
              Password
            </label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 focus:outline-none transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
              disabled={isLoading}
              className="peer w-full px-0 pt-6 pb-2 bg-transparent border-b border-stone-200 text-stone-900 placeholder-transparent focus:border-blue-700 outline-none transition-colors pr-10"
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-0 top-2 text-xs uppercase tracking-[0.15em] text-stone-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
            >
              Confirm password
            </label>

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 focus:outline-none transition-colors p-1"
              aria-label={showConfirmPassword ? 'Hide confirmation' : 'Show confirmation'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-700 text-white py-4 px-6  font-medium uppercase tracking-[0.15em] text-sm hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest text-stone-400">
          <span className="bg-[#FDFDFD] px-4">or</span>
        </div>
      </div>

      {/* Google Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-4 px-6 border border-stone-200  bg-white text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <FcGoogle className="h-5 w-5" />
        Continue with Google
      </button>

      {/* Trust note */}
      <p className="text-center text-xs text-stone-400 pt-6">
        Secure sign-up • We never store your password
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={<div className="flex items-center justify-center"><div className="animate-spin  h-8 w-8 border-b-2 border-blue-700"></div></div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
