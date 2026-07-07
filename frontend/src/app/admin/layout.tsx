'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  Ticket,
  LogOut,
  Store,
  Menu,
  X,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: ShoppingBag },
  { label: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { label: 'Customers', href: '/admin/users', icon: Users },
  { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // If loading, show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--brand-red)] mb-4" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Verifying credentials...
        </p>
      </div>
    );
  }

  // If not authenticated or not admin, show Access Denied
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background max-w-md w-full rounded-3xl p-8 sm:p-10 text-center shadow-xl border border-border"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--brand-red)] animate-bounce">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Access Denied</h1>
          <p className="text-muted-foreground text-sm mb-8">
            You do not have administrative privileges to access this area. If you believe this is an error, please log in with an administrator account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 h-11 flex items-center justify-center rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              className="flex-1 h-11 flex items-center justify-center rounded-xl border border-border hover:bg-muted/50 font-semibold transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-background shrink-0 sticky top-0 h-screen">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm">
            B
          </div>
          <span className="font-bold tracking-tight text-lg text-foreground">
            Store Console
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                  active
                    ? 'bg-[var(--brand-red)]/10 text-[var(--brand-red)]'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', active ? 'text-[var(--brand-red)]' : '')} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Store className="h-5 w-5" />
            Main Shop
          </Link>
          <button
            onClick={() => {
              dispatch(logout());
              router.push('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-500 hover:bg-red-500/5 transition-all text-left"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b bg-background flex items-center justify-between px-4 sticky top-0 z-40">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm">
              B
            </div>
            <span className="font-bold tracking-tight text-md">Console</span>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black z-40 lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r z-50 flex flex-col lg:hidden"
              >
                <div className="h-16 flex items-center gap-2.5 px-6 border-b">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm">
                    B
                  </div>
                  <span className="font-bold tracking-tight text-lg">Store Console</span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1">
                  {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all',
                          active
                            ? 'bg-[var(--brand-red)]/10 text-[var(--brand-red)]'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t space-y-1">
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                  >
                    <Store className="h-5 w-5" />
                    Main Shop
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logout());
                      router.push('/login');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-500 hover:bg-red-500/5 transition-all text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Dashboard Pages */}
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
