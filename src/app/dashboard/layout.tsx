'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { SidebarNav, navItems } from '@/components/sidebar-nav';
import { DataProvider } from '@/context/data-context';
import { AuthProvider } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { UserNav } from '@/components/user-nav';

function MobileNav() {
  const pathname = usePathname();
  return (
     <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-card p-4">
         <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
         <div className="flex items-center gap-2 pb-4 border-b mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">Pill Pal</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-card-foreground transition-all duration-300 ease-in-out hover:bg-accent/50 hover:text-accent-foreground',
                  {
                    'bg-accent text-accent-foreground font-semibold': pathname === item.href,
                  }
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <DataProvider>
        <div className="flex min-h-screen w-full bg-background font-body">
          <SidebarNav />
          <main className="flex-1 flex flex-col relative">
             <header className="flex h-14 items-center gap-4 border-b bg-card px-6 md:hidden">
                <MobileNav />
                 <div className="flex items-center gap-2">
                    <Logo className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold font-headline text-primary">Pill Pal</h1>
                </div>
                <div className="ml-auto">
                  <UserNav />
                </div>
            </header>
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
