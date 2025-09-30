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

  // This effect handles all redirection logic.
  useEffect(() => {
    // Wait until the initial auth state is determined.
    if (loading) {
      return;
    }

    const isPublicPage = publicRoutes.includes(pathname);
    const isVerificationPage = pathname === verificationRoute;

    if (user) {
      // If user is logged in...
      if (!user.emailVerified && !isVerificationPage) {
        // and email is not verified, and we are NOT on the verification page, redirect them there.
        router.push(`${verificationRoute}?email=${user.email}`);
      } else if (user.emailVerified && isPublicPage) {
        // and email is verified, but they are on a public page, redirect to dashboard.
        router.push('/dashboard');
      }
    } else {
      // If user is not logged in...
      if (!isPublicPage) {
        // and they are on a protected page, redirect to login.
        router.push('/login');
      }
    }
  }, [user, loading, pathname, router]);

  // This is the gatekeeper logic.
  if (loading) {
    // If Firebase auth is still loading, show a full-screen loader.
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const isPublicPage = publicRoutes.includes(pathname);
  
  // If we are on a protected route without a user, or on a public route with a verified user,
  // a redirect is in progress. Show a loader to prevent a flash of incorrect content.
  if ((!isPublicPage && !user) || (isPublicPage && user && user.emailVerified)) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If user email is not verified and we are not on the verify-email page, a redirect is in progress.
  if (user && !user.emailVerified && pathname !== verificationRoute) {
     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // At this point, the user's auth state is resolved and they are on the correct type of page.
  // Render the children.
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
