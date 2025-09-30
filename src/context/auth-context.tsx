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
const verificationRoute = '/verify-email';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const isPublicPage = publicRoutes.includes(pathname);
    const isVerificationPage = pathname === verificationRoute;

    if (user) {
      if (!user.emailVerified && !isVerificationPage) {
        router.push(`${verificationRoute}?email=${user.email}`);
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

  const isPublicPage = publicRoutes.includes(pathname);
  if (!isPublicPage && !user) {
    // On a protected page, but no user. Redirect is happening. Show loader.
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (user && user.emailVerified && isPublicPage) {
    // On a public page, but user is logged in. Redirect is happening. Show loader.
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (user && !user.emailVerified && pathname !== verificationRoute) {
    // User is not verified and not on the verification page. Redirect is happening.
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
