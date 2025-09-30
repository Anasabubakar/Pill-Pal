"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Pill, ClipboardList, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { UserNav } from '@/components/user-nav';

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/medications', label: 'Medications', icon: Pill },
  { href: '/dashboard/logs', label: 'Logs', icon: ClipboardList },
  { href: '/dashboard/ask-ai', label: 'Ask AI', icon: Sparkles },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-col border-r bg-card p-4 hidden md:flex animate-in slide-in-from-left-12 duration-500 h-full">
      <div className="flex items-center gap-2 pb-4">
        <Logo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-primary">Pill Pal</h1>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-card-foreground transition-all duration-300 ease-in-out hover:bg-accent/50 hover:text-accent-foreground hover:scale-105',
              {
                'bg-accent text-accent-foreground font-semibold': pathname === item.href,
              }
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex-shrink-0">
        <Separator className="my-4" />
        <UserNav />
      </div>
    </aside>
  );
}
