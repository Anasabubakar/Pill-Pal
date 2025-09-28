'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, getRedirectResult, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth(app);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // First, check if there's a redirect result from Google Sign-In
        // This promise resolves to null if there was no redirect
        const result = await getRedirectResult(auth);
        if (result) {
          // If we have a result, a user has just signed in.
          // onAuthStateChanged will handle the user state and navigation.
          // We can set loading to false here as we know the auth state is resolved.
          setLoading(false);
          return; // Stop further processing in this effect for now
        }
      } catch (error) {
        console.error("Error processing redirect result:", error);
      }
      
      // If there was no redirect, set up the normal auth state listener
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false); // Auth state is now confirmed
        
        const isAuthPage = pathname === '/login' || pathname === '/signup';

        if (currentUser) {
          if (isAuthPage) {
            router.push('/dashboard');
          }
        } else {
          if (!isAuthPage) {
            router.push('/login');
          }
        }
      });

      return () => unsubscribe();
    };

    processAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]); // Run only once on mount

  if (loading) {
     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <AuthContext.Provider value={{ user, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
