'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, Moon, Sun } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from 'next-themes';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export function UserNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const auth = getAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getInitials = (emailOrName: string) => {
    if (!emailOrName) return 'U';
    const names = emailOrName.split(' ');
    if (names.length > 1 && names[1]) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return emailOrName.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="hidden md:flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-auto w-full justify-start gap-2 p-2 md:p-0">
           <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User Avatar'} />
            <AvatarFallback>{user ? getInitials(user.displayName || user.email!) : 'U'}</AvatarFallback>
          </Avatar>
           <div className="hidden md:flex flex-col items-start overflow-hidden">
             <p className="text-sm font-medium leading-none truncate">
              {loading ? 'Loading...' : user?.displayName || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {loading ? '' : user?.email}
            </p>
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
        <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
            <div className="flex items-center gap-2">
              {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <Label htmlFor="dark-mode" className="cursor-pointer">Dark Mode</Label>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Preferences</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
