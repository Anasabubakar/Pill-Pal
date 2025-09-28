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
    // First, check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // If we get a result, a user has just signed in.
          // onAuthStateChanged will handle the user state update.
          // We can force a redirect to the dashboard.
          router.push('/dashboard');
        }
      })
      .catch((error) => {
        // Handle Errors here.
        console.error("Error during redirect result:", error);
      })
      .finally(() => {
        // Now, set up the auth state listener
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
          
          const isAuthPage = pathname === '/login' || pathname === '/signup';

          if (!currentUser && !isAuthPage) {
            router.push('/login');
          }
          if (currentUser && isAuthPage) {
            router.push('/dashboard');
          }
        });
        
        return () => unsubscribe();
      });
  }, [auth, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <div className="flex items-center justify-center min-h-screen">Loading...</div> : children}
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
