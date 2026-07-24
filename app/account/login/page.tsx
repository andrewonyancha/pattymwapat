'use client';

import { signInWithEmail, signInWithGoogle, resetPassword } from '@/app/lib/firebase/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/app/lib/authStore';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { user, error } = await signInWithEmail(email, password);

    if (error) {
      setError(error);
      setIsLoading(false);
    } else if (user) {
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setResetError('');

    const { success, error } = await resetPassword(resetEmail);

    if (error) {
      setResetError(error);
      setIsResetting(false);
    } else if (success) {
      setResetSent(true);
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-stone-900">
          Welcome 
        </h1>
        <p className="text-sm text-stone-500">
          Sign in to your account
        </p>
        <p className="text-sm text-stone-500">
          Or{' '}
          <Link
            href="/account/signup"
            className="text-green-700 hover:text-green-800 font-medium transition-colors"
          >
            create a new account
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
          {/* Email */}
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              disabled={isLoading}
              className="peer w-full px-0 pt-6 pb-2 bg-transparent border-b border-stone-200 text-stone-900 placeholder-transparent focus:border-green-700 outline-none transition-colors"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-2 text-xs uppercase tracking-[0.15em] text-stone-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
            >
              Email address
            </label>
          </div>

          {/* Password with visibility toggle */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              disabled={isLoading}
              className="peer w-full px-0 pt-6 pb-2 bg-transparent border-b border-stone-200 text-stone-900 placeholder-transparent focus:border-green-700 outline-none transition-colors pr-10"
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
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          {!showForgotPassword && (
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-green-700 hover:text-green-800 font-medium transition-colors"
            >
              Forgot Password?
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-700 text-white py-4 px-6  font-medium uppercase tracking-[0.15em] text-sm hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* Forgot Password Form */}
      {showForgotPassword && (
        <div className="mt-8">
          {resetSent ? (
            <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-4 text-sm">
              <p className="font-medium">Password reset email sent!</p>
              <p className="mt-1">Check your email for instructions to reset your password.</p>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetSent(false);
                  setResetEmail('');
                }}
                className="mt-3 text-green-700 hover:text-green-800 font-medium underline"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-sm text-stone-500 hover:text-stone-700 mb-2"
              >
                ← Back
              </button>

              {resetError && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm">
                  {resetError}
                </div>
              )}

              <div>
                <p className="text-sm text-stone-600 mb-4">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
                <input
                  id="reset-email"
                  name="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder=" "
                  disabled={isResetting}
                  className="peer w-full px-0 pt-6 pb-2 bg-transparent border-b border-stone-200 text-stone-900 placeholder-transparent focus:border-green-700 outline-none transition-colors"
                />
                <label
                  htmlFor="reset-email"
                  className="absolute left-0 top-2 text-xs uppercase tracking-[0.15em] text-stone-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
                >
                  Email address
                </label>
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full bg-green-700 text-white py-4 px-6 font-medium uppercase tracking-[0.15em] text-sm hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isResetting ? 'Sending...' : 'Send reset instructions'}
              </button>
            </form>
          )}
        </div>
      )}

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
        className="w-full flex items-center justify-center gap-3 py-4 px-6 border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <FcGoogle className="h-5 w-5" />
        Continue with Google
      </button>

      {/* Small trust note */}
      <p className="text-center text-xs text-stone-400 pt-6">
        Secure sign-in • We never store your password
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={<div className="flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
