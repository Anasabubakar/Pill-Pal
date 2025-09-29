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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Prevent dashboard flicker for unverified users
  if (user && !user.emailVerified && pathname !== '/verify-email') {
     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Prevent dashboard flicker for logged-in users on public pages
  if (user && user.emailVerified && publicRoutes.includes(pathname)) {
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
