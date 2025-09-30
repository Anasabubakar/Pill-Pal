"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Pill, ClipboardList, Sparkles, LogOut, Settings } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/medications', label: 'Medications', icon: Pill },
  { href: '/dashboard/logs', label: 'Logs', icon: ClipboardList },
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

  const getInitials = (emailOrName: string) => {
    if (!emailOrName) return 'U';
    const names = emailOrName.split(' ');
    if (names.length > 1) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return emailOrName.charAt(0).toUpperCase();
  }

  return (
    <aside className="w-64 flex-col border-r bg-card p-4 hidden md:flex animate-in slide-in-from-left-12 duration-500">
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
      <div className="mt-auto">
        <Separator className="my-4" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 w-full justify-start h-auto p-0">
               <Avatar>
                 <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                 <AvatarFallback>{user ? getInitials(user.displayName || user.email!) : 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="font-medium truncate max-w-[150px]">
                  {loading ? 'Loading...' : user?.displayName || user?.email}
                </span>
                <span className="text-xs text-muted-foreground">{loading ? '' : 'user'}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                   {loading ? 'Loading...' : user?.displayName || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {loading ? '' : user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
