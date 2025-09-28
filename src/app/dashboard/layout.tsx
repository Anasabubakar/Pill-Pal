import type { ReactNode } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { DataProvider } from '@/context/data-context';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      <div className="flex min-h-screen w-full bg-background font-body">
        <SidebarNav />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </DataProvider>
  );
}
