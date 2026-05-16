'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wrench, MessageSquare, User,
  DollarSign, Calendar, FileText, Shield, Users, Settings,
  BarChart3, ChevronLeft, ChevronRight, Bell, LogOut,
  Zap, CreditCard, Heart, Menu, X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, Badge } from '@fixit247/ui';
import { cn } from '@fixit247/ui/src/lib/utils';
import type { Role } from '@fixit247/auth';
import { useAuth } from '@/hooks/use-auth';

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
    { label: 'New Jobs', href: '/tradie/jobs', icon: Wrench },
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-gray-200 bg-white shadow-sm transition-transform',
          'lg:relative lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                  <span className="text-sm font-black text-white">F</span>
                </div>
                <span className="text-base font-bold text-gray-900">Fixit247</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:flex" aria-label="Toggle sidebar">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden"><X size={16} /></button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive ? 'bg-brand-50 text-brand-700' :
                  item.highlight ? 'text-red-600 hover:bg-red-50' :
                  'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                <Icon size={18} className="shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge !== undefined && !collapsed && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs text-white">{item.badge}</span>
                )}
                {item.highlight && !collapsed && <span className="ml-auto text-xs font-bold text-red-500">24/7</span>}
              </Link>
            );
          })}
        </nav>

        <div className={cn('border-t border-gray-100 p-3', collapsed && 'flex justify-center')}>
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl p-2">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user?.avatarUrl ?? undefined} />
                <AvatarFallback>{(user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="truncate text-xs text-gray-400">{user?.email}</p>
              </div>
              <button onClick={signOut} className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500" aria-label="Sign out"><LogOut size={14} /></button>
            </div>
          ) : (
            <button onClick={signOut} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"><LogOut size={16} /></button>
          )}
        </div>
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 lg:hidden"><Menu size={20} /></button>
          <div className="flex flex-1 items-center justify-end gap-2">
            <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.avatarUrl ?? undefined} />
              <AvatarFallback className="text-xs">{(user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">{title}</h1>
          {badge && <Badge variant={badge.variant ?? 'default'}>{badge.label}</Badge>}
        </div>
        {description && <p className="mt-1.5 text-sm text-gray-500">{description}</p>}
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
