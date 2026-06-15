// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // 1. Process redirect result if any
    getRedirectResult(auth).catch((error) => {
      console.error('Error resolving Google Auth redirect:', error);
      setLoading(false);
    });

    // 2. Listen to auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      clearTimeout(timeout);
    });

    // 3. Fallback timeout (if Firebase gets stuck forever)
    timeout = setTimeout(() => {
      console.warn('Auth state loading timed out. Forcing UI to load.');
      setLoading(false);
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return { user, loading, signInWithGoogle, signOut };
}
