'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SidebarNav } from '@/components/sidebar-nav';
import { DataProvider } from '@/context/data-context';
import { AuthProvider } from '@/context/auth-context';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <DataProvider>
        <div className="flex min-h-screen w-full bg-background font-body">
          <SidebarNav />
          <main className="flex-1 flex flex-col relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}
