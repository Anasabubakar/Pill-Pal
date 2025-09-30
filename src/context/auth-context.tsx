
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/login', '/signup', '/verify-email'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (loading) return;

    const isPublicPage = publicRoutes.includes(pathname);

    if (user) {
      if (!user.emailVerified && pathname !== '/verify-email') {
        router.push(`/verify-email?email=${user.email}`);
      } else if (user.emailVerified && isPublicPage) {
        router.push('/dashboard');
      }
    } else {
      if (!isPublicPage) {
        router.push('/login');
      }
    }
  }, [user, loading, pathname, router]);

  const isPublicRoute = publicRoutes.includes(pathname);

  // While the initial user check is loading, show a full-screen loader.
  // This prevents any child components from rendering prematurely.
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If the route is not public and there's no user, we are in a redirect state.
  // Show a loader to prevent flicker.
  if (!isPublicRoute && !user) {
     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // If the user exists but is on a public route, we are redirecting to dashboard.
  if (user && isPublicRoute) {
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
