// lib/firebase/auth.ts
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';

// Map Firebase error codes to user-friendly messages
const getFriendlyErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    // Login errors
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials and try again.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been deactivated. Please contact support.',
    'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
    'auth/session-expired': 'Your session has expired. Please sign in again.',
    'auth/requires-recent-login': 'Please sign in again to continue.',
    
    // Signup errors
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth_operation-not-allowed': 'Account creation is currently disabled. Please try again later.',
    
    // Password reset errors
    'auth/missing-email': 'Please enter your email address.',
    'auth/pending-credential': 'Please complete the previous action first.',
    
    // General errors
    'auth/configuration-not-found': 'Authentication service is unavailable. Please contact support.',
    'auth/invalid-api-key': 'System configuration error. Please contact support.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// Set auth cookie
const setAuthCookie = async (user: User) => {
  const token = await user.getIdToken();
  document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Strict`;
};

// Remove auth cookie
const removeAuthCookie = () => {
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
};

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string) => {
  if (!isFirebaseConfigured) {
    return { user: null, error: 'Authentication service is unavailable. Please try again later.' };
  }
  if (!auth) {
    return { user: null, error: 'Authentication service is unavailable. Please try again later.' };
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await setAuthCookie(result.user);
    return { user: result.user, error: null };
  } catch (error: any) {
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    return { user: null, error: friendlyMessage };
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (email: string, password: string) => {
  if (!isFirebaseConfigured) {
    return { user: null, error: 'Authentication service is unavailable. Please try again later.' };
  }
  if (!auth) {
    return { user: null, error: 'Authentication service is unavailable. Please try again later.' };
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setAuthCookie(result.user);
    return { user: result.user, error: null };
  } catch (error: any) {
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    return { user: null, error: friendlyMessage };
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    return { user: null, error: 'Authentication service is unavailable. Please try again later.' };
  }
  if (!auth) {
    return { user: null, error: 'Authentication service is unavailable. Please try again later.' };
  }
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await setAuthCookie(result.user);
    return { user: result.user, error: null };
  } catch (error: any) {
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    return { user: null, error: friendlyMessage };
  }
};

// Sign Out
export const signOut = async () => {
  if (!isFirebaseConfigured) {
    return { error: 'Authentication service is unavailable. Please try again later.' };
  }
  if (!auth) {
    return { error: 'Authentication service is unavailable. Please try again later.' };
  }
  try {
    await firebaseSignOut(auth);
    removeAuthCookie();
    return { error: null };
  } catch (error: any) {
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    return { error: friendlyMessage };
  }
};

// Get current user token for API calls
export const getCurrentUserToken = async (): Promise<string | null> => {
  if (!auth || !isFirebaseConfigured) return null;
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};

// Password Reset
export const resetPassword = async (email: string) => {
  if (!isFirebaseConfigured) {
    return { error: 'Authentication service is unavailable. Please try again later.' };
  }
  if (!auth) {
    return { error: 'Authentication service is unavailable. Please try again later.' };
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    return { success: false, error: friendlyMessage };
  }
};
