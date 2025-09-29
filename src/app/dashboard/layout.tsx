import type { ReactNode } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { DataProvider } from '@/context/data-context';
import { AuthProvider } from '@/context/auth-context';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="flex min-h-screen w-full bg-background font-body">
          <SidebarNav />
          <main className="flex-1 flex flex-col animate-in fade-in duration-500">
            {children}
          </main>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}
