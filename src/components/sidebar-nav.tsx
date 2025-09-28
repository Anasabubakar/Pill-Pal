"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Pill, ClipboardList, Users, Sparkles, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/medications', label: 'Medications', icon: Pill },
  { href: '/dashboard/logs', label: 'Logs', icon: ClipboardList },
  { href: '/dashboard/guardians', label: 'Guardians', icon: Users },
  { href: '/dashboard/ask-ai', label: 'Ask AI', icon: Sparkles },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  }

  return (
    <aside className="w-64 flex-col border-r bg-card p-4 hidden md:flex">
      <div className="flex items-center gap-2 pb-4">
        <Logo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-primary">Pill Pal</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-card-foreground transition-all hover:bg-accent/50 hover:text-accent-foreground',
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
      <div className="mt-auto">
        <Separator className="my-4" />
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{user ? getInitials(user.email!) : 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{loading ? 'Loading...' : user?.displayName || user?.email}</span>
            <span className="text-xs text-muted-foreground">{loading ? '' : 'user'}</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
