import type { ReactNode } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background font-body">
      <SidebarNav />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
