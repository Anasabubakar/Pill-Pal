'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    let hasVisited = false;
    try {
        hasVisited = localStorage.getItem('hasVisitedPillPal') === 'true';
    } catch (error) {
        console.error("Could not access localStorage. Defaulting to login.", error);
        // If localStorage is blocked or unavailable, default to showing the login page
        // to avoid getting stuck in an onboarding loop.
        router.replace('/login');
        return;
    }

    if (hasVisited) {
      router.replace('/login');
    } else {
      router.replace('/onboarding');
    }
  }, [router]);

  return (
    // You can render a loading spinner here while the redirect is happening
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-lg">Loading...</div>
    </div>
  );
}
