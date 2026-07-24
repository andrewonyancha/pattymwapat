// components/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAuthStore } from '../lib/authStore';
import { auth, isFirebaseConfigured } from '../lib/firebase/config';

// Helper to set Firebase ID token in cookie
const setAuthTokenCookie = async (user: User | null) => {
  if (!user) {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
    return;
  }

  try {
    // Force token refresh to get a fresh token
    const token = await user.getIdToken(true);
    document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;
  } catch (error) {
    console.error('Error getting ID token:', error);
    // Fallback: remove cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsLoading } = useAuthStore();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsLoading(false);

      // Set the Firebase ID token in cookie for server-side verification
      await setAuthTokenCookie(user);
    });

    return () => unsubscribe();
  }, [setUser, setIsLoading]);

  return children;
}