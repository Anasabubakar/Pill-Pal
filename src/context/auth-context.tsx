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
      return; // Do nothing until authentication state is determined
    }

    const isPublicPage = publicRoutes.includes(pathname);
    const isVerificationPage = pathname === verificationRoute;

    if (user) {
      // User is logged in
      if (!user.emailVerified && !isVerificationPage) {
        // and not verified, and not on verification page -> redirect to verify
        router.push(`${verificationRoute}?email=${user.email}`);
      } else if (user.emailVerified && isPublicPage) {
        // and verified, but on a public page -> redirect to dashboard
        router.push('/dashboard');
      }
    } else {
      // No user is logged in
      if (!isPublicPage) {
        // and not on a public page -> redirect to login
        router.push('/login');
      }
    }
  }, [user, loading, pathname, router]);
  
  // This is the main gatekeeper. If we are loading, show a full screen loader.
  // If we are not loading AND there is no user, but we're on a protected page,
  // AuthProvider's effect will redirect, but showing loader is fine to prevent flicker.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg">Authenticating...</div>
      </div>
    );
  }

  // If not loading and not a user, and on a public page, show the page.
  if (!user && publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // If we have a user, proceed to render the app (which includes DataProvider).
  if (user) {
     return (
      <AuthContext.Provider value={{ user, loading }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // Fallback for edge cases, typically shows loader while redirecting.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-lg">Authenticating...</div>
    </div>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
