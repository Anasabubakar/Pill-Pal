'use client';

import { createContext, useContext, useEffect, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface UserSettings {
  notificationPreferences?: {
    email?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userSettings: UserSettings | null;
  setUserSettings: Dispatch<SetStateAction<UserSettings | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const db = getFirestore(app);

const publicRoutes = ['/login', '/signup', '/verify-email'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
        setUserSettings(null);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeSettings = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserSettings(doc.data() as UserSettings);
        }
        // Set loading to false once user and their settings are loaded
        setLoading(false);
      });
      return () => unsubscribeSettings();
    }
  }, [user]);


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
    <AuthContext.Provider value={{ user, loading, userSettings, setUserSettings }}>
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
