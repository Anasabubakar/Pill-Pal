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
    // This flag helps prevent race conditions
    let isProcessingRedirect = true;

    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // A user has just signed in via redirect.
          // onAuthStateChanged will handle setting the user and redirecting.
          console.log('Redirect result processed.');
        }
      })
      .catch((error) => {
        console.error("Error processing redirect result:", error);
      })
      .finally(() => {
        isProcessingRedirect = false;
        // Trigger a state update if needed, though onAuthStateChanged should handle it.
        setLoading(false); 
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Only set loading to false after the first auth state check completes.
      if (!isProcessingRedirect) {
        setLoading(false);
      }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, router]); // Added router to dependency array

  // Show a loading indicator while processing auth state or redirect.
  const isPotentiallyAuthenticating = loading || pathname === '/login' || pathname === '/signup';

  if (isPotentiallyAuthenticating && loading) {
     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
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
