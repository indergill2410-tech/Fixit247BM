'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wrench, MessageSquare, User,
  DollarSign, Calendar, FileText, Shield, Users, Settings,
  BarChart3, ChevronLeft, ChevronRight, LogOut,
  Zap, CreditCard, Heart, Menu, X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, Badge } from '@fixit247/ui';
import { cn } from '@fixit247/ui/src/lib/utils';
import type { Role } from '@fixit247/auth';
import { useAuth } from '@/hooks/use-auth';
import { NotificationBell } from '@/components/features/notifications/notification-bell';

const NAV_CONFIG: Record<string, { label: string; href: string; icon: React.ElementType; badge?: number; highlight?: boolean }[]> = {
  CUSTOMER: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Jobs', href: '/jobs', icon: Wrench },
    { label: 'Emergency', href: '/jobs/emergency', icon: Zap, highlight: true },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Saved Tradies', href: '/saved-tradies', icon: Heart },
    { label: 'Invoices', href: '/invoices', icon: CreditCard },
    { label: 'Profile', href: '/profile', icon: User },
  ],
  TRADIE: [
    { label: 'Dashboard', href: '/tradie/dashboard', icon: LayoutDashboard },
    { label: 'Offers', href: '/tradie/offers', icon: Zap, highlight: true },
    { label: 'My Jobs', href: '/tradie/jobs', icon: Wrench },
    { label: 'Availability', href: '/tradie/availability', icon: Calendar },
    { label: 'Earnings', href: '/tradie/earnings', icon: DollarSign },
    { label: 'Documents', href: '/tradie/documents', icon: FileText },
    { label: 'Messages', href: '/tradie/messages', icon: MessageSquare },
    { label: 'Profile', href: '/tradie/profile', icon: User },
  ],
  ADMIN: [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Jobs', href: '/admin/jobs', icon: Wrench },
    { label: 'Verifications', href: '/admin/verifications', icon: Shield, badge: 14 },
    { label: 'Payments', href: '/admin/payments', icon: DollarSign },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  SUPER_ADMIN: [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Jobs', href: '/admin/jobs', icon: Wrench },
    { label: 'Verifications', href: '/admin/verifications', icon: Shield, badge: 14 },
    { label: 'Payments', href: '/admin/payments', icon: DollarSign },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
};

export function DashboardShell({ children, role }: { children: React.ReactNode; role: Role }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const navItems = NAV_CONFIG[role] ?? [];

  return (
    <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/70 lg:hidden"
            onClick={() => { setMobileOpen(false); }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-background-elevated transition-transform',
          'lg:relative lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <svg width="22" height="22" viewBox="0 0 172 176" fill="none">
                  <defs><linearGradient id="dashlogo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FCD34D"/><stop offset="100%" stopColor="#D97706"/></linearGradient></defs>
                  <rect x="0" y="4" width="172" height="172" rx="36" fill="url(#dashlogo)"/>
                  <path d="M118 22C138 22 154 37 156 57C157 69 152 80 143 87L90 140L95 145C98 148 98 154 95 157L65 187C59 193 49 193 43 187C37 181 37 171 43 165L73 135C76 132 82 132 85 135L90 140L143 87C151 80 156 69 154 57C151 38 136 22 118 22Z M118 42C128 42 136 50 136 60C136 67 132 73 127 77L108 58C112 53 115 48 116 42C116.7 42 117.3 42 118 42Z" fill="#1E2235" fillRule="evenodd"/>
                </svg>
                <span className="text-sm font-extrabold text-foreground">Fixit <span className="text-brand-400">24/7</span></span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => { setCollapsed(!collapsed); }}
            className="hidden rounded-lg p-1.5 text-foreground-muted hover:bg-background-alt hover:text-foreground lg:flex"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button onClick={() => { setMobileOpen(false); }} className="rounded-lg p-1.5 text-foreground-muted hover:bg-background-alt hover:text-foreground lg:hidden">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href} href={item.href} onClick={() => { setMobileOpen(false); }}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                    : item.highlight
                    ? 'text-red-500 hover:bg-red-500/10 dark:text-red-400'
                    : 'text-foreground-muted hover:bg-background-alt hover:text-foreground',
                )}
              >
                <Icon size={18} className="shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge !== undefined && !collapsed && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs text-gray-900 font-bold">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !collapsed && (
                  <span className="ml-auto text-xs font-bold text-brand-500">24/7</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className={cn('border-t border-border p-3', collapsed && 'flex justify-center')}>
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl p-2">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user?.avatarUrl ?? undefined} />
                <AvatarFallback className="bg-brand-500/20 text-brand-400 text-xs">
                  {(user?.firstName[0] ?? '') + (user?.lastName[0] ?? '')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="truncate text-xs text-foreground-subtle">{user?.email}</p>
              </div>
              <button onClick={signOut} className="shrink-0 rounded-lg p-1 text-foreground-muted hover:bg-background-alt hover:text-foreground" aria-label="Sign out">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button onClick={signOut} className="rounded-lg p-2 text-foreground-muted hover:bg-background-alt hover:text-foreground">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background-elevated px-4 lg:px-6">
          <button onClick={() => { setMobileOpen(true); }} className="rounded-lg p-2 text-foreground-muted hover:bg-background-alt hover:text-foreground lg:hidden">
            <Menu size={20} />
          </button>
          <div className="flex flex-1 items-center justify-end gap-2">
            <NotificationBell />
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.avatarUrl ?? undefined} />
              <AvatarFallback className="bg-brand-500/20 text-brand-400 text-xs">
                {(user?.firstName[0] ?? '') + (user?.lastName[0] ?? '')}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-7xl p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions, badge }: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: { label: string; variant?: 'default' | 'warning' | 'success' | 'emergency' };
}) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{title}</h1>
          {badge && <Badge variant={badge.variant ?? 'default'}>{badge.label}</Badge>}
        </div>
        {description && <p className="mt-1.5 text-sm text-foreground-subtle">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatsGrid({ children, cols = 4 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  return (
    <div className={cn('grid gap-4', {
      'grid-cols-1 sm:grid-cols-2': cols === 2,
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': cols === 3,
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': cols === 4,
    })}>
      {children}
    </div>
  );
}
