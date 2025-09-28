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
      setLoading(true);
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has just signed in via redirect.
          // We can navigate to the dashboard immediately.
          // onAuthStateChanged will still fire and set the user state.
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Error processing redirect result:", error);
      }
      
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        
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
  }, [auth]);

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
