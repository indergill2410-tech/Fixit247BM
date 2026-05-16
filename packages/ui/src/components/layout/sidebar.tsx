'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SidebarProps {
  children: React.ReactNode;
  collapsed?: boolean;
  className?: string;
}

export function Sidebar({ children, collapsed = false, className }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'flex h-full flex-col border-r border-border bg-card overflow-hidden',
        className,
      )}
    >
      {children}
    </motion.aside>
  );
}

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
  badge?: string | number;
}

export function SidebarNavItem({
  icon,
  label,
  href,
  active = false,
  collapsed = false,
  badge,
}: SidebarNavItemProps) {
  return (
    <a
      href={href}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
        active
          ? 'bg-brand-50 text-brand-700'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span>
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {badge !== undefined && !collapsed && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs text-white">
          {badge}
        </span>
      )}
    </a>
  );
}
