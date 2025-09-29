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
    // This effect should run only once on mount.
    const checkAuth = async () => {
      try {
        // First, check for a redirect result. This is crucial.
        // It returns a UserCredential on success or null if no redirect operation was pending.
        const result = await getRedirectResult(auth);
        
        if (result) {
          // A user has successfully signed in via redirect.
          // The onAuthStateChanged listener below will catch this user,
          // so we just need to ensure we redirect them to the dashboard.
          setUser(result.user);
          router.push('/dashboard');
          // We can stop here for this render, as the state update and redirect are queued.
          // The next run of the auth listener will handle the session.
          setLoading(false);
          return;
        }

        // If there was no redirect, set up the normal auth state listener.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          
          const isAuthPage = pathname === '/login' || pathname === '/signup';

          if (currentUser) {
            // User is signed in.
            if (isAuthPage) {
              // If they are on an auth page, send them to the dashboard.
              router.push('/dashboard');
            }
          } else {
            // User is signed out.
            if (!isAuthPage) {
              // If they are on a protected page, send them to login.
              router.push('/login');
            }
          }
          setLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();

      } catch (error) {
        console.error("Firebase auth error:", error);
        // If there's an error, ensure we stop loading and redirect to login
        setLoading(false);
        router.push('/login');
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  
  // While loading, we show a loader to prevent flickers or showing the wrong page.
  // Exception: if we are already on an auth page, we can render it while checking auth in the background.
  if (loading && !isAuthPage) {
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
